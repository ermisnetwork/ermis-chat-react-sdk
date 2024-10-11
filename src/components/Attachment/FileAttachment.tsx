import React from 'react';
import { FileIcon } from '../ReactFileUtilities';
import type { Attachment } from 'ermis-chat-js-sdk';

import { DownloadButton, FileSizeIndicator } from './components';

import type { DefaultErmisChatGenerics } from '../../types/types';

export type FileAttachmentProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  attachment: Attachment<ErmisChatGenerics>;
};

const UnMemoizedFileAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  attachment,
}: FileAttachmentProps<ErmisChatGenerics>) => (
  <div className='str-chat__message-attachment-file--item' data-testid='attachment-file'>
    <FileIcon className='str-chat__file-icon' mimeType={attachment.mime_type} />
    <div className='str-chat__message-attachment-file--item-text'>
      <div className='str-chat__message-attachment-file--item-first-row'>
        <div className='str-chat__message-attachment-file--item-name' data-testid='file-title'>
          {attachment.title}
        </div>
        <DownloadButton assetUrl={attachment.asset_url} />
      </div>
      <FileSizeIndicator fileSize={attachment.file_size} />
    </div>
  </div>
);

export const FileAttachment = React.memo(
  UnMemoizedFileAttachment,
) as typeof UnMemoizedFileAttachment;
