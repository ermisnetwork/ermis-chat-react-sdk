import React, { useState } from 'react';
import clsx from 'clsx';

import { MessageErrorIcon } from './icons';
import { MessageBouncePrompt as DefaultMessageBouncePrompt } from '../MessageBounce';
import { MessageDeleted as DefaultMessageDeleted } from './MessageDeleted';
import { MessageOptions as DefaultMessageOptions } from './MessageOptions';
import { MessageRepliesCountButton as DefaultMessageRepliesCountButton } from './MessageRepliesCountButton';
import { MessageStatus as DefaultMessageStatus } from './MessageStatus';
import { MessageText } from './MessageText';
import { MessageTimestamp as DefaultMessageTimestamp } from './MessageTimestamp';
import {
  areMessageUIPropsEqual,
  isMessageBounced,
  isMessageEdited,
  messageHasAttachments,
  messageHasReactions,
} from './utils';

import { Avatar as DefaultAvatar } from '../Avatar';
import { CUSTOM_MESSAGE_TYPE } from '../../constants/messageTypes';
import { EditMessageForm as DefaultEditMessageForm, MessageInput } from '../MessageInput';
import { MML } from '../MML';
import { Modal } from '../Modal';
import {
  ReactionsList as DefaultReactionList,
  ReactionSelector as DefaultReactionSelector,
} from '../Reactions';
import { MessageBounceModal } from '../MessageBounce/MessageBounceModal';

import { useChatContext } from '../../context/ChatContext';
import { useComponentContext } from '../../context/ComponentContext';
import { MessageContextValue, useMessageContext } from '../../context/MessageContext';

import type { MessageUIComponentProps } from './types';

import type { DefaultErmisChatGenerics } from '../../types/types';
import { useTranslationContext } from '../../context';
import { MessageEditedTimestamp } from './MessageEditedTimestamp';
import { getUserNameAndImage } from '../../utils';

type MessageSimpleWithContextProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = MessageContextValue<ErmisChatGenerics>;

const MessageSimpleWithContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageSimpleWithContextProps<ErmisChatGenerics>,
) => {
  const {
    additionalMessageInputProps,
    clearEditingState,
    editing,
    endOfGroup,
    firstOfGroup,
    groupedByUser,
    handleAction,
    handleOpenThread,
    handleRetry,
    highlighted,
    isMyMessage,
    isReactionEnabled,
    message,
    onUserClick,
    onUserHover,
    reactionSelectorRef,
    renderText,
    showDetailedReactions,
    threadList,
  } = props;

  const { t } = useTranslationContext('MessageSimple');
  const [isBounceDialogOpen, setIsBounceDialogOpen] = useState(false);
  const [isEditedTimestampOpen, setEditedTimestampOpen] = useState(false);

  const {
    Attachment,
    Avatar = DefaultAvatar,
    EditMessageInput = DefaultEditMessageForm,
    MessageDeleted = DefaultMessageDeleted,
    MessageBouncePrompt = DefaultMessageBouncePrompt,
    MessageOptions = DefaultMessageOptions,
    MessageRepliesCountButton = DefaultMessageRepliesCountButton,
    MessageStatus = DefaultMessageStatus,
    MessageTimestamp = DefaultMessageTimestamp,
    ReactionSelector = DefaultReactionSelector,
    ReactionsList = DefaultReactionList,
    PinIndicator,
  } = useComponentContext<ErmisChatGenerics>('MessageSimple');
  const { client, themeVersion } = useChatContext('MessageSimple');

  const hasAttachment = messageHasAttachments(message);
  const hasReactions = messageHasReactions(message);

  if (message.customType === CUSTOM_MESSAGE_TYPE.date) {
    return null;
  }

  if (message.deleted_at || message.type === 'deleted') {
    return <MessageDeleted message={message} />;
  }

  /** FIXME: isReactionEnabled should be removed with next major version and a proper centralized permissions logic should be put in place
   * With the current permissions implementation it would be sth like:
   * const messageActions = getMessageActions();
   * const canReact = messageActions.includes(MESSAGE_ACTIONS.react);
   */
  const canReact = isReactionEnabled;
  const canShowReactions = hasReactions;

  const showMetadata = !groupedByUser || endOfGroup;
  const showReplyCountButton = !threadList && !!message.reply_count;
  const allowRetry = message.status === 'failed' && message.errorStatusCode !== 403;
  const isBounced = isMessageBounced(message);
  const isEdited = isMessageEdited(message);
  const userInfo = getUserNameAndImage(String(message.user?.id), client);

  let handleClick: (() => void) | undefined = undefined;

  if (allowRetry) {
    handleClick = () => handleRetry(message);
  } else if (isBounced) {
    handleClick = () => setIsBounceDialogOpen(true);
  } else if (isEdited) {
    handleClick = () => setEditedTimestampOpen((prev) => !prev);
  }

  const rootClassName = clsx(
    'str-chat__message str-chat__message-simple',
    `str-chat__message--${message.type}`,
    `str-chat__message--${message.status}`,
    isMyMessage()
      ? 'str-chat__message--me str-chat__message-simple--me'
      : 'str-chat__message--other',
    message.text ? 'str-chat__message--has-text' : 'has-no-text',
    {
      'str-chat__message--has-attachment': hasAttachment,
      'str-chat__message--highlighted': highlighted,
      'str-chat__message--pinned pinned-message': message.pinned,
      'str-chat__message--with-reactions': canShowReactions,
      'str-chat__message-send-can-be-retried':
        message?.status === 'failed' && message?.errorStatusCode !== 403,
      'str-chat__message-with-thread-link': showReplyCountButton,
      'str-chat__virtual-message__wrapper--end': endOfGroup,
      'str-chat__virtual-message__wrapper--first': firstOfGroup,
      'str-chat__virtual-message__wrapper--group': groupedByUser,
    },
  );

  return (
    <>
      {editing && (
        <Modal className='str-chat__edit-message-modal' onClose={clearEditingState} open={editing}>
          <MessageInput
            clearEditingState={clearEditingState}
            grow
            hideSendButton
            Input={EditMessageInput}
            message={message}
            {...additionalMessageInputProps}
          />
        </Modal>
      )}
      {isBounceDialogOpen && (
        <MessageBounceModal
          MessageBouncePrompt={MessageBouncePrompt}
          onClose={() => setIsBounceDialogOpen(false)}
          open={isBounceDialogOpen}
        />
      )}
      {
        <div className={rootClassName} key={message.id}>
          {PinIndicator && <PinIndicator />}
          {themeVersion === '1' && <MessageStatus />}
          {message.user && (
            <Avatar
              image={userInfo.image}
              name={userInfo.name}
              onClick={onUserClick}
              onMouseOver={onUserHover}
              user={message.user}
            />
          )}
          <div
            className={clsx('str-chat__message-inner', {
              'str-chat__simple-message--error-failed': allowRetry || isBounced,
            })}
            data-testid='message-inner'
            onClick={handleClick}
            onKeyUp={handleClick}
          >
            <MessageOptions />
            <div className='str-chat__message-reactions-host'>
              {canShowReactions && <ReactionsList reverse />}
              {showDetailedReactions && canReact && <ReactionSelector ref={reactionSelectorRef} />}
            </div>
            <div className='str-chat__message-bubble'>
              {message.attachments?.length && !message.quoted_message ? (
                <Attachment actionHandler={handleAction} attachments={message.attachments} />
              ) : null}
              <MessageText message={message} renderText={renderText} />
              {message.mml && (
                <MML
                  actionHandler={handleAction}
                  align={isMyMessage() ? 'right' : 'left'}
                  source={message.mml}
                />
              )}
              {themeVersion === '2' && <MessageErrorIcon />}
            </div>
            {showReplyCountButton && themeVersion === '1' && (
              <MessageRepliesCountButton
                onClick={handleOpenThread}
                reply_count={message.reply_count}
              />
            )}
            {showMetadata && themeVersion === '1' && (
              <div className='str-chat__message-data str-chat__message-simple-data'>
                {!isMyMessage() && message.user ? (
                  <span className='str-chat__message-simple-name'>
                    {/* {message.user.name || message.user.id} */}
                    {userInfo.name}
                  </span>
                ) : null}
                <MessageTimestamp calendar customClass='str-chat__message-simple-timestamp' />
              </div>
            )}
          </div>
          {showReplyCountButton && themeVersion === '2' && (
            <MessageRepliesCountButton
              onClick={handleOpenThread}
              reply_count={message.reply_count}
            />
          )}
          {showMetadata && themeVersion === '2' && (
            <div className='str-chat__message-data str-chat__message-simple-data str-chat__message-metadata'>
              <MessageStatus />
              {!isMyMessage() && !!message.user && (
                <span className='str-chat__message-simple-name'>
                  {/* {message.user.name || message.user.id} */}
                  {userInfo.name}
                </span>
              )}
              <MessageTimestamp calendar customClass='str-chat__message-simple-timestamp' />
              {isEdited && (
                <span className='str-chat__mesage-simple-edited'>{t<string>('Edited')}</span>
              )}
              {isEdited && <MessageEditedTimestamp calendar open={isEditedTimestampOpen} />}
            </div>
          )}
        </div>
      }
    </>
  );
};

const MemoizedMessageSimple = React.memo(
  MessageSimpleWithContext,
  areMessageUIPropsEqual,
) as typeof MessageSimpleWithContext;

/**
 * The default UI component that renders a message and receives functionality and logic from the MessageContext.
 */
export const MessageSimple = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageUIComponentProps<ErmisChatGenerics>,
) => {
  const messageContext = useMessageContext<ErmisChatGenerics>('MessageSimple');

  return <MemoizedMessageSimple {...messageContext} {...props} />;
};
