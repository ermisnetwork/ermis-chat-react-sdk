import { useChatContext } from '../../../context/ChatContext';

import type { ErmisChat, UpdatedMessage } from 'ermis-chat-js-sdk';

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
  const { channel } = useChatContext<ErmisChatGenerics>('useEditMessageHandler');

  return (updatedMessage: UpdatedMessage<ErmisChatGenerics>, options?: UpdateMessageOptions) => {
    const messageId = String(updatedMessage.id) || '';
    const text = String(updatedMessage.text) || '';

    if (doUpdateMessageRequest && channel) {
      return Promise.resolve(doUpdateMessageRequest(channel.cid, updatedMessage, options));
    }

    return channel?.editMessage(messageId, text);

    // return client.updateMessage(updatedMessage, undefined, options);
  };
};
