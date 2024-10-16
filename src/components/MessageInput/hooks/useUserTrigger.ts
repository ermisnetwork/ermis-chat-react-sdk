import { useCallback, useState } from 'react';
import throttle from 'lodash.throttle';

import { SearchLocalUserParams, searchLocalUsers } from './utils';

import { UserItem } from '../../UserItem/UserItem';

import { useChatContext } from '../../../context/ChatContext';
import { useChannelStateContext } from '../../../context/ChannelStateContext';

import type { UserResponse } from 'ermis-chat-js-sdk';

import type { UserTriggerSetting } from '../../MessageInput/DefaultTriggerProvider';

import type { DefaultErmisChatGenerics, SearchQueryParams } from '../../../types/types';

export type UserTriggerParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  onSelectUser: (item: UserResponse<ErmisChatGenerics>) => void;
  disableMentions?: boolean;
  mentionAllAppUsers?: boolean;
  mentionQueryParams?: SearchQueryParams<ErmisChatGenerics>['userFilters'];
  useMentionsTransliteration?: boolean;
};

export const useUserTrigger = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  params: UserTriggerParams<ErmisChatGenerics>,
): UserTriggerSetting<ErmisChatGenerics> => {
  const {
    disableMentions,
    mentionAllAppUsers,
    mentionQueryParams = {},
    onSelectUser,
    useMentionsTransliteration,
  } = params;

  const [searching, setSearching] = useState(false);

  const { client, mutes, themeVersion } = useChatContext<ErmisChatGenerics>('useUserTrigger');
  const { channel } = useChannelStateContext<ErmisChatGenerics>('useUserTrigger');

  const { members } = channel.state;
  const { watchers } = channel.state;

  const getMembersAndWatchers = useCallback(() => {
    const memberUsers = members ? Object.values(members).map(({ user }) => user) : [];
    const watcherUsers = watchers ? Object.values(watchers) : [];
    const users = [...memberUsers, ...watcherUsers];

    // make sure we don't list users twice
    const uniqueUsers = {} as Record<string, UserResponse<ErmisChatGenerics>>;

    users.forEach((user) => {
      if (user && !uniqueUsers[user.id]) {
        uniqueUsers[user.id] = user;
      }
    });

    return Object.values(uniqueUsers);
  }, [members, watchers]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryMembersThrottled = useCallback(
    throttle(async (query: string, onReady: (users: UserResponse<ErmisChatGenerics>[]) => void) => {
      try {
        // @ts-expect-error
        const response = await channel.queryMembers({
          name: { $autocomplete: query },
        });

        const users = response.members.map(
          (member) => member.user,
        ) as UserResponse<ErmisChatGenerics>[];

        if (onReady && users.length) {
          onReady(users);
        } else {
          onReady([]);
        }
      } catch (error) {
        console.log({ error });
      }
    }, 200),
    [channel],
  );

  const queryUsers = async (
    query: string,
    onReady: (users: UserResponse<ErmisChatGenerics>[]) => void,
  ) => {
    if (!query || searching) return;
    setSearching(true);

    try {
      const page = 1;
      const page_size = '1000';
      const response = await client.queryUsers(page_size, page);

      if (onReady && response && response.data.length) {
        onReady(response.data);
      } else {
        onReady([]);
      }
    } catch (error) {
      console.log({ error });
    }

    setSearching(false);
  };

  const queryUsersThrottled = throttle(queryUsers, 200);

  return {
    callback: (item) => onSelectUser(item),
    component: UserItem,
    dataProvider: (query, text, onReady) => {
      if (disableMentions) return;

      const filterMutes = (data: UserResponse<ErmisChatGenerics>[]) => {
        if (text.includes('/unmute') && !mutes.length) {
          return [];
        }
        if (!mutes.length) return data;

        if (text.includes('/unmute')) {
          return data.filter((suggestion) =>
            mutes.some((mute) => mute.target.id === suggestion.id),
          );
        }
        return data.filter((suggestion) => mutes.every((mute) => mute.target.id !== suggestion.id));
      };

      if (mentionAllAppUsers) {
        return queryUsersThrottled(query, (data: UserResponse<ErmisChatGenerics>[]) => {
          if (onReady) onReady(filterMutes(data), query);
        });
      }

      /**
       * By default, we return maximum 100 members via queryChannels api call.
       * Thus it is safe to assume, that if number of members in channel.state is < 100,
       * then all the members are already available on client side and we don't need to
       * make any api call to queryMembers endpoint.
       */
      if (!query || Object.values(members || {}).length < 100) {
        const users = getMembersAndWatchers();

        const params: SearchLocalUserParams<ErmisChatGenerics> = {
          ownUserId: client.userID,
          query,
          text,
          useMentionsTransliteration,
          users,
        };

        const matchingUsers = searchLocalUsers<ErmisChatGenerics>(params);

        const usersToShow = mentionQueryParams.options?.limit ?? (themeVersion === '2' ? 7 : 10);
        const data = matchingUsers.slice(0, usersToShow);

        if (onReady) onReady(filterMutes(data), query);
        return data;
      }

      return queryMembersThrottled(query, (data: UserResponse<ErmisChatGenerics>[]) => {
        if (onReady) onReady(filterMutes(data), query);
      });
    },
    output: (entity) => ({
      caretPosition: 'next',
      key: entity.id,
      text: `@${entity.name || entity.id}`,
    }),
  };
};
