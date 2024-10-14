import { useEffect } from 'react';

import { useChatContext } from '../../../context/ChatContext';

import type { Channel, Event } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useChannelTruncatedListener = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
  customHandler?: (
    setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
    event: Event<ErmisChatGenerics>,
  ) => void,
  forceUpdate?: () => void,
) => {
  const { client } = useChatContext<ErmisChatGenerics>('useChannelTruncatedListener');

  useEffect(() => {
    const handleEvent = (event: Event<ErmisChatGenerics>) => {
      setChannels((channels) => [...channels]);

      if (customHandler && typeof customHandler === 'function') {
        customHandler(setChannels, event);
      }
      if (forceUpdate) {
        forceUpdate();
      }
    };

    client.on('channel.truncated', handleEvent);

    return () => {
      client.off('channel.truncated', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customHandler]);
};
