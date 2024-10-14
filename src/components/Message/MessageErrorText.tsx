import React from 'react';

import { StreamMessage, useTranslationContext } from '../../context';
import { DefaultErmisChatGenerics } from '../../types/types';
import { isMessageBounced } from './utils';

export interface MessageErrorTextProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> {
  message: StreamMessage<ErmisChatGenerics>;
  theme: string;
}

export function MessageErrorText<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({ message, theme }: MessageErrorTextProps<ErmisChatGenerics>) {
  const { t } = useTranslationContext('MessageText');

  if (message.type === 'error' && !isMessageBounced(message)) {
    return (
      <div className={`str-chat__${theme}-message--error-message str-chat__message--error-message`}>
        {t<string>('Error · Unsent')}
      </div>
    );
  }

  if (message.status === 'failed') {
    return (
      <div className={`str-chat__${theme}-message--error-message str-chat__message--error-message`}>
        {message.errorStatusCode !== 403
          ? t<string>('Message Failed · Click to try again')
          : t<string>('Message Failed · Unauthorized')}
      </div>
    );
  }

  return null;
}
