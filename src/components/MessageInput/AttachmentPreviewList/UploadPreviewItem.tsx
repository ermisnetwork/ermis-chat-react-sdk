import React, { ComponentType, useCallback, useMemo } from 'react';
import { FileAttachmentPreview, FileAttachmentPreviewProps } from './FileAttachmentPreview';
import { ImageAttachmentPreview, ImageAttachmentPreviewProps } from './ImageAttachmentPreview';
import { useMessageInputContext } from '../../../context';
import { LocalAttachment, LocalFileAttachment, LocalImageAttachment } from '../types';
import type { DefaultErmisChatGenerics } from '../../../types';

type PreviewAdapterProps<P> = { id: string; Preview?: ComponentType<P> };
export const ImageUploadPreviewAdapter = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  id,
  Preview = ImageAttachmentPreview,
}: PreviewAdapterProps<ImageAttachmentPreviewProps<ErmisChatGenerics>>) => {
  const { imageUploads, removeImage, uploadImage } = useMessageInputContext(
    'ImageUploadPreviewAdapter',
  );

  const removeAttachments = useCallback((ids: string[]) => removeImage(ids[0]), [removeImage]);

  const handleRetry = useCallback(
    (attachment: LocalAttachment<ErmisChatGenerics>) =>
      attachment.localMetadata && uploadImage(attachment.localMetadata.id),
    [uploadImage],
  );

  const image = imageUploads[id];
  const attachment = useMemo<LocalImageAttachment<ErmisChatGenerics> | undefined>(
    () =>
      // do not display scraped attachments
      !image || image.og_scrape_url
        ? undefined
        : {
            image_url: image.previewUri ?? image.url,
            localMetadata: {
              file: image.file as File,
              id,
              uploadState: image.state,
            },
            title: image.file.name,
            type: 'image',
          },
    [id, image],
  );

  if (!attachment) return null;

  return (
    <Preview
      attachment={attachment}
      handleRetry={handleRetry}
      removeAttachments={removeAttachments}
    />
  );
};

export const FileUploadPreviewAdapter = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  id,
  Preview = FileAttachmentPreview,
}: PreviewAdapterProps<FileAttachmentPreviewProps>) => {
  const { fileUploads, removeFile, uploadFile } = useMessageInputContext(
    'FileUploadPreviewAdapter',
  );

  const removeAttachments = useCallback(
    (ids: string[]) => {
      removeFile(ids[0]);
    },
    [removeFile],
  );
  const handleRetry = useCallback(
    (attachment: LocalAttachment<ErmisChatGenerics>) =>
      attachment.localMetadata && uploadFile(attachment.localMetadata.id),
    [uploadFile],
  );

  const file = fileUploads[id];
  const attachment = useMemo<LocalFileAttachment<ErmisChatGenerics> | undefined>(
    () =>
      !file
        ? undefined
        : {
            asset_url: file.url,
            localMetadata: {
              file: file.file as File,
              id,
              uploadState: file.state,
            },
            mime_type: file.file.type,
            title: file.file.name,
            type: 'file',
          },
    [file, id],
  );

  if (!attachment) return null;

  return (
    <Preview
      attachment={attachment}
      handleRetry={handleRetry}
      removeAttachments={removeAttachments}
    />
  );
};
