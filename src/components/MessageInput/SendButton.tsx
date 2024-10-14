import React from 'react';
import { Message } from 'ermis-chat-js-sdk';
import { useChatContext } from '../../context';
import { SendIconV1, SendIconV2 } from './icons';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type SendButtonProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  sendMessage: (
    event: React.BaseSyntheticEvent,
    customMessageData?: Partial<Message<ErmisChatGenerics>>,
  ) => void;
} & React.ComponentProps<'button'>;
export const SendButton = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  sendMessage,
  ...rest
}: SendButtonProps<ErmisChatGenerics>) => {
  const { themeVersion } = useChatContext('SendButton');

  return (
    <button
      aria-label='Send'
      className='str-chat__send-button'
      data-testid='send-button'
      onClick={sendMessage}
      type='button'
      {...rest}
    >
      {themeVersion === '2' ? <SendIconV2 /> : <SendIconV1 />}
    </button>
  );
};
