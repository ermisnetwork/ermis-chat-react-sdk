import React, { PropsWithChildren } from 'react';
import { ImageDropzone } from '../ReactFileUtilities';

import { useCooldownTimer } from './hooks/useCooldownTimer';
import { useCreateMessageInputContext } from './hooks/useCreateMessageInputContext';
import { useMessageInputState } from './hooks/useMessageInputState';

import { useChannelStateContext } from '../../context/ChannelStateContext';
import {
  MessageInputContextProvider,
  useMessageInputContext,
} from '../../context/MessageInputContext';

import type { MessageInputProps } from './MessageInput';

import type { CustomTrigger, DefaultErmisChatGenerics, UnknownType } from '../../types/types';

const DropzoneInner = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>({
  children,
}: PropsWithChildren<UnknownType>) => {
  const { acceptedFiles, multipleUploads } = useChannelStateContext<ErmisChatGenerics>(
    'DropzoneProvider',
  );

  const {
    cooldownRemaining,
    isUploadEnabled,
    maxFilesLeft,
    uploadNewFiles,
  } = useMessageInputContext<ErmisChatGenerics, V>('DropzoneProvider');

  return (
    <ImageDropzone
      accept={acceptedFiles}
      disabled={!isUploadEnabled || maxFilesLeft === 0 || !!cooldownRemaining}
      handleFiles={uploadNewFiles}
      maxNumberOfFiles={maxFilesLeft}
      multiple={multipleUploads}
    >
      {children}
    </ImageDropzone>
  );
};

export const DropzoneProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: PropsWithChildren<MessageInputProps<ErmisChatGenerics, V>>,
) => {
  const cooldownTimerState = useCooldownTimer<ErmisChatGenerics>();
  const messageInputState = useMessageInputState<ErmisChatGenerics, V>(props);

  const messageInputContextValue = useCreateMessageInputContext<ErmisChatGenerics, V>({
    ...cooldownTimerState,
    ...messageInputState,
    ...props,
  });

  return (
    <MessageInputContextProvider value={messageInputContextValue}>
      <DropzoneInner>{props.children}</DropzoneInner>
    </MessageInputContextProvider>
  );
};
