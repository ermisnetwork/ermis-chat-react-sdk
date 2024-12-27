import React, { useEffect, useMemo, useState } from 'react';

import { QuotedMessage as DefaultQuotedMessage } from './QuotedMessage';
import { isOnlyEmojis, messageHasAttachments } from './utils';

import {
  useChannelStateContext,
  useComponentContext,
  useMessageContext,
  useTranslationContext,
} from '../../context';
import { renderText as defaultRenderText } from './renderText';
import { MessageErrorText } from './MessageErrorText';

import type { TranslationLanguages } from 'ermis-chat-js-sdk';
import type { MessageContextValue, StreamMessage } from '../../context';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type MessageTextProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /* Replaces the CSS class name placed on the component's inner `div` container */
  customInnerClass?: string;
  /* Adds a CSS class name to the component's outer `div` container */
  customWrapperClass?: string;
  /* The `ErmisChat` message object, which provides necessary data to the underlying UI components (overrides the value stored in `MessageContext`) */
  message?: StreamMessage<ErmisChatGenerics>;
  /* Theme string to be added to CSS class names */
  theme?: string;
} & Pick<MessageContextValue<ErmisChatGenerics>, 'renderText'>;

const UnMemoizedMessageTextComponent = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageTextProps<ErmisChatGenerics>,
) => {
  const {
    customInnerClass,
    customWrapperClass = '',
    message: propMessage,
    renderText: propsRenderText,
    theme = 'simple',
  } = props;

  const { QuotedMessage = DefaultQuotedMessage } = useComponentContext<ErmisChatGenerics>(
    'MessageText',
  );

  const {
    message: contextMessage,
    onMentionsClickMessage,
    onMentionsHoverMessage,
    renderText: contextRenderText,
    unsafeHTML,
  } = useMessageContext<ErmisChatGenerics>('MessageText');

  const renderText = propsRenderText ?? contextRenderText ?? defaultRenderText;

  const { userLanguage } = useTranslationContext('MessageText');
  const message = propMessage || contextMessage;
  const hasAttachment = messageHasAttachments(message);
  const { channel } = useChannelStateContext();
  const [mentionedUsers, setMentionedUsers] = useState<{ id: ''; image: ''; name: '' }[]>([]);

  useEffect(() => {
    const members = channel.data?.members
      ? channel.data?.members.map((member: any) => member.user)
      : [];
    const allObj = { id: 'all', image: '', name: 'All' };
    const mentions = [allObj, ...members];

    if (message.mentioned_all) {
      const mentionsInText = String(message.text).match(/@\S+/g) || [];
      const mentionedUsers = mentionsInText
        .map((mention) => mention.slice(1))
        .map((mention) => mentions.find((member) => member.id === mention))
        .filter(Boolean);

      setMentionedUsers(mentionedUsers);
    } else {
      if (message.mentioned_users?.length) {
        const mentionedUsers = message.mentioned_users.map((mentionId: any) => {
          const memberInfo = mentions.find((member) => member.id === mentionId);
          return memberInfo;
        });
        setMentionedUsers(mentionedUsers);
      }
    }
  }, [channel, message]);

  const messageTextToRender =
    message.i18n?.[`${userLanguage}_text` as `${TranslationLanguages}_text`] || message.text;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messageText = useMemo(() => renderText(messageTextToRender, mentionedUsers), [
    mentionedUsers,
    messageTextToRender,
  ]);

  const wrapperClass = customWrapperClass || 'str-chat__message-text';
  const innerClass =
    customInnerClass || `str-chat__message-text-inner str-chat__message-${theme}-text-inner`;

  if (!messageTextToRender && !message.quoted_message) return null;

  return (
    <div className={wrapperClass} tabIndex={0}>
      <div
        className={`
          ${innerClass}
          ${hasAttachment ? ` str-chat__message-${theme}-text-inner--has-attachment` : ''}
          ${
            isOnlyEmojis(message.text) && !message.quoted_message
              ? ` str-chat__message-${theme}-text-inner--is-emoji`
              : ''
          }
        `.trim()}
        data-testid='message-text-inner-wrapper'
        onClick={onMentionsClickMessage}
        onMouseOver={onMentionsHoverMessage}
      >
        {message.quoted_message && <QuotedMessage />}
        <MessageErrorText message={message} theme={theme} />
        {unsafeHTML && message.html ? (
          <div dangerouslySetInnerHTML={{ __html: message.html }} />
        ) : (
          <div>{messageText}</div>
        )}
      </div>
    </div>
  );
};

export const MessageText = React.memo(
  UnMemoizedMessageTextComponent,
) as typeof UnMemoizedMessageTextComponent;
