import React from 'react';

import { AvatarProps, Avatar as DefaultAvatar } from '../Avatar';

import { useTranslationContext } from '../../context/TranslationContext';

import type { StreamMessage } from '../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../types/types';
import { getDateString } from '../../i18n/utils';

export type EventComponentProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** Message object */
  message: StreamMessage<ErmisChatGenerics>;
  /** Custom UI component to display user avatar, defaults to and accepts same props as: [Avatar](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Avatar/Avatar.tsx) */
  Avatar?: React.ComponentType<AvatarProps>;
};

/**
 * Component to display system and channel event messages
 */
const UnMemoizedEventComponent = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: EventComponentProps<ErmisChatGenerics>,
) => {
  const { Avatar = DefaultAvatar, message } = props;

  const { tDateTimeParser } = useTranslationContext('EventComponent');
  const { created_at = '', event, text, type } = message;
  const getDateOptions = { messageCreatedAt: created_at.toString(), tDateTimeParser };

  if (type === 'system')
    return (
      <div className='str-chat__message--system' data-testid='message-system'>
        <div className='str-chat__message--system__text'>
          <div className='str-chat__message--system__line' />
          <p>{text}</p>
          <div className='str-chat__message--system__line' />
        </div>
        <div className='str-chat__message--system__date'>
          <strong>{getDateString({ ...getDateOptions, format: 'dddd' })} </strong>
          at {getDateString({ ...getDateOptions, format: 'hh:mm A' })}
        </div>
      </div>
    );

  if (event?.type === 'member.removed' || event?.type === 'member.added') {
    const name = event.user?.name || event.user?.id;
    const sentence = `${name} ${
      event.type === 'member.added' ? 'has joined the chat' : 'was removed from the chat'
    }`;

    return (
      <div className='str-chat__event-component__channel-event'>
        <Avatar image={event.user?.image} name={name} user={event.user} />
        <div className='str-chat__event-component__channel-event__content'>
          <em className='str-chat__event-component__channel-event__sentence'>{sentence}</em>
          <div className='str-chat__event-component__channel-event__date'>
            {getDateString({ ...getDateOptions, format: 'LT' })}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const EventComponent = React.memo(
  UnMemoizedEventComponent,
) as typeof UnMemoizedEventComponent;
