import React, { useMemo } from 'react';
import type { TranslationLanguages } from 'ermis-chat-js-sdk';

import { Avatar as DefaultAvatar } from '../Avatar';
import { CloseIcon } from './icons';

import { useChannelActionContext } from '../../context/ChannelActionContext';
import { useComponentContext } from '../../context/ComponentContext';
import { useTranslationContext } from '../../context/TranslationContext';
import { useChatContext } from '../../context/ChatContext';

import type { StreamMessage } from '../../context/ChannelStateContext';
import type { DefaultErmisChatGenerics } from '../../types/types';

export const QuotedMessagePreviewHeader = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>() => {
  const { setQuotedMessage } = useChannelActionContext<ErmisChatGenerics>('QuotedMessagePreview');
  const { t } = useTranslationContext('QuotedMessagePreview');

  return (
    <div className='quoted-message-preview-header str-chat__quoted-message-preview-header'>
      <div className='str-chat__quoted-message-reply-to-message'>
        {t<string>('Reply to Message')}
      </div>
      <button
        aria-label={t('aria/Cancel Reply')}
        className='str-chat__square-button str-chat__quoted-message-remove'
        onClick={() => setQuotedMessage(undefined)}
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export type QuotedMessagePreviewProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  quotedMessage: StreamMessage<ErmisChatGenerics>;
};

export const QuotedMessagePreview = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  quotedMessage,
}: QuotedMessagePreviewProps<ErmisChatGenerics>) => {
  const { Attachment, Avatar = DefaultAvatar } = useComponentContext<ErmisChatGenerics>(
    'QuotedMessagePreview',
  );
  const { userLanguage } = useTranslationContext('QuotedMessagePreview');
  const { themeVersion } = useChatContext('QuotedMessagePreview');

  const quotedMessageText =
    quotedMessage.i18n?.[`${userLanguage}_text` as `${TranslationLanguages}_text`] ||
    quotedMessage.text;

  const quotedMessageAttachment = useMemo(() => {
    const [attachment] = quotedMessage.attachments ?? [];
    return attachment ? [attachment] : [];
  }, [quotedMessage.attachments]);

  if (!quotedMessageText && !quotedMessageAttachment) return null;

  // TODO: remove div.quoted-message-preview-content when deprecating V1 theming
  // move str-chat__quoted-message-preview to main div

  return (
    <div className='quoted-message-preview' data-testid='quoted-message-preview'>
      {themeVersion === '1' && <QuotedMessagePreviewHeader />}
      <div className='quoted-message-preview-content str-chat__quoted-message-preview'>
        {quotedMessage.user && (
          <Avatar
            image={quotedMessage.user.image}
            name={quotedMessage.user.name || quotedMessage.user.id}
            size={20}
            user={quotedMessage.user}
          />
        )}
        <div className='quoted-message-preview-content-inner str-chat__quoted-message-bubble'>
          {!!quotedMessageAttachment.length && (
            <Attachment attachments={quotedMessageAttachment} isQuoted />
          )}
          <div className='str-chat__quoted-message-text' data-testid='quoted-message-text'>
            {themeVersion === '2' && <p>{quotedMessageText}</p>}
            {themeVersion === '1' && <>{quotedMessageText}</>}
          </div>
        </div>
      </div>
    </div>
  );
};
