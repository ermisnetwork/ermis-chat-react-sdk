import React from 'react';
import { CloseIcon, DownloadIcon, LoadingIndicatorIcon, RetryIcon } from '../icons';
import { FileIcon } from '../../ReactFileUtilities';
import { useTranslationContext } from '../../../context';
import type { AttachmentPreviewProps } from './types';
import type { AnyLocalAttachment } from '../types';
import type { DefaultErmisChatGenerics } from '../../../types';

export type UnsupportedAttachmentPreviewProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = AttachmentPreviewProps<
  AnyLocalAttachment<ErmisChatGenerics, CustomLocalMetadata>,
  ErmisChatGenerics
>;

export const UnsupportedAttachmentPreview = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  attachment,
  handleRetry,
  removeAttachments,
}: UnsupportedAttachmentPreviewProps<ErmisChatGenerics>) => {
  const { t } = useTranslationContext('UnsupportedAttachmentPreview');
  const title = attachment.title ?? t('Unsupported attachment');
  return (
    <div
      className='str-chat__attachment-preview-unsupported'
      data-testid='attachment-preview-unknown'
    >
      <div className='str-chat__attachment-preview-file-icon'>
        <FileIcon filename={title} mimeType={attachment.mime_type} version='2' />
      </div>

      <button
        className='str-chat__attachment-preview-delete'
        data-testid='file-preview-item-delete-button'
        disabled={attachment.localMetadata?.uploadState === 'uploading'}
        onClick={() =>
          attachment.localMetadata?.id && removeAttachments([attachment.localMetadata?.id])
        }
      >
        <CloseIcon />
      </button>

      {attachment.localMetadata?.uploadState === 'failed' && !!handleRetry && (
        <button
          className='str-chat__attachment-preview-error str-chat__attachment-preview-error-file'
          data-testid='file-preview-item-retry-button'
          onClick={() => handleRetry(attachment)}
        >
          <RetryIcon />
        </button>
      )}

      <div className='str-chat__attachment-preview-metadata'>
        <div className='str-chat__attachment-preview-title' title={title}>
          {title}
        </div>
        {attachment.localMetadata?.uploadState === 'finished' && !!attachment.asset_url && (
          <a
            className='str-chat__attachment-preview-file-download'
            download
            href={attachment.asset_url}
            rel='noreferrer'
            target='_blank'
          >
            <DownloadIcon />
          </a>
        )}
        {attachment.localMetadata?.uploadState === 'uploading' && (
          <LoadingIndicatorIcon size={17} />
        )}
      </div>
    </div>
  );
};
