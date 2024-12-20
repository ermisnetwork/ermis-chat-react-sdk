import React, { useEffect } from 'react';
import { FileUploadButton, ImageDropzone } from '../ReactFileUtilities';
import type { Event } from 'ermis-chat-js-sdk';

import { FileUploadIconFlat as DefaultFileUploadIcon, EmojiIconSmall } from './icons';
import { UploadsPreview } from './UploadsPreview';

import { CooldownTimer as DefaultCooldownTimer } from './CooldownTimer';
import { SendButton as DefaultSendButton } from './SendButton';
import { ChatAutoComplete } from '../ChatAutoComplete/ChatAutoComplete';
import { Tooltip } from '../Tooltip/Tooltip';

import { useChatContext } from '../../context/ChatContext';
import { useChannelActionContext } from '../../context/ChannelActionContext';
import { useChannelStateContext } from '../../context/ChannelStateContext';
import { useTranslationContext } from '../../context/TranslationContext';
import { useMessageInputContext } from '../../context/MessageInputContext';
import { useComponentContext } from '../../context/ComponentContext';

import { QuotedMessagePreview as DefaultQuotedMessagePreview } from './QuotedMessagePreview';

import type { CustomTrigger, DefaultErmisChatGenerics } from '../../types/types';

/**
 * @deprecated This component has beend deprecated in favor of [`MessageInputFlat`](./MessageInputFlat.tsx) from which
 * `MessageInputSmall` "inherited" most of the code with only slight modification to classNames
 * and markup.
 * In case you need to change styling in places where `MessageInputSmall` has been used previously ([`Thread`](../Thread/Thread.tsx))
 * please do so by updating the CSS or by overriding the component itself.
 *
 * **Will be removed with the complete transition to the theming V2 (next major release - `v11.0.0`).**
 */
export const MessageInputSmall = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>() => {
  const {
    acceptedFiles,
    multipleUploads,
    quotedMessage,
  } = useChannelStateContext<ErmisChatGenerics>('MessageInputSmall');
  const { setQuotedMessage } = useChannelActionContext('MessageInputSmall');
  const { t } = useTranslationContext('MessageInputSmall');
  const { channel } = useChatContext<ErmisChatGenerics>('MessageInputSmall');

  const {
    cooldownRemaining,
    handleSubmit,
    hideSendButton,
    isUploadEnabled,
    maxFilesLeft,
    numberOfUploads,
    setCooldownRemaining,
    uploadNewFiles,
  } = useMessageInputContext<ErmisChatGenerics, V>('MessageInputSmall');

  const {
    CooldownTimer = DefaultCooldownTimer,
    FileUploadIcon = DefaultFileUploadIcon,
    SendButton = DefaultSendButton,
    QuotedMessagePreview = DefaultQuotedMessagePreview,
    EmojiPicker,
  } = useComponentContext<ErmisChatGenerics>('MessageInputSmall');

  useEffect(() => {
    const handleQuotedMessageUpdate = (e: Event<ErmisChatGenerics>) => {
      if (!(quotedMessage && e.message?.id === quotedMessage.id)) return;
      if (e.type === 'message.deleted') {
        setQuotedMessage(undefined);
        return;
      }
      setQuotedMessage(e.message);
    };
    channel?.on('message.deleted', handleQuotedMessageUpdate);
    channel?.on('message.updated', handleQuotedMessageUpdate);

    return () => {
      channel?.off('message.deleted', handleQuotedMessageUpdate);
      channel?.off('message.updated', handleQuotedMessageUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, quotedMessage]);
  return (
    <div className='str-chat__small-message-input__wrapper'>
      <ImageDropzone
        accept={acceptedFiles}
        disabled={!isUploadEnabled || maxFilesLeft === 0 || !!cooldownRemaining}
        handleFiles={uploadNewFiles}
        maxNumberOfFiles={maxFilesLeft}
        multiple={multipleUploads}
      >
        <div
          className={`str-chat__small-message-input ${
            SendButton ? 'str-chat__small-message-input--send-button-active' : ''
          } ${quotedMessage && quotedMessage.parent_id ? 'str-chat__input-flat-quoted' : ''} ${
            numberOfUploads ? 'str-chat__small-message-input-has-attachments' : ''
          } `}
        >
          {quotedMessage && quotedMessage.parent_id && (
            <QuotedMessagePreview quotedMessage={quotedMessage} />
          )}
          {isUploadEnabled && <UploadsPreview />}
          <div className='str-chat__small-message-input--textarea-wrapper'>
            <ChatAutoComplete />
            {cooldownRemaining ? (
              <div className='str-chat__input-small-cooldown'>
                <CooldownTimer
                  cooldownInterval={cooldownRemaining}
                  setCooldownRemaining={setCooldownRemaining}
                />
              </div>
            ) : (
              <>
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
                      <span className='str-chat__small-message-input-fileupload'>
                        <FileUploadIcon />
                      </span>
                    </FileUploadButton>
                  </div>
                )}
                {EmojiPicker && (
                  <EmojiPicker
                    // @ts-expect-error
                    buttonClassName='str-chat__small-message-input-emojiselect'
                    ButtonIconComponent={EmojiIconSmall}
                  />
                )}
              </>
            )}
          </div>
          {!(cooldownRemaining || hideSendButton) && <SendButton sendMessage={handleSubmit} />}
        </div>
      </ImageDropzone>
    </div>
  );
};
