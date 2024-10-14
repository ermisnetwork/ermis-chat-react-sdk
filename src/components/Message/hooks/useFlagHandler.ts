import { validateAndGetMessage } from '../utils';

import { useChatContext } from '../../../context/ChatContext';
import { useTranslationContext } from '../../../context/TranslationContext';

import type { ReactEventHandler } from '../types';

import type { StreamMessage } from '../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const missingUseFlagHandlerParameterWarning =
  'useFlagHandler was called but it is missing one or more necessary parameters.';

export type FlagMessageNotifications<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  getErrorNotification?: (message: StreamMessage<ErmisChatGenerics>) => string;
  getSuccessNotification?: (message: StreamMessage<ErmisChatGenerics>) => string;
  notify?: (notificationText: string, type: 'success' | 'error') => void;
};

export const useFlagHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
  notifications: FlagMessageNotifications<ErmisChatGenerics> = {},
): ReactEventHandler => {
  const { client } = useChatContext<ErmisChatGenerics>('useFlagHandler');
  const { t } = useTranslationContext('useFlagHandler');

  return async (event) => {
    event.preventDefault();

    const { getErrorNotification, getSuccessNotification, notify } = notifications;

    if (!client || !t || !notify || !message?.id) {
      console.warn(missingUseFlagHandlerParameterWarning);
      return;
    }

    if (client.user?.banned) {
      return notify(t('Error adding flag'), 'error');
    }

    try {
      await client.flagMessage(message.id);

      const successMessage =
        getSuccessNotification && validateAndGetMessage(getSuccessNotification, [message]);

      notify(successMessage || t('Message has been successfully flagged'), 'success');
    } catch (e) {
      const errorMessage =
        getErrorNotification && validateAndGetMessage(getErrorNotification, [message]);

      notify(errorMessage || t('Error adding flag'), 'error');
    }
  };
};
