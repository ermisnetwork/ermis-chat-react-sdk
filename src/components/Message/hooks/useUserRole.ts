import { StreamMessage, useChannelStateContext } from '../../../context/ChannelStateContext';
import { useChatContext } from '../../../context/ChatContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useUserRole = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message: StreamMessage<ErmisChatGenerics>,
) => {
  const { channel, channelCapabilities = {} } = useChannelStateContext<ErmisChatGenerics>(
    'useUserRole',
  );
  const { client } = useChatContext<ErmisChatGenerics>('useUserRole');

  const isOwner = channel.state.membership.channel_role === 'owner';
  const isModerator = channel.state.membership.channel_role === 'moder';
  const isMember = channel.state.membership.channel_role === 'member';
  const isPending = channel.state.membership.channel_role === 'pending';

  const isMyMessage = client.userID === message.user?.id;
  const isDirectChannel = channel.data?.type === 'messaging';

  const canEdit = isDirectChannel
    ? isMyMessage
    : isMyMessage && (!isMember || channelCapabilities['update-own-message']);

  const canDelete = isDirectChannel
    ? isMyMessage
    : isOwner || isModerator || (isMyMessage && channelCapabilities['delete-own-message']);

  const canReact = !isMember || channelCapabilities['send-reaction'];

  const canReply = !isMember || channelCapabilities['send-reply'];

  return {
    canDelete,
    canEdit,
    canReact,
    canReply,
    isMember,
    isModerator,
    isMyMessage,
    isOwner,
    isPending,
  };
};
