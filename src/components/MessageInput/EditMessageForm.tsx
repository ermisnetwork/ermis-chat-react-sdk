import React, { useEffect } from 'react';
import { FileUploadButton, ImageDropzone } from '../ReactFileUtilities';

import { FileUploadIcon as DefaultFileUploadIcon } from './icons';
import { UploadsPreview } from './UploadsPreview';

import { ChatAutoComplete } from '../ChatAutoComplete/ChatAutoComplete';
import { Tooltip } from '../Tooltip/Tooltip';
import { MessageInputFlat } from './MessageInputFlat';

import {
  useChannelStateContext,
  useChatContext,
  useComponentContext,
  useMessageInputContext,
  useTranslationContext,
} from '../../context';

import type { CustomTrigger, DefaultErmisChatGenerics } from '../../types/types';

export const EditMessageForm = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>() => {
  const { acceptedFiles, multipleUploads } = useChannelStateContext<ErmisChatGenerics>(
    'EditMessageForm',
  );
  const { t } = useTranslationContext('EditMessageForm');

  const {
    clearEditingState,
    handleSubmit,
    isUploadEnabled,
    maxFilesLeft,
    uploadNewFiles,
  } = useMessageInputContext<ErmisChatGenerics, V>('EditMessageForm');

  const {
    FileUploadIcon = DefaultFileUploadIcon,
    EmojiPicker,
  } = useComponentContext<ErmisChatGenerics>('EditMessageForm');

  const { themeVersion } = useChatContext('EditMessageForm');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearEditingState?.();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [clearEditingState]);

  if (themeVersion === '2')
    return (
      <form className='str-chat__edit-message-form' onSubmit={handleSubmit}>
        <MessageInputFlat />
        <div className='str-chat__edit-message-form-options'>
          <button
            className='str-chat__edit-message-cancel'
            data-testid='cancel-button'
            onClick={clearEditingState}
          >
            {t<string>('Cancel')}
          </button>
          <button className='str-chat__edit-message-send' data-testid='send-button' type='submit'>
            {t<string>('Send')}
          </button>
        </div>
      </form>
    );

  return (
    <div className='str-chat__edit-message-form'>
      <ImageDropzone
        accept={acceptedFiles}
        disabled={!isUploadEnabled || maxFilesLeft === 0}
        handleFiles={uploadNewFiles}
        maxNumberOfFiles={maxFilesLeft}
        multiple={multipleUploads}
      >
        <form onSubmit={handleSubmit}>
          {isUploadEnabled && <UploadsPreview />}
          <ChatAutoComplete />
          <div className='str-chat__message-team-form-footer'>
            <div className='str-chat__edit-message-form-options'>
              {EmojiPicker && <EmojiPicker />}
              {isUploadEnabled && (
                <div className='str-chat__fileupload-wrapper' data-testid='fileinput'>
                  <Tooltip>
                    {maxFilesLeft
                      ? t<string>('Attach files')
                      : t<string>("You've reached the maximum number of files")}
                  </Tooltip>
                  <FileUploadButton
                    accepts={acceptedFiles}
                    disabled={maxFilesLeft === 0}
                    handleFiles={uploadNewFiles}
                    multiple={multipleUploads}
                  >
                    <span className='str-chat__input-fileupload'>
                      <FileUploadIcon />
                    </span>
                  </FileUploadButton>
                </div>
              )}
            </div>
            <div>
              <button className='str-chat__edit-message-cancel' onClick={clearEditingState}>
                {t<string>('Cancel')}
              </button>
              <button className='str-chat__edit-message-send' type='submit'>
                {t<string>('Send')}
              </button>
            </div>
          </div>
        </form>
      </ImageDropzone>
    </div>
  );
};
