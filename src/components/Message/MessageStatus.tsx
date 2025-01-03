import React, { useEffect, useState } from 'react';
import clsx from 'clsx';

import { DeliveredCheckIcon, MessageDeliveredIcon } from './icons';
import { getReadByTooltipText, mapToUserNameOrId, TooltipUsernameMapper } from './utils';

import { AvatarProps, Avatar as DefaultAvatar } from '../Avatar';
import { LoadingIndicator } from '../Loading';
import { PopperTooltip, Tooltip } from '../Tooltip';
import { useEnterLeaveHandlers } from '../Tooltip/hooks';

import { useChatContext } from '../../context/ChatContext';
import { useComponentContext } from '../../context/ComponentContext';
import { useMessageContext } from '../../context/MessageContext';
import { useTranslationContext } from '../../context/TranslationContext';

import type { DefaultErmisChatGenerics } from '../../types/types';
import { getUserNameAndImage } from '../../utils';

export type MessageStatusProps = {
  /* Custom UI component to display a user's avatar (overrides the value from `ComponentContext`) */
  Avatar?: React.ComponentType<AvatarProps>;
  /* Custom component to render when message is considered delivered, not read. The default UI renders MessageDeliveredIcon and a tooltip with string 'Delivered'. */
  MessageDeliveredStatus?: React.ComponentType;
  /* Custom component to render when message is considered delivered and read. The default UI renders the last reader's Avatar and a tooltip with string readers' names. */
  MessageReadStatus?: React.ComponentType;
  /* Custom component to render when message is considered as being the in the process of delivery. The default UI renders LoadingIndicator and a tooltip with string 'Sending'. */
  MessageSendingStatus?: React.ComponentType;
  /* Message type string to be added to CSS class names. */
  messageType?: string;
  /* Allows to customize the username(s) that appear on the message status tooltip */
  tooltipUserNameMapper?: TooltipUsernameMapper;
};

const UnMemoizedMessageStatus = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageStatusProps,
) => {
  const {
    Avatar: propAvatar,
    MessageDeliveredStatus,
    MessageReadStatus,
    MessageSendingStatus,
    messageType = 'simple',
    tooltipUserNameMapper = mapToUserNameOrId,
  } = props;

  const { handleEnter, handleLeave, tooltipVisible } = useEnterLeaveHandlers<HTMLSpanElement>();

  const { client, themeVersion } = useChatContext<ErmisChatGenerics>('MessageStatus');
  const { Avatar: contextAvatar } = useComponentContext<ErmisChatGenerics>('MessageStatus');
  const {
    isMyMessage,
    lastReceivedId,
    message,
    readBy,
    threadList,
  } = useMessageContext<ErmisChatGenerics>('MessageStatus');
  const { t } = useTranslationContext('MessageStatus');
  const [referenceElement, setReferenceElement] = useState<HTMLSpanElement | null>(null);
  const [newReadBy, setNewReadBy] = useState<any[]>([]);

  useEffect(() => {
    if (readBy && readBy.length) {
      const newArr = readBy.map((user) => {
        const userInfo = getUserNameAndImage(user.id, client);
        return { ...user, image: userInfo.image, name: userInfo.name };
      });
      setNewReadBy(newArr);
    }
  }, [readBy, client]);

  const Avatar = propAvatar || contextAvatar || DefaultAvatar;

  if (!isMyMessage() || message.type === 'error') return null;

  const justReadByMe = newReadBy?.length === 1 && newReadBy[0].id === client.user?.id;
  const rootClassName = `str-chat__message-${messageType}-status str-chat__message-status`;

  const sending = message.status === 'sending';
  const delivered = message.status === 'received' && message.id === lastReceivedId && !threadList;
  const deliveredAndRead = !!(newReadBy?.length && !threadList && !justReadByMe);

  const [lastReadUser] = deliveredAndRead
    ? newReadBy.filter((item) => item.id !== client.user?.id)
    : [];

  return (
    <span
      className={rootClassName}
      data-testid={clsx({
        'message-status-read-by': deliveredAndRead,
        'message-status-received': delivered && !deliveredAndRead,
        'message-status-sending': sending,
      })}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      ref={setReferenceElement}
    >
      {sending &&
        (MessageSendingStatus ? (
          <MessageSendingStatus />
        ) : (
          <>
            {themeVersion === '1' && <Tooltip>{t<string>('Sending...')}</Tooltip>}
            {themeVersion === '2' && (
              <PopperTooltip
                offset={[0, 5]}
                referenceElement={referenceElement}
                visible={tooltipVisible}
              >
                {t<string>('Sending...')}
              </PopperTooltip>
            )}
            <LoadingIndicator />
          </>
        ))}

      {delivered &&
        !deliveredAndRead &&
        (MessageDeliveredStatus ? (
          <MessageDeliveredStatus />
        ) : (
          <>
            {themeVersion === '1' && <Tooltip>{t<string>('Delivered')}</Tooltip>}
            {themeVersion === '2' && (
              <PopperTooltip
                offset={[0, 5]}
                referenceElement={referenceElement}
                visible={tooltipVisible}
              >
                {t<string>('Delivered')}
              </PopperTooltip>
            )}
            {themeVersion === '2' ? <MessageDeliveredIcon /> : <DeliveredCheckIcon />}
          </>
        ))}

      {deliveredAndRead &&
        (MessageReadStatus ? (
          <MessageReadStatus />
        ) : (
          <>
            {themeVersion === '1' && (
              <Tooltip>{getReadByTooltipText(newReadBy, t, client, tooltipUserNameMapper)}</Tooltip>
            )}
            {themeVersion === '2' && (
              <PopperTooltip
                offset={[0, 5]}
                referenceElement={referenceElement}
                visible={tooltipVisible}
              >
                {getReadByTooltipText(newReadBy, t, client, tooltipUserNameMapper)}
              </PopperTooltip>
            )}
            <Avatar
              image={lastReadUser.image}
              name={lastReadUser.name || lastReadUser.id}
              size={15}
              user={lastReadUser}
            />

            {newReadBy.length > 2 && (
              <span
                className={`str-chat__message-${messageType}-status-number`}
                data-testid='message-status-read-by-many'
              >
                {newReadBy.length - 1}
              </span>
            )}
          </>
        ))}
    </span>
  );
};

export const MessageStatus = React.memo(UnMemoizedMessageStatus) as typeof UnMemoizedMessageStatus;
