import { useChannelActionContext } from '../../../context/ChannelActionContext';

import type { ReactEventHandler } from '../types';

import type { StreamMessage } from '../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useOpenThreadHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
  customOpenThread?: (
    message: StreamMessage<ErmisChatGenerics>,
    event: React.BaseSyntheticEvent,
  ) => void,
): ReactEventHandler => {
  const { openThread: channelOpenThread } = useChannelActionContext<ErmisChatGenerics>(
    'useOpenThreadHandler',
  );

  const openThread = customOpenThread || channelOpenThread;

  return (event) => {
    if (!openThread || !message) {
      console.warn('Open thread handler was called but it is missing one of its parameters');
      return;
    }

    openThread(message, event);
  };
};
