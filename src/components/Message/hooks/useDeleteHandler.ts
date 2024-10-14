import { validateAndGetMessage } from '../utils';

import { useChannelActionContext } from '../../../context/ChannelActionContext';
import { useChatContext } from '../../../context/ChatContext';
import { useTranslationContext } from '../../../context/TranslationContext';

import type { ReactEventHandler } from '../types';

import type { StreamMessage } from '../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export type DeleteMessageNotifications<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  getErrorNotification?: (message: StreamMessage<ErmisChatGenerics>) => string;
  notify?: (notificationText: string, type: 'success' | 'error') => void;
};

export const useDeleteHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
  notifications: DeleteMessageNotifications<ErmisChatGenerics> = {},
): ReactEventHandler => {
  const { getErrorNotification, notify } = notifications;

  const { deleteMessage, updateMessage } = useChannelActionContext<ErmisChatGenerics>(
    'useDeleteHandler',
  );
  const { client } = useChatContext<ErmisChatGenerics>('useDeleteHandler');
  const { t } = useTranslationContext('useDeleteHandler');

  return async (event) => {
    event.preventDefault();
    if (!message?.id || !client || !updateMessage) {
      return;
    }

    try {
      const deletedMessage = await deleteMessage(message);
      updateMessage(deletedMessage);
    } catch (e) {
      const errorMessage =
        getErrorNotification && validateAndGetMessage(getErrorNotification, [message]);

      if (notify) notify(errorMessage || t('Error deleting message'), 'error');
    }
  };
};
