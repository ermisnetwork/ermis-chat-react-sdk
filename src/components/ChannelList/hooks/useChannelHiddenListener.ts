import { useEffect } from 'react';

import { useChatContext } from '../../../context/ChatContext';

import type { Channel, Event } from 'stream-chat';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useChannelHiddenListener = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
  customHandler?: (
    setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
    event: Event<ErmisChatGenerics>,
  ) => void,
) => {
  const { client } = useChatContext<ErmisChatGenerics>('useChannelHiddenListener');

  useEffect(() => {
    const handleEvent = (event: Event<ErmisChatGenerics>) => {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, event);
      } else {
        setChannels((channels) => {
          const channelIndex = channels.findIndex((channel) => channel.cid === event.cid);
          if (channelIndex < 0) return [...channels];

          // Remove the hidden channel from the list.s
          channels.splice(channelIndex, 1);

          return [...channels];
        });
      }
    };

    client.on('channel.hidden', handleEvent);

    return () => {
      client.off('channel.hidden', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};
