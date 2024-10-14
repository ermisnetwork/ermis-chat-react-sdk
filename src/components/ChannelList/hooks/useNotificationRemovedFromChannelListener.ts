import { useEffect } from 'react';

import { useChatContext } from '../../../context/ChatContext';

import type { Channel, Event } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useNotificationRemovedFromChannelListener = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
  customHandler?: (
    setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
    event: Event<ErmisChatGenerics>,
  ) => void,
) => {
  const { client } = useChatContext<ErmisChatGenerics>(
    'useNotificationRemovedFromChannelListener',
  );

  useEffect(() => {
    const handleEvent = (event: Event<ErmisChatGenerics>) => {
      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, event);
      } else {
        setChannels((channels) => channels.filter((channel) => channel.cid !== event.channel?.cid));
      }
    };

    client.on('notification.removed_from_channel', handleEvent);

    return () => {
      client.off('notification.removed_from_channel', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};
