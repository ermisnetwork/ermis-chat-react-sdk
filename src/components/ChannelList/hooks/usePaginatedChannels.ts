import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import uniqBy from 'lodash.uniqby';

import { MAX_QUERY_CHANNELS_LIMIT } from '../utils';

import type {
  Channel,
  ChannelFilters,
  ChannelOptions,
  ChannelSort,
  ErmisChat,
} from 'ermis-chat-js-sdk';

import { useChatContext } from '../../../context/ChatContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';
import type { ChannelsQueryState } from '../../Chat/hooks/useChannelsQueryState';
import { DEFAULT_INITIAL_CHANNEL_PAGE_SIZE } from '../../../constants/limits';
import { getChannelDirectName, getMembersChannel } from '../../../utils/getChannel';

const RECOVER_LOADED_CHANNELS_THROTTLE_INTERVAL_IN_MS = 5000;
const MIN_RECOVER_LOADED_CHANNELS_THROTTLE_INTERVAL_IN_MS = 2000;

type AllowedQueryType = Extract<ChannelsQueryState['queryInProgress'], 'reload' | 'load-more'>;

export type CustomQueryChannelParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  currentChannels: Array<Channel<ErmisChatGenerics>>;
  queryType: AllowedQueryType;
  setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>;
  setHasNextPage: React.Dispatch<React.SetStateAction<boolean>>;
};

export type CustomQueryChannelsFn<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = (params: CustomQueryChannelParams<ErmisChatGenerics>) => Promise<void>;

export const usePaginatedChannels = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  client: ErmisChat<ErmisChatGenerics>,
  filters: ChannelFilters<ErmisChatGenerics>,
  sort: ChannelSort<ErmisChatGenerics>,
  options: ChannelOptions,
  activeChannelHandler: (
    channels: Array<Channel<ErmisChatGenerics>>,
    setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
  ) => void,
  recoveryThrottleIntervalMs: number = RECOVER_LOADED_CHANNELS_THROTTLE_INTERVAL_IN_MS,
  customQueryChannels?: CustomQueryChannelsFn<ErmisChatGenerics>,
) => {
  const {
    channelsQueryState: { error, setError, setQueryInProgress },
  } = useChatContext('usePaginatedChannels');
  const [channels, setChannels] = useState<Array<Channel<ErmisChatGenerics>>>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const lastRecoveryTimestamp = useRef<number | undefined>();

  const recoveryThrottleInterval =
    recoveryThrottleIntervalMs < MIN_RECOVER_LOADED_CHANNELS_THROTTLE_INTERVAL_IN_MS
      ? MIN_RECOVER_LOADED_CHANNELS_THROTTLE_INTERVAL_IN_MS
      : recoveryThrottleIntervalMs ?? RECOVER_LOADED_CHANNELS_THROTTLE_INTERVAL_IN_MS;
  // memoize props
  const filterString = useMemo(() => JSON.stringify(filters), [filters]);
  const sortString = useMemo(() => JSON.stringify(sort), [sort]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryChannels = async (queryType = 'load-more') => {
    setError(null);

    if (queryType === 'reload') {
      setChannels([]);
    }
    setQueryInProgress(queryType as AllowedQueryType);

    try {
      if (customQueryChannels) {
        await customQueryChannels({
          currentChannels: channels,
          queryType: queryType as AllowedQueryType,
          setChannels,
          setHasNextPage,
        });
      } else {
        const offset = queryType === 'reload' ? 0 : channels.length;

        const newOptions = {
          limit: options?.limit ?? MAX_QUERY_CHANNELS_LIMIT,
          message_limit: options?.message_limit ?? DEFAULT_INITIAL_CHANNEL_PAGE_SIZE,
          offset,
          ...options,
        };

        const channelQueryResponse = await client.queryChannels(filters, sort || {}, newOptions);

        channelQueryResponse.forEach((channel: any) => {
          const newMembers = getMembersChannel(channel.data.members, client);
          const newMembersObject = newMembers.reduce((acc, user) => {
            acc[user.user_id] = user;
            return acc;
          }, {});
          channel.data.members = newMembers;
          channel.state.members = newMembersObject;

          if (channel.type === 'messaging') {
            channel.data.name = getChannelDirectName(channel.data.members, client);
          }
        });

        const newChannels =
          queryType === 'reload'
            ? channelQueryResponse
            : uniqBy([...channels, ...channelQueryResponse], 'cid');

        setChannels(newChannels);
        setHasNextPage(channelQueryResponse.length >= newOptions.limit);

        // Set active channel only on load of first page
        if (!offset && activeChannelHandler) {
          activeChannelHandler(newChannels, setChannels);
        }
      }
    } catch (err) {
      console.warn(err);
      setError(err as Error);
    }

    setQueryInProgress(null);
  };

  const throttleRecover = useCallback(() => {
    const now = Date.now();
    const isFirstRecovery = !lastRecoveryTimestamp.current;
    const timeElapsedSinceLastRecoveryMs = lastRecoveryTimestamp.current
      ? now - lastRecoveryTimestamp.current
      : 0;

    if (!isFirstRecovery && timeElapsedSinceLastRecoveryMs < recoveryThrottleInterval && !error) {
      return;
    }

    lastRecoveryTimestamp.current = now;
    queryChannels('reload');
  }, [error, queryChannels, recoveryThrottleInterval]);

  const loadNextPage = () => {
    queryChannels();
  };

  useEffect(() => {
    if (client.recoverStateOnReconnect) return;
    const { unsubscribe } = client.on('connection.recovered', throttleRecover);

    return () => {
      unsubscribe();
    };
  }, [client, throttleRecover]);

  useEffect(() => {
    queryChannels('reload');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterString, sortString]);

  return {
    channels,
    hasNextPage,
    loadNextPage,
    setChannels,
  };
};
