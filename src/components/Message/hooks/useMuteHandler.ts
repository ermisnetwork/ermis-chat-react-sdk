import { isUserMuted, validateAndGetMessage } from '../utils';

import { StreamMessage, useChannelStateContext } from '../../../context/ChannelStateContext';
import { useChatContext } from '../../../context/ChatContext';
import { useTranslationContext } from '../../../context/TranslationContext';

import type { UserResponse } from 'ermis-chat-js-sdk';

import type { ReactEventHandler } from '../types';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const missingUseMuteHandlerParamsWarning =
  'useMuteHandler was called but it is missing one or more necessary parameter.';

export type MuteUserNotifications<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  getErrorNotification?: (user: UserResponse<ErmisChatGenerics>) => string;
  getSuccessNotification?: (user: UserResponse<ErmisChatGenerics>) => string;
  notify?: (notificationText: string, type: 'success' | 'error') => void;
};

export const useMuteHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
  notifications: MuteUserNotifications<ErmisChatGenerics> = {},
): ReactEventHandler => {
  const { mutes } = useChannelStateContext<ErmisChatGenerics>('useMuteHandler');
  const { client } = useChatContext<ErmisChatGenerics>('useMuteHandler');
  const { t } = useTranslationContext('useMuteHandler');

  return async (event) => {
    event.preventDefault();

    const { getErrorNotification, getSuccessNotification, notify } = notifications;

    if (!t || !message?.user || !notify || !client) {
      console.warn(missingUseMuteHandlerParamsWarning);
      return;
    }

    if (!isUserMuted(message, mutes)) {
      try {
        await client.muteUser(message.user.id);

        const successMessage =
          getSuccessNotification && validateAndGetMessage(getSuccessNotification, [message.user]);

        notify(
          successMessage ||
            t(`{{ user }} has been muted`, {
              user: message.user.name || message.user.id,
            }),
          'success',
        );
      } catch (e) {
        const errorMessage =
          getErrorNotification && validateAndGetMessage(getErrorNotification, [message.user]);

        notify(errorMessage || t('Error muting a user ...'), 'error');
      }
    } else {
      try {
        await client.unmuteUser(message.user.id);

        const fallbackMessage = t(`{{ user }} has been unmuted`, {
          user: message.user.name || message.user.id,
        });

        const successMessage =
          (getSuccessNotification &&
            validateAndGetMessage(getSuccessNotification, [message.user])) ||
          fallbackMessage;

        if (typeof successMessage === 'string') {
          notify(successMessage, 'success');
        }
      } catch (e) {
        const errorMessage =
          (getErrorNotification && validateAndGetMessage(getErrorNotification, [message.user])) ||
          t('Error unmuting a user ...');

        if (typeof errorMessage === 'string') {
          notify(errorMessage, 'error');
        }
      }
    }
  };
};
