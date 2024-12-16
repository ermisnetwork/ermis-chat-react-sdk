import React from 'react';

import { AvatarProps, Avatar as DefaultAvatar } from '../Avatar';

import { useTranslationContext } from '../../context/TranslationContext';

import type { StreamMessage } from '../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../types/types';
import { getDateString } from '../../i18n/utils';
import { useChannelStateContext, useChatContext } from '../../context';
import { getUserNameAndImage } from '../../utils';

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
  const { client } = useChatContext<ErmisChatGenerics>('EventComponent');
  const { channel } = useChannelStateContext<ErmisChatGenerics>('EventComponent');
  const { tDateTimeParser } = useTranslationContext('EventComponent');
  const { created_at = '', event, text, type } = message;
  const getDateOptions = { messageCreatedAt: created_at.toString(), tDateTimeParser };
  const isDirectChannel = channel.data?.type === 'messaging';
  const userInfo = getUserNameAndImage(String(event?.user?.id), client);

  const convertDuration = (duration: string) => {
    let durationText;
    switch (duration) {
      case '10000':
        durationText = '10 seconds';
        break;
      case '30000':
        durationText = '30 seconds';
        break;
      case '60000':
        durationText = '1 minutes';
        break;
      case '300000':
        durationText = '5 minutes';
        break;
      case '900000':
        durationText = '15 minutes';
        break;
      case '3600000':
        durationText = '60 minutes';
        break;
      default:
        durationText = '';
        break;
    }

    return durationText;
  };

  const convertMessageSystem = () => {
    if (!text) return '';
    const parts = text.split(' ');
    const number = parseInt(parts[0]);
    const userId = parts[1];
    const myUserId = client.userID;
    const isMe = myUserId === userId;
    const memberInfo = client.state.users[userId];
    const userName = memberInfo ? memberInfo.name : userId;
    const name = isMe ? 'You' : userName;

    let channelName = '';
    let duration = '';
    let channelType = '';
    if (number === 1) {
      channelName = parts.slice(2).join(' ');
    }

    if (number === 14) {
      channelType = parts[2] === 'true' ? 'public' : 'private';
    }

    if (number === 15) {
      duration = parts[2];
    }

    let message;
    switch (number) {
      case 1: // UpdateName
        message = `${name} changed the channel name to ${channelName}`;
        break;
      case 2: // UpdateImageDesc
        message = `${name} has changed the channel avatar`;
        break;
      case 3: // UpdateDescription
        message = `${name} has changed the channel description`;
        break;
      case 4: // MemberRemoved
        message = `${name} has been removed from this channel`;
        break;
      case 5: // MemberBanned
        message = `${name} has been banned from interacting in this channel by Channel Admin`;
        break;
      case 6: // MemberUnbanned
        message = `${name} have been unbanned and now can interact in this channel`;
        break;
      case 7: // MemberPromoted
        message = `${name} has been assigned as the moderator for this channel`;
        break;
      case 8: // MemberDemoted
        message = `${name} has been removed as the moderator from this channel`;
        break;
      case 9: // UpdateChannelMemberCapabilities
        message = `${name} has updated member permission of channel`;
        break;
      case 10: // InviteAccepted
        message = `${name} have joined this ${isDirectChannel ? 'conversation' : 'channel'}`;
        break;
      case 11: // InviteRejected
        message = `${name} has declined to join this channel`;
        break;
      case 12: // MemberLeave
        message = `${name} has leaved this channel`;
        break;
      case 13: // TruncateMessages
        message = `${name} has truncate all messages of this channel`;
        break;
      case 14: // UpdatePublic
        message = `${name} has made this channel ${channelType}`;
        break;
      case 15: // UpdateMemberMessageCooldown
        message =
          duration === '0'
            ? `Cooldown has been disabled`
            : `Cooldown feature enabled by Channel Admin. Cooldown duration set to ${convertDuration(
                duration,
              )}`;
        break;
      case 16: // UpdateFilterWords
        message = `${name} has update channel filter words`;
        break;
      case 17: // MemberJoined
        message = `${name} has been joined to this channel`;
        break;
      default:
        message = text;
    }

    return message;
  };

  if (type === 'system')
    return (
      <div className='str-chat__message--system' data-testid='message-system'>
        <div className='str-chat__message--system__text'>
          <div className='str-chat__message--system__line' />
          <p>{convertMessageSystem()}</p>
          <div className='str-chat__message--system__line' />
        </div>
        <div className='str-chat__message--system__date'>
          <strong>{getDateString({ ...getDateOptions, format: 'dddd' })} </strong>
          at {getDateString({ ...getDateOptions, format: 'hh:mm A' })}
        </div>
      </div>
    );

  if (event?.type === 'member.removed' || event?.type === 'member.added') {
    // const name = event.user?.name || event.user?.id;
    const sentence = `${userInfo.name} ${
      event.type === 'member.added' ? 'has joined the chat' : 'was removed from the chat'
    }`;

    return (
      <div className='str-chat__event-component__channel-event'>
        <Avatar image={userInfo.image} name={userInfo.name} user={event.user} />
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
