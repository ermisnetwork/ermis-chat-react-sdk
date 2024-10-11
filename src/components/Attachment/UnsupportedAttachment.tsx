import React from 'react';
import { FileIcon } from '../ReactFileUtilities';
import { useTranslationContext } from '../../context';
import type { Attachment } from 'ermis-chat-js-sdk';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type UnsupportedAttachmentProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  attachment: Attachment<ErmisChatGenerics>;
};

export const UnsupportedAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  attachment,
}: UnsupportedAttachmentProps<ErmisChatGenerics>) => {
  const { t } = useTranslationContext('UnsupportedAttachment');
  return (
    <div className='str-chat__message-attachment-unsupported' data-testid='attachment-unsupported'>
      <FileIcon className='str-chat__file-icon' />
      <div className='str-chat__message-attachment-unsupported__metadata'>
        <div
          className='str-chat__message-attachment-unsupported__title'
          data-testid='unsupported-attachment-title'
        >
          {attachment.title || t<string>('Unsupported attachment')}
        </div>
      </div>
    </div>
  );
};
