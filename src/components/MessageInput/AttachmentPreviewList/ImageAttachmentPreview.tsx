import clsx from 'clsx';
import { CloseIcon, LoadingIndicatorIcon, RetryIcon } from '../icons';
import React, { useCallback, useState } from 'react';
import { BaseImage as DefaultBaseImage } from '../../Gallery';
import { useComponentContext, useTranslationContext } from '../../../context';
import type { AttachmentPreviewProps } from './types';
import type { LocalImageAttachment } from '../types';
import type { DefaultErmisChatGenerics } from '../../../types';

export type ImageAttachmentPreviewProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = AttachmentPreviewProps<
  LocalImageAttachment<ErmisChatGenerics, CustomLocalMetadata>,
  ErmisChatGenerics
>;

export const ImageAttachmentPreview = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  attachment,
  handleRetry,
  removeAttachments,
}: ImageAttachmentPreviewProps<ErmisChatGenerics>) => {
  const { t } = useTranslationContext('ImagePreviewItem');
  const { BaseImage = DefaultBaseImage } = useComponentContext('ImagePreview');
  const [previewError, setPreviewError] = useState(false);

  const { id, uploadState } = attachment.localMetadata ?? {};

  const handleLoadError = useCallback(() => setPreviewError(true), []);
  const assetUrl = attachment.image_url || attachment.localMetadata.previewUri;

  return (
    <div
      className={clsx('str-chat__attachment-preview-image', {
        'str-chat__attachment-preview-image--error': previewError,
      })}
      data-testid='attachment-preview-image'
    >
      <button
        aria-label={t('aria/Remove attachment')}
        className='str-chat__attachment-preview-delete'
        data-testid='image-preview-item-delete-button'
        disabled={uploadState === 'uploading'}
        onClick={() => id && removeAttachments([id])}
      >
        <CloseIcon />
      </button>

      {uploadState === 'failed' && (
        <button
          className='str-chat__attachment-preview-error str-chat__attachment-preview-error-image'
          data-testid='image-preview-item-retry-button'
          onClick={() => handleRetry(attachment)}
        >
          <RetryIcon />
        </button>
      )}

      {uploadState === 'uploading' && (
        <div className='str-chat__attachment-preview-image-loading'>
          <LoadingIndicatorIcon size={17} />
        </div>
      )}

      {assetUrl && (
        <BaseImage
          alt={attachment.fallback}
          className='str-chat__attachment-preview-thumbnail'
          onError={handleLoadError}
          src={assetUrl}
          title={attachment.fallback}
        />
      )}
    </div>
  );
};
