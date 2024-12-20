import { SendIcon } from '../../assets';
import React from 'react';
import type { SendButtonProps } from 'ermis-chat-react-sdk';

const SendButton = ({ sendMessage, ...rest }: SendButtonProps) => (
  <button className='str-chat__send-button' onClick={sendMessage} type='button' {...rest}>
    <SendIcon />
  </button>
);

export default SendButton;
