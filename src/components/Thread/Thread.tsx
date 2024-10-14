import React, { useEffect } from 'react';
import clsx from 'clsx';

import { MESSAGE_ACTIONS } from '../Message';
import {
  MessageInput,
  MessageInputFlat,
  MessageInputProps,
  MessageInputSmall,
} from '../MessageInput';
import {
  MessageList,
  MessageListProps,
  VirtualizedMessageList,
  VirtualizedMessageListProps,
} from '../MessageList';
import { ThreadHeader as DefaultThreadHeader } from './ThreadHeader';
import { ThreadHead as DefaultThreadHead } from '../Thread/ThreadHead';

import {
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
  useComponentContext,
} from '../../context';

import type { MessageProps, MessageUIComponentProps } from '../Message/types';
import type { MessageActionsArray } from '../Message/utils';

import type { CustomTrigger, DefaultErmisChatGenerics } from '../../types/types';

export type ThreadProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
> = {
  /** Additional props for `MessageInput` component: [available props] */
  additionalMessageInputProps?: MessageInputProps<ErmisChatGenerics, V>;
  /** Additional props for `MessageList` component: [available props] */
  additionalMessageListProps?: MessageListProps<ErmisChatGenerics>;
  /** Additional props for `Message` component of the parent message: [available props] */
  additionalParentMessageProps?: Partial<MessageProps<ErmisChatGenerics>>;
  /** Additional props for `VirtualizedMessageList` component: [available props] */
  additionalVirtualizedMessageListProps?: VirtualizedMessageListProps<ErmisChatGenerics>;
  /** If true, focuses the `MessageInput` component on opening a thread */
  autoFocus?: boolean;
  /** Injects date separator components into `Thread`, defaults to `false`. To be passed to the underlying `MessageList` or `VirtualizedMessageList` components */
  enableDateSeparator?: boolean;
  /** Display the thread on 100% width of its parent container. Useful for mobile style view */
  fullWidth?: boolean;
  /** Custom thread input UI component used to override the default `Input` value stored in `ComponentContext` or the [MessageInputSmall](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/MessageInputSmall.tsx) default */
  Input?: React.ComponentType;
  /** Custom thread message UI component used to override the default `Message` value stored in `ComponentContext` */
  Message?: React.ComponentType<MessageUIComponentProps<ErmisChatGenerics>>;
  /** Array of allowed message actions (ex: ['edit', 'delete', 'flag', 'mute', 'pin', 'quote', 'react', 'reply']). To disable all actions, provide an empty array. */
  messageActions?: MessageActionsArray;
  /** If true, render the `VirtualizedMessageList` instead of the standard `MessageList` component */
  virtualized?: boolean;
};

/**
 * The Thread component renders a parent Message with a list of replies
 */
export const Thread = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: ThreadProps<ErmisChatGenerics, V>,
) => {
  const { channel, channelConfig, thread } = useChannelStateContext<ErmisChatGenerics>('Thread');

  if (!thread || channelConfig?.replies === false) return null;

  // The wrapper ensures a key variable is set and the component recreates on thread switch
  return <ThreadInner {...props} key={`thread-${thread.id}-${channel?.cid}`} />;
};

const ThreadInner = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: ThreadProps<ErmisChatGenerics, V> & { key: string },
) => {
  const {
    additionalMessageInputProps,
    additionalMessageListProps,
    additionalParentMessageProps,
    additionalVirtualizedMessageListProps,
    autoFocus = true,
    enableDateSeparator = false,
    fullWidth = false,
    Input: PropInput,
    Message: PropMessage,
    messageActions = Object.keys(MESSAGE_ACTIONS),
    virtualized,
  } = props;

  const {
    thread,
    threadHasMore,
    threadLoadingMore,
    threadMessages,
    threadSuppressAutoscroll,
  } = useChannelStateContext<ErmisChatGenerics>('Thread');
  const { closeThread, loadMoreThread } = useChannelActionContext<ErmisChatGenerics>('Thread');
  const { customClasses, themeVersion } = useChatContext<ErmisChatGenerics>('Thread');
  const {
    ThreadInput: ContextInput,
    Message: ContextMessage,
    ThreadHead = DefaultThreadHead,
    ThreadHeader = DefaultThreadHeader,
    VirtualMessage,
  } = useComponentContext<ErmisChatGenerics>('Thread');

  const ThreadInput =
    PropInput ??
    additionalMessageInputProps?.Input ??
    ContextInput ??
    (themeVersion === '2' ? MessageInputFlat : MessageInputSmall);

  const ThreadMessage = PropMessage || additionalMessageListProps?.Message;
  const FallbackMessage = virtualized && VirtualMessage ? VirtualMessage : ContextMessage;
  const MessageUIComponent = ThreadMessage || FallbackMessage;

  const ThreadMessageList = virtualized ? VirtualizedMessageList : MessageList;

  useEffect(() => {
    if (thread?.id && thread?.reply_count) {
      // FIXME: integrators can customize channel query options but cannot customize channel.getReplies() options
      loadMoreThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!thread) return null;

  const threadClass =
    customClasses?.thread ||
    clsx('str-chat__thread-container str-chat__thread', {
      'str-chat__thread--full': fullWidth,
      'str-chat__thread--virtualized': virtualized,
    });

  const head = (
    <ThreadHead
      key={thread.id}
      message={thread}
      Message={MessageUIComponent}
      {...additionalParentMessageProps}
    />
  );

  return (
    <div className={threadClass}>
      <ThreadHeader closeThread={closeThread} thread={thread} />
      <ThreadMessageList
        disableDateSeparator={!enableDateSeparator}
        hasMore={threadHasMore}
        head={head}
        loadingMore={threadLoadingMore}
        loadMore={loadMoreThread}
        Message={MessageUIComponent}
        messageActions={messageActions}
        messages={threadMessages || []}
        suppressAutoscroll={threadSuppressAutoscroll}
        threadList
        {...(virtualized ? additionalVirtualizedMessageListProps : additionalMessageListProps)}
      />
      <MessageInput
        focus={autoFocus}
        Input={ThreadInput}
        parent={thread}
        publishTypingEvent={false}
        {...additionalMessageInputProps}
      />
    </div>
  );
};
