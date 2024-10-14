import { useEffect } from 'react';

import { useChatContext } from '../../../context/ChatContext';

import type { Channel, Event } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useUserPresenceChangedListener = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  setChannels: React.Dispatch<React.SetStateAction<Array<Channel<ErmisChatGenerics>>>>,
) => {
  const { client } = useChatContext<ErmisChatGenerics>('useUserPresenceChangedListener');

  useEffect(() => {
    const handleEvent = (event: Event<ErmisChatGenerics>) => {
      setChannels((channels) => {
        const newChannels = channels.map((channel) => {
          if (!event.user?.id || !channel.state.members[event.user.id]) {
            return channel;
          }

          const newChannel = channel; // dumb workaround for linter
          newChannel.state.members[event.user.id].user = event.user;

          return newChannel;
        });

        return [...newChannels];
      });
    };

    client.on('user.presence.changed', handleEvent);

    return () => {
      client.off('user.presence.changed', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
