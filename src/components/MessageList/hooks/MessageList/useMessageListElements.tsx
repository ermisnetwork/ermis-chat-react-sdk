import React, { useMemo } from 'react';

import { useLastReadData } from '../useLastReadData';
import { getLastReceived, GroupStyle } from '../../utils';

import { useChatContext } from '../../../../context/ChatContext';
import { useComponentContext } from '../../../../context/ComponentContext';

import type { ChannelState as StreamChannelState } from 'ermis-chat-js-sdk';
import type { StreamMessage } from '../../../../context/ChannelStateContext';

import type { ChannelUnreadUiState, DefaultErmisChatGenerics } from '../../../../types/types';
import { MessageRenderer, SharedMessageProps } from '../../renderMessages';

type UseMessageListElementsProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  enrichedMessages: StreamMessage<ErmisChatGenerics>[];
  internalMessageProps: SharedMessageProps<ErmisChatGenerics>;
  messageGroupStyles: Record<string, GroupStyle>;
  renderMessages: MessageRenderer<ErmisChatGenerics>;
  returnAllReadData: boolean;
  threadList: boolean;
  channelUnreadUiState?: ChannelUnreadUiState<ErmisChatGenerics>;
  read?: StreamChannelState<ErmisChatGenerics>['read'];
};

export const useMessageListElements = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: UseMessageListElementsProps<ErmisChatGenerics>,
) => {
  const {
    channelUnreadUiState,
    enrichedMessages,
    internalMessageProps,
    messageGroupStyles,
    read,
    renderMessages,
    returnAllReadData,
    threadList,
  } = props;

  const { client, customClasses } = useChatContext<ErmisChatGenerics>('useMessageListElements');
  const components = useComponentContext<ErmisChatGenerics>('useMessageListElements');

  // get the readData, but only for messages submitted by the user themselves
  const readData = useLastReadData({
    messages: enrichedMessages,
    read,
    returnAllReadData,
    userID: client.userID,
  });

  const lastReceivedMessageId = useMemo(() => getLastReceived(enrichedMessages), [
    enrichedMessages,
  ]);

  const elements: React.ReactNode[] = useMemo(
    () =>
      renderMessages({
        channelUnreadUiState,
        components,
        customClasses,
        lastReceivedMessageId,
        messageGroupStyles,
        messages: enrichedMessages,
        readData,
        sharedMessageProps: { ...internalMessageProps, threadList },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      enrichedMessages,
      internalMessageProps,
      lastReceivedMessageId,
      messageGroupStyles,
      channelUnreadUiState,
      readData,
      renderMessages,
      threadList,
    ],
  );

  return elements;
};
