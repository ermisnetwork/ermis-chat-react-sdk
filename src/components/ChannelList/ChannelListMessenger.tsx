import React, { PropsWithChildren } from 'react';

import { ChatDown, ChatDownProps } from '../ChatDown/ChatDown';
import { LoadingChannels } from '../Loading/LoadingChannels';

import type { APIErrorResponse, Channel, ErrorFromResponse } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../types/types';
import { useTranslationContext } from '../../context';

export type ChannelListMessengerProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** Whether or not the channel query request returned an errored response */
  error: ErrorFromResponse<APIErrorResponse> | null;
  /** The channels currently loaded in the list, only defined if `sendChannelsToList` on `ChannelList` is true */
  loadedChannels?: Channel<ErmisChatGenerics>[];
  /** Whether or not channels are currently loading */
  loading?: boolean;
  /** Custom UI component to display a loading error, defaults to and accepts same props as: [ChatDown](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/ChatDown/ChatDown.tsx) */
  LoadingErrorIndicator?: React.ComponentType<ChatDownProps>;
  /** Custom UI component to display a loading indicator, defaults to and accepts same props as: [LoadingChannels](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Loading/LoadingChannels.tsx) */
  LoadingIndicator?: React.ComponentType;
  /** Local state hook that resets the currently loaded channels */
  setChannels?: React.Dispatch<React.SetStateAction<Channel<ErmisChatGenerics>[]>>;
};

/**
 * A preview list of channels, allowing you to select the channel you want to open
 */
export const ChannelListMessenger = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: PropsWithChildren<ChannelListMessengerProps<ErmisChatGenerics>>,
) => {
  const {
    children,
    error = null,
    loading,
    LoadingErrorIndicator = ChatDown,
    LoadingIndicator = LoadingChannels,
  } = props;
  const { t } = useTranslationContext('ChannelListMessenger');

  if (error) {
    return <LoadingErrorIndicator type='Connection Error' />;
  }

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <div className='str-chat__channel-list-messenger str-chat__channel-list-messenger-react'>
      <div
        aria-label={t('aria/Channel list')}
        className='str-chat__channel-list-messenger__main str-chat__channel-list-messenger-react__main'
        role='listbox'
      >
        {children}
      </div>
    </div>
  );
};
