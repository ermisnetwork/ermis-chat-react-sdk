import React, { useEffect } from 'react';
import clsx from 'clsx';

import { MESSAGE_ACTIONS } from '../Message';
import { MessageInput, MessageInputFlat, MessageInputProps } from '../MessageInput';
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
import { useThreadContext } from '../Threads';
import { useStateStore } from '../../store';

import type { MessageProps, MessageUIComponentProps } from '../Message/types';
import type { MessageActionsArray } from '../Message/utils';

import type { CustomTrigger, DefaultErmisChatGenerics } from '../../types/types';
import type { ThreadState } from 'ermis-chat-js-sdk';

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
  const threadInstance = useThreadContext();

  if ((!thread && !threadInstance) || channelConfig?.replies === false) return null;

  // the wrapper ensures a key variable is set and the component recreates on thread switch
  return (
    // FIXME: TS is having trouble here as at least one of the two would always be defined
    <ThreadInner {...props} key={`thread-${(thread ?? threadInstance)?.id}-${channel?.cid}`} />
  );
};

const selector = (nextValue: ThreadState) =>
  [
    nextValue.replies,
    nextValue.pagination.isLoadingPrev,
    nextValue.pagination.isLoadingNext,
    nextValue.parentMessage,
  ] as const;

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
    Input: PropInput,
    Message: PropMessage,
    messageActions = Object.keys(MESSAGE_ACTIONS),
    virtualized,
  } = props;

  const threadInstance = useThreadContext();
  const [latestReplies, isLoadingPrev, isLoadingNext, parentMessage] =
    useStateStore(threadInstance?.state, selector) ?? [];

  const {
    thread,
    threadHasMore,
    threadLoadingMore,
    threadMessages = [],
    threadSuppressAutoscroll,
  } = useChannelStateContext<ErmisChatGenerics>('Thread');
  const { closeThread, loadMoreThread } = useChannelActionContext<ErmisChatGenerics>('Thread');
  const { customClasses } = useChatContext<ErmisChatGenerics>('Thread');
  const {
    ThreadInput: ContextInput,
    Message: ContextMessage,
    ThreadHead = DefaultThreadHead,
    ThreadHeader = DefaultThreadHeader,
    VirtualMessage,
  } = useComponentContext<ErmisChatGenerics>('Thread');

  const ThreadInput =
    PropInput ?? additionalMessageInputProps?.Input ?? ContextInput ?? MessageInputFlat;

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
  }, [thread, loadMoreThread]);

  const threadProps: Pick<
    VirtualizedMessageListProps<ErmisChatGenerics>,
    | 'hasMoreNewer'
    | 'loadMoreNewer'
    | 'loadingMoreNewer'
    | 'hasMore'
    | 'loadMore'
    | 'loadingMore'
    | 'messages'
  > = threadInstance
    ? {
        loadingMore: isLoadingPrev,
        loadingMoreNewer: isLoadingNext,
        loadMore: threadInstance.loadPrevPage,
        loadMoreNewer: threadInstance.loadNextPage,
        messages: latestReplies,
      }
    : {
        hasMore: threadHasMore,
        loadingMore: threadLoadingMore,
        loadMore: loadMoreThread,
        messages: threadMessages,
      };

  const messageAsThread = thread ?? parentMessage;

  if (!messageAsThread) return null;

  const threadClass =
    customClasses?.thread ||
    clsx('str-chat__thread-container str-chat__thread', {
      'str-chat__thread--virtualized': virtualized,
    });

  const head = (
    <ThreadHead
      key={messageAsThread.id}
      message={messageAsThread}
      Message={MessageUIComponent}
      {...additionalParentMessageProps}
    />
  );

  return (
    <div className={threadClass}>
      <ThreadHeader closeThread={closeThread} thread={messageAsThread} />
      <ThreadMessageList
        disableDateSeparator={!enableDateSeparator}
        head={head}
        Message={MessageUIComponent}
        messageActions={messageActions}
        suppressAutoscroll={threadSuppressAutoscroll}
        threadList
        {...threadProps}
        {...(virtualized ? additionalVirtualizedMessageListProps : additionalMessageListProps)}
      />
      <MessageInput
        focus={autoFocus}
        Input={ThreadInput}
        parent={thread ?? parentMessage}
        publishTypingEvent={false}
        {...additionalMessageInputProps}
      />
    </div>
  );
};
