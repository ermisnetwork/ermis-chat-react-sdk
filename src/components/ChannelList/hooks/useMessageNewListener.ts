import { useEffect } from 'react';
import uniqBy from 'lodash.uniqby';

import { moveChannelUp } from '../utils';

import { useChatContext } from '../../../context/ChatContext';

import type { Channel, Event } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useMessageNewListener = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
  customHandler?: (
    setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
    event: Event<ErmisChatGenerics>,
  ) => void,
  lockChannelOrder = false,
  allowNewMessagesFromUnfilteredChannels = true,
) => {
  const { client } = useChatContext<ErmisChatGenerics>('useMessageNewListener');

  useEffect(() => {
    const handleEvent = (event: Event<ErmisChatGenerics>) => {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, event);
      } else {
        setChannels((channels) => {
          const channelInList = channels.filter((channel) => channel.cid === event.cid).length > 0;

          if (!channelInList && allowNewMessagesFromUnfilteredChannels && event.channel_type) {
            const channel = client.channel(event.channel_type, event.channel_id);
            return uniqBy([channel, ...channels], 'cid');
          }

          if (!lockChannelOrder) return moveChannelUp({ channels, cid: event.cid || '' });

          return channels;
        });
      }
    };

    client.on('message.new', handleEvent);

    return () => {
      client.off('message.new', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lockChannelOrder]);
};
