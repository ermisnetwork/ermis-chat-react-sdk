import React from 'react';

import clsx from 'clsx';
import { useComponentContext, useMessageContext, useTranslationContext } from '../../context';
import { Timestamp as DefaultTimestamp } from './Timestamp';
import { isMessageEdited } from './utils';

import type { DefaultErmisChatGenerics } from '../../types';
import type { MessageTimestampProps } from './MessageTimestamp';

export type MessageEditedTimestampProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = MessageTimestampProps<ErmisChatGenerics> & {
  open: boolean;
};

export function MessageEditedTimestamp<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  message: propMessage,
  open,
  ...timestampProps
}: MessageEditedTimestampProps<ErmisChatGenerics>) {
  const { t } = useTranslationContext('MessageEditedTimestamp');
  const { message: contextMessage } = useMessageContext<ErmisChatGenerics>(
    'MessageEditedTimestamp',
  );
  const { Timestamp = DefaultTimestamp } = useComponentContext('MessageEditedTimestamp');
  const message = propMessage || contextMessage;

  if (!isMessageEdited(message)) {
    return null;
  }

  return (
    <div
      className={clsx(
        'str-chat__message-edited-timestamp',
        open
          ? 'str-chat__message-edited-timestamp--open'
          : 'str-chat__message-edited-timestamp--collapsed',
      )}
      data-testid='message-edited-timestamp'
    >
      {t<string>('Edited')}{' '}
      <Timestamp timestamp={message.message_text_updated_at} {...timestampProps} />
    </div>
  );
}
