import { useCallback, useEffect } from 'react';

import { useChannelActionContext } from '../../../context/ChannelActionContext';
import { useChannelStateContext } from '../../../context/ChannelStateContext';
import { useTranslationContext } from '../../../context/TranslationContext';

import type { SendFileAPIResponse } from 'ermis-chat-js-sdk';
import type { MessageInputReducerAction, MessageInputState } from './useMessageInputState';
import type { MessageInputProps } from '../MessageInput';

import type { CustomTrigger, DefaultErmisChatGenerics } from '../../../types/types';

export const useFileUploads = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: MessageInputProps<ErmisChatGenerics, V>,
  state: MessageInputState<ErmisChatGenerics>,
  dispatch: React.Dispatch<MessageInputReducerAction<ErmisChatGenerics>>,
) => {
  const { doFileUploadRequest, errorHandler } = props;
  const { fileUploads } = state;

  const { channel } = useChannelStateContext<ErmisChatGenerics>('useFileUploads');
  const { addNotification } = useChannelActionContext<ErmisChatGenerics>('useFileUploads');
  // const { getAppSettings } = useChatContext<ErmisChatGenerics>('useFileUploads');
  const { t } = useTranslationContext('useFileUploads');

  const uploadFile = useCallback((id: string) => {
    dispatch({ id, state: 'uploading', type: 'setFileUpload' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFile = useCallback((id: string) => {
    // TODO: cancel upload if still uploading
    dispatch({ id, type: 'removeFileUpload' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      const upload = Object.values(fileUploads).find(
        (fileUpload) => fileUpload.state === 'uploading' && fileUpload.file,
      );

      if (!upload) return;

      const { file, id } = upload;

      // const canUpload = await checkUploadPermissions({
      //   addNotification,
      //   file,
      //   getAppSettings,
      //   t,
      //   uploadType: 'file',
      // });

      // if (!canUpload) return removeFile(id);

      let response: SendFileAPIResponse;

      try {
        if (doFileUploadRequest) {
          response = await doFileUploadRequest(file, channel);
        } else {
          response = await channel.sendFile(file as File);
        }
      } catch (error) {
        const errorMessage: string =
          typeof (error as Error).message === 'string'
            ? (error as Error).message
            : t('Error uploading file');

        addNotification(errorMessage, 'error');

        let alreadyRemoved = false;

        if (!fileUploads[id]) {
          alreadyRemoved = true;
        } else {
          dispatch({ id, state: 'failed', type: 'setFileUpload' });
        }

        if (!alreadyRemoved && errorHandler) {
          // TODO: verify if the parameters passed to the error handler actually make sense
          errorHandler(error as Error, 'upload-file', file);
        }

        return;
      }

      // If doImageUploadRequest returns any falsy value, then don't create the upload preview.
      // This is for the case if someone wants to handle failure on app level.
      if (!response) {
        removeFile(id);
        return;
      }

      let thumbUrl = '';
      if (file.type?.split('/')[0] === 'video') {
        const thumbBlob = await channel.getThumbBlobVideo(file as File);
        const responseThumb = await channel.sendFile(thumbBlob as File);
        thumbUrl = responseThumb.file;
      }

      dispatch({
        id,
        state: 'finished',
        thumb_url: thumbUrl,
        type: 'setFileUpload',
        url: response.file,
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileUploads, channel, doFileUploadRequest, errorHandler, removeFile]);

  return {
    removeFile,
    uploadFile,
  };
};
