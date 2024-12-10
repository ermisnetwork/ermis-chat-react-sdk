import React from 'react';
import { Avatar, useChatContext } from 'ermis-chat-react-sdk';

import { CreateChannelIcon } from '../../assets';
import streamLogo from '../../assets/ProfilePic_LogoMark_GrdntOnWt.png';

import type { ErmisChatGenerics } from '../../types';

type Props = {
  onCreateChannel?: () => void;
};

const MessagingChannelListHeader = React.memo((props: Props) => {
  const { onCreateChannel } = props;

  const { client } = useChatContext<ErmisChatGenerics>();

  const { id, image = streamLogo as string, name = 'Example User' } = client.user || {};

  return (
    <div className='messaging__channel-list__header'>
      <Avatar image={image} name={name} />
      <div className={`messaging__channel-list__header__name`}>{name || id}</div>
      <button className={`messaging__channel-list__header__button`} onClick={onCreateChannel}>
        <CreateChannelIcon />
      </button>
    </div>
  );
});

export default React.memo(MessagingChannelListHeader);
