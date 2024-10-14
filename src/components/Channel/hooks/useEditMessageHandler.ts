import { useChatContext } from '../../../context/ChatContext';

import type { ErmisChat, UpdatedMessage } from 'stream-chat';

import type { DefaultErmisChatGenerics, UpdateMessageOptions } from '../../../types/types';

type UpdateHandler<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = (
  cid: string,
  updatedMessage: UpdatedMessage<ErmisChatGenerics>,
  options?: UpdateMessageOptions,
) => ReturnType<ErmisChat<ErmisChatGenerics>['updateMessage']>;

export const useEditMessageHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  doUpdateMessageRequest?: UpdateHandler<ErmisChatGenerics>,
) => {
  const { channel, client } = useChatContext<ErmisChatGenerics>('useEditMessageHandler');

  return (updatedMessage: UpdatedMessage<ErmisChatGenerics>, options?: UpdateMessageOptions) => {
    if (doUpdateMessageRequest && channel) {
      return Promise.resolve(doUpdateMessageRequest(channel.cid, updatedMessage, options));
    }
    return client.updateMessage(updatedMessage, undefined, options);
  };
};
