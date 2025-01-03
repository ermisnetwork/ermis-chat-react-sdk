import React from 'react';
import { FilePreviewer, ImagePreviewer } from '../ReactFileUtilities';

import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useMessageInputContext } from '../../context/MessageInputContext';

import type { DefaultErmisChatGenerics } from '../../types/types';
import { useChatContext } from '../../context';

/**
 * @deprecated This component has been deprecated in favor of `AttachmentPreviewList` as this component
 * utilises outdated components from the package [`react-file-utils`](https://github.com/GetStream/react-file-utils)
 * which will no longer receive updates for aforementioned components.
 *
 * **Will be removed with the complete transition to the theming V2 (next major release - `v11.0.0`).**
 */
export const UploadsPreview = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>() => {
  const { themeVersion } = useChatContext('UploadsPreview');
  const { maxNumberOfFiles = 0, multipleUploads } = useChannelStateContext<ErmisChatGenerics>(
    'UploadsPreview',
  );
  const {
    fileOrder,
    fileUploads,
    imageOrder,
    imageUploads,
    numberOfUploads = 0,
    removeFile,
    removeImage,
    uploadFile,
    uploadImage,
    uploadNewFiles,
  } = useMessageInputContext<ErmisChatGenerics>('UploadsPreview');

  const imagesToPreview = imageOrder
    .map((id) => imageUploads[id])
    // filter OG scraped images
    .filter((image) => !image.og_scrape_url);
  const filesToPreview = fileOrder.map((id) => fileUploads[id]);

  return (
    <>
      {imageOrder.length > 0 && (
        <ImagePreviewer
          disabled={!multipleUploads || numberOfUploads >= maxNumberOfFiles}
          handleFiles={uploadNewFiles}
          handleRemove={removeImage}
          handleRetry={uploadImage}
          imageUploads={imagesToPreview}
          multiple={multipleUploads}
        />
      )}
      {fileOrder.length > 0 && (
        <FilePreviewer
          fileIconProps={{
            className: 'str-chat__file-icon',
            version: themeVersion,
          }}
          handleFiles={uploadNewFiles}
          handleRemove={removeFile}
          handleRetry={uploadFile}
          uploads={filesToPreview}
        />
      )}
    </>
  );
};
