import { RetrySendMessage, useChannelActionContext } from '../../../context/ChannelActionContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useRetryHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  customRetrySendMessage?: RetrySendMessage<ErmisChatGenerics>,
): RetrySendMessage<ErmisChatGenerics> => {
  const { retrySendMessage: contextRetrySendMessage } = useChannelActionContext<ErmisChatGenerics>(
    'useRetryHandler',
  );

  const retrySendMessage = customRetrySendMessage || contextRetrySendMessage;

  return async (message) => {
    if (message) {
      await retrySendMessage(message);
    }
  };
};
