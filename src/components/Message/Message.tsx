import React, { useCallback, useMemo, useRef } from 'react';

import {
  useActionHandler,
  useDeleteHandler,
  useEditHandler,
  useFlagHandler,
  useMarkUnreadHandler,
  useMentionsHandler,
  useMuteHandler,
  useOpenThreadHandler,
  usePinHandler,
  useReactionClick,
  useReactionHandler,
  useReactionsFetcher,
  useRetryHandler,
  useUserHandler,
  useUserRole,
} from './hooks';
import { areMessagePropsEqual, getMessageActions, MESSAGE_ACTIONS } from './utils';

import {
  MessageContextValue,
  MessageProvider,
  useChannelActionContext,
  useChannelStateContext,
  useChatContext,
  useComponentContext,
} from '../../context';

import type { MessageProps } from './types';
import type { DefaultErmisChatGenerics } from '../../types/types';

type MessagePropsToOmit = 'onMentionsClick' | 'onMentionsHover' | 'openThread' | 'retrySendMessage';

type MessageContextPropsToPick =
  | 'handleAction'
  | 'handleDelete'
  | 'handleFlag'
  | 'handleMarkUnread'
  | 'handleMute'
  | 'handleOpenThread'
  | 'handlePin'
  | 'handleReaction'
  | 'handleFetchReactions'
  | 'handleRetry'
  | 'isReactionEnabled'
  | 'mutes'
  | 'onMentionsClickMessage'
  | 'onMentionsHoverMessage'
  | 'onReactionListClick'
  | 'reactionSelectorRef'
  | 'reactionDetailsSort'
  | 'showDetailedReactions'
  | 'sortReactions'
  | 'sortReactionDetails';

type MessageWithContextProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Omit<MessageProps<ErmisChatGenerics>, MessagePropsToOmit> &
  Pick<MessageContextValue<ErmisChatGenerics>, MessageContextPropsToPick> & {
    canPin: boolean;
    userRoles: ReturnType<typeof useUserRole>;
  };

const MessageWithContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageWithContextProps<ErmisChatGenerics>,
) => {
  const {
    canPin,
    groupedByUser,
    Message: propMessage,
    message,
    messageActions = Object.keys(MESSAGE_ACTIONS),
    onUserClick: propOnUserClick,
    onUserHover: propOnUserHover,
    userRoles,
  } = props;

  const { client } = useChatContext('Message');
  const { read } = useChannelStateContext('Message');
  const { Message: contextMessage } = useComponentContext<ErmisChatGenerics>('Message');

  const actionsEnabled = message.type === 'regular' && message.status === 'received';
  const MessageUIComponent = propMessage || contextMessage;

  const { clearEdit, editing, setEdit } = useEditHandler();

  const { onUserClick, onUserHover } = useUserHandler(message, {
    onUserClickHandler: propOnUserClick,
    onUserHoverHandler: propOnUserHover,
  });

  const { canDelete, canEdit, canReact, canReply, isMyMessage } = userRoles;

  const messageIsUnread = useMemo(
    () =>
      !!(
        !isMyMessage &&
        client.user?.id &&
        read &&
        (!read[client.user.id] ||
          (message?.created_at &&
            new Date(message.created_at).getTime() > read[client.user.id].last_read.getTime()))
      ),
    [client, isMyMessage, message.created_at, read],
  );

  const messageActionsHandler = useCallback(
    () =>
      getMessageActions(messageActions, {
        canDelete,
        canEdit,
        canPin,
        canReact,
        canReply,
      }),
    [messageActions, canDelete, canEdit, canPin, canReact, canReply],
  );

  const {
    canPin: canPinPropToNotPass, // eslint-disable-line @typescript-eslint/no-unused-vars
    messageActions: messageActionsPropToNotPass, // eslint-disable-line @typescript-eslint/no-unused-vars
    onUserClick: onUserClickPropToNotPass, // eslint-disable-line @typescript-eslint/no-unused-vars
    onUserHover: onUserHoverPropToNotPass, // eslint-disable-line @typescript-eslint/no-unused-vars
    userRoles: userRolesPropToNotPass, // eslint-disable-line @typescript-eslint/no-unused-vars
    ...rest
  } = props;

  const messageContextValue: MessageContextValue<ErmisChatGenerics> = {
    ...rest,
    actionsEnabled,
    clearEditingState: clearEdit,
    editing,
    getMessageActions: messageActionsHandler,
    handleEdit: setEdit,
    isMyMessage: () => isMyMessage,
    messageIsUnread,
    onUserClick,
    onUserHover,
    setEditingState: setEdit,
  };

  return (
    <MessageProvider value={messageContextValue}>
      <MessageUIComponent groupedByUser={groupedByUser} />
      {/* TODO - remove prop in next major release, maintains VML backwards compatibility */}
    </MessageProvider>
  );
};

const MemoizedMessage = React.memo(
  MessageWithContext,
  areMessagePropsEqual,
) as typeof MessageWithContext;

/**
 * The Message component is a context provider which implements all the logic required for rendering
 * an individual message. The actual UI of the message is delegated via the Message prop on Channel.
 */
export const Message = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageProps<ErmisChatGenerics>,
) => {
  const {
    closeReactionSelectorOnClick,
    getDeleteMessageErrorNotification,
    getFetchReactionsErrorNotification,
    getFlagMessageErrorNotification,
    getFlagMessageSuccessNotification,
    getMarkMessageUnreadErrorNotification,
    getMarkMessageUnreadSuccessNotification,
    getMuteUserErrorNotification,
    getMuteUserSuccessNotification,
    getPinMessageErrorNotification,
    message,
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover,
    openThread: propOpenThread,
    pinPermissions,
    reactionDetailsSort,
    retrySendMessage: propRetrySendMessage,
    sortReactionDetails,
    sortReactions,
  } = props;

  const { addNotification } = useChannelActionContext<ErmisChatGenerics>('Message');
  const { highlightedMessageId, mutes } = useChannelStateContext<ErmisChatGenerics>('Message');

  const reactionSelectorRef = useRef<HTMLDivElement | null>(null);

  const handleAction = useActionHandler(message);
  const handleOpenThread = useOpenThreadHandler(message, propOpenThread);
  const handleReaction = useReactionHandler(message);
  const handleRetry = useRetryHandler(propRetrySendMessage);
  const userRoles = useUserRole(message);

  const handleFetchReactions = useReactionsFetcher(message, {
    getErrorNotification: getFetchReactionsErrorNotification,
    notify: addNotification,
  });

  const handleDelete = useDeleteHandler(message, {
    getErrorNotification: getDeleteMessageErrorNotification,
    notify: addNotification,
  });

  const handleFlag = useFlagHandler(message, {
    getErrorNotification: getFlagMessageErrorNotification,
    getSuccessNotification: getFlagMessageSuccessNotification,
    notify: addNotification,
  });

  const handleMarkUnread = useMarkUnreadHandler(message, {
    getErrorNotification: getMarkMessageUnreadErrorNotification,
    getSuccessNotification: getMarkMessageUnreadSuccessNotification,
    notify: addNotification,
  });

  const handleMute = useMuteHandler(message, {
    getErrorNotification: getMuteUserErrorNotification,
    getSuccessNotification: getMuteUserSuccessNotification,
    notify: addNotification,
  });

  const { onMentionsClick, onMentionsHover } = useMentionsHandler(message, {
    onMentionsClick: propOnMentionsClick,
    onMentionsHover: propOnMentionsHover,
  });

  const { canPin, handlePin } = usePinHandler(message, pinPermissions, {
    getErrorNotification: getPinMessageErrorNotification,
    notify: addNotification,
  });

  const { isReactionEnabled, onReactionListClick, showDetailedReactions } = useReactionClick(
    message,
    reactionSelectorRef,
    undefined,
    closeReactionSelectorOnClick,
  );

  const highlighted = highlightedMessageId === message.id;

  return (
    <MemoizedMessage
      additionalMessageInputProps={props.additionalMessageInputProps}
      autoscrollToBottom={props.autoscrollToBottom}
      canPin={canPin}
      customMessageActions={props.customMessageActions}
      endOfGroup={props.endOfGroup}
      firstOfGroup={props.firstOfGroup}
      formatDate={props.formatDate}
      groupedByUser={props.groupedByUser}
      groupStyles={props.groupStyles}
      handleAction={handleAction}
      handleDelete={handleDelete}
      handleFetchReactions={handleFetchReactions}
      handleFlag={handleFlag}
      handleMarkUnread={handleMarkUnread}
      handleMute={handleMute}
      handleOpenThread={handleOpenThread}
      handlePin={handlePin}
      handleReaction={handleReaction}
      handleRetry={handleRetry}
      highlighted={highlighted}
      initialMessage={props.initialMessage}
      isReactionEnabled={isReactionEnabled}
      lastReceivedId={props.lastReceivedId}
      message={message}
      Message={props.Message}
      messageActions={props.messageActions}
      messageListRect={props.messageListRect}
      mutes={mutes}
      onMentionsClickMessage={onMentionsClick}
      onMentionsHoverMessage={onMentionsHover}
      onReactionListClick={onReactionListClick}
      onUserClick={props.onUserClick}
      onUserHover={props.onUserHover}
      pinPermissions={props.pinPermissions}
      reactionDetailsSort={reactionDetailsSort}
      reactionSelectorRef={reactionSelectorRef}
      readBy={props.readBy}
      renderText={props.renderText}
      showDetailedReactions={showDetailedReactions}
      sortReactionDetails={sortReactionDetails}
      sortReactions={sortReactions}
      threadList={props.threadList}
      unsafeHTML={props.unsafeHTML}
      userRoles={userRoles}
    />
  );
};
