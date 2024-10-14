import { useMemo } from 'react';

import {
  getGroupStyles,
  GroupStyle,
  insertIntro,
  processMessages,
  ProcessMessagesParams,
} from '../../utils';

import { useChatContext } from '../../../../context/ChatContext';
import { useComponentContext } from '../../../../context/ComponentContext';

import type { Channel } from 'stream-chat';

import type { StreamMessage } from '../../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../../types/types';

export const useEnrichedMessages = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(args: {
  channel: Channel<ErmisChatGenerics>;
  disableDateSeparator: boolean;
  hideDeletedMessages: boolean;
  hideNewMessageSeparator: boolean;
  messages: StreamMessage<ErmisChatGenerics>[];
  noGroupByUser: boolean;
  groupStyles?: (
    message: StreamMessage<ErmisChatGenerics>,
    previousMessage: StreamMessage<ErmisChatGenerics>,
    nextMessage: StreamMessage<ErmisChatGenerics>,
    noGroupByUser: boolean,
  ) => GroupStyle;
  headerPosition?: number;
  reviewProcessedMessage?: ProcessMessagesParams<ErmisChatGenerics>['reviewProcessedMessage'];
}) => {
  const {
    channel,
    disableDateSeparator,
    groupStyles,
    headerPosition,
    hideDeletedMessages,
    hideNewMessageSeparator,
    messages,
    noGroupByUser,
    reviewProcessedMessage,
  } = args;

  const { client } = useChatContext<ErmisChatGenerics>('useEnrichedMessages');
  const { HeaderComponent } = useComponentContext<ErmisChatGenerics>('useEnrichedMessages');

  const lastRead = useMemo(() => channel.lastRead?.(), [channel]);

  const enableDateSeparator = !disableDateSeparator;

  let messagesWithDates =
    !enableDateSeparator && !hideDeletedMessages && hideNewMessageSeparator
      ? messages
      : processMessages<ErmisChatGenerics>({
          enableDateSeparator,
          hideDeletedMessages,
          hideNewMessageSeparator,
          lastRead,
          messages,
          reviewProcessedMessage,
          userId: client.userID || '',
        });

  if (HeaderComponent) {
    messagesWithDates = insertIntro(messagesWithDates, headerPosition);
  }

  const groupStylesFn = groupStyles || getGroupStyles;
  const messageGroupStyles = useMemo(
    () =>
      messagesWithDates.reduce<Record<string, GroupStyle>>((acc, message, i) => {
        const style = groupStylesFn(
          message,
          messagesWithDates[i - 1],
          messagesWithDates[i + 1],
          noGroupByUser,
        );
        if (style) acc[message.id] = style;
        return acc;
      }, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [messagesWithDates, noGroupByUser],
  );

  return { messageGroupStyles, messages: messagesWithDates };
};
