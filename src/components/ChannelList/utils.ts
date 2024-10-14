import type { Channel } from 'ermis-chat-js-sdk';
import uniqBy from 'lodash.uniqby';

import type { DefaultErmisChatGenerics } from '../../types/types';

export const MAX_QUERY_CHANNELS_LIMIT = 30;

type MoveChannelUpParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  channels: Array<Channel<ErmisChatGenerics>>;
  cid: string;
  activeChannel?: Channel<ErmisChatGenerics>;
};

export const moveChannelUp = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  activeChannel,
  channels,
  cid,
}: MoveChannelUpParams<ErmisChatGenerics>) => {
  // get index of channel to move up
  const channelIndex = channels.findIndex((channel) => channel.cid === cid);

  if (!activeChannel && channelIndex <= 0) return channels;

  // get channel to move up
  const channel = activeChannel || channels[channelIndex];

  return uniqBy([channel, ...channels], 'cid');
};
