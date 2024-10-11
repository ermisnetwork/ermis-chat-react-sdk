import { useEffect } from 'react';

import { useChatContext } from '../../../context/ChatContext';

import type { Channel, Event } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useChannelDeletedListener = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
  customHandler?: (
    setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
    event: Event<ErmisChatGenerics>,
  ) => void,
) => {
  const { client } = useChatContext<ErmisChatGenerics>('useChannelDeletedListener');

  useEffect(() => {
    const handleEvent = (event: Event<ErmisChatGenerics>) => {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, event);
      } else {
        setChannels((channels) => {
          const channelIndex = channels.findIndex((channel) => channel.cid === event.cid);

          if (channelIndex < 0) return [...channels];

          // Remove the deleted channel from the list
          channels.splice(channelIndex, 1);

          return [...channels];
        });
      }
    };

    client.on('channel.deleted', handleEvent);

    return () => {
      client.off('channel.deleted', handleEvent);
    };
  }, [client, customHandler, setChannels]);
};
