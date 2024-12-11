import React from 'react';
import { logChatPromiseExecution } from 'ermis-chat-js-sdk';
import {
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChannelActionContext,
  Window,
} from 'ermis-chat-react-sdk';
// import { encodeToMp3 } from 'ermis-chat-react-sdk/mp3-encoder';
import { encodeToMp3 } from 'ermis-chat-react-sdk/dist/components/MediaRecorder/transcode/mp3';

import { MessagingChannelHeader } from '../../components';
import { useGiphyContext } from '../../context';
import type { ErmisChatGenerics } from '../../types';
import { MessageInputProps } from 'ermis-chat-react-sdk/dist/components/MessageInput/MessageInput';

export type ChannelInnerProps = {
  toggleMobile: () => void;
  theme: string;
};

const ChannelInner = (props: ChannelInnerProps) => {
  const { theme, toggleMobile } = props;
  const { giphyState, setGiphyState } = useGiphyContext();

  const { sendMessage } = useChannelActionContext<ErmisChatGenerics>();

  const overrideSubmitHandler: MessageInputProps<ErmisChatGenerics>['overrideSubmitHandler'] = (
    message,
    _,
    ...restSendParams
  ) => {
    let updatedMessage;

    if (message.attachments?.length && message.text?.startsWith('/giphy')) {
      const updatedText = message.text.replace('/giphy', '');
      updatedMessage = { ...message, text: updatedText };
    }

    if (giphyState) {
      const updatedText = `/giphy ${message.text}`;
      updatedMessage = { ...message, text: updatedText };
    }

    if (sendMessage) {
      const newMessage = updatedMessage || message;
      const parentMessage = newMessage.parent;

      const messageToSend = {
        ...newMessage,
        parent: parentMessage,
      };

      const sendMessagePromise = sendMessage(messageToSend, ...restSendParams);
      logChatPromiseExecution(sendMessagePromise, 'send message');
    }

    setGiphyState(false);
  };

  const actions = ['delete', 'edit', 'flag', 'markUnread', 'mute', 'react', 'reply'];

  return (
    <>
      <Window>
        <ChannelHeader />
        {/* <MessagingChannelHeader theme={theme} toggleMobile={toggleMobile} /> */}
        <MessageList messageActions={actions} />
        <MessageInput
          focus
          overrideSubmitHandler={overrideSubmitHandler}
          // audioRecordingConfig={{ transcoderConfig: { encoder: encodeToMp3 } }}
          audioRecordingEnabled
          asyncMessagesMultiSendEnabled
        />
      </Window>
      <Thread />
    </>
  );
};

export default ChannelInner;
