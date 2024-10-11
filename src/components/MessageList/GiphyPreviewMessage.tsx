import React from 'react';

import { Message } from '../Message/Message';

import type { StreamMessage } from '../../context/ChannelStateContext';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type GiphyPreviewMessageProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  message: StreamMessage<ErmisChatGenerics>;
};

export const GiphyPreviewMessage = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: GiphyPreviewMessageProps<ErmisChatGenerics>,
) => {
  const { message } = props;

  return (
    <div className='giphy-preview-message'>
      <Message message={message} />
    </div>
  );
};
