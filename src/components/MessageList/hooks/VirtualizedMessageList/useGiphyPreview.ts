import { useEffect, useState } from 'react';

import { useChatContext } from '../../../../context/ChatContext';

import type { EventHandler } from 'stream-chat';

import type { StreamMessage } from '../../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../../types/types';

export const useGiphyPreview = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  separateGiphyPreview: boolean,
) => {
  const [giphyPreviewMessage, setGiphyPreviewMessage] = useState<
    StreamMessage<ErmisChatGenerics>
  >();

  const { client } = useChatContext<ErmisChatGenerics>('useGiphyPreview');

  useEffect(() => {
    const handleEvent: EventHandler<ErmisChatGenerics> = (event) => {
      const { message, user } = event;

      if (message?.command === 'giphy' && user?.id === client.userID) {
        setGiphyPreviewMessage(undefined);
      }
    };

    if (separateGiphyPreview) client.on('message.new', handleEvent);
    return () => client.off('message.new', handleEvent);
  }, [client, separateGiphyPreview]);

  return {
    giphyPreviewMessage,
    setGiphyPreviewMessage: separateGiphyPreview ? setGiphyPreviewMessage : undefined,
  };
};
