import type { User } from 'stream-chat';

import type { ReactEventHandler } from '../types';

import type { StreamMessage } from '../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export type UserEventHandler<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = (event: React.BaseSyntheticEvent, user: User<ErmisChatGenerics>) => void;

export const useUserHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
  eventHandlers?: {
    onUserClickHandler?: UserEventHandler<ErmisChatGenerics>;
    onUserHoverHandler?: UserEventHandler<ErmisChatGenerics>;
  },
): {
  onUserClick: ReactEventHandler;
  onUserHover: ReactEventHandler;
} => ({
  onUserClick: (event) => {
    if (typeof eventHandlers?.onUserClickHandler !== 'function' || !message?.user) {
      return;
    }
    eventHandlers.onUserClickHandler(event, message.user);
  },
  onUserHover: (event) => {
    if (typeof eventHandlers?.onUserHoverHandler !== 'function' || !message?.user) {
      return;
    }

    eventHandlers.onUserHoverHandler(event, message.user);
  },
});
