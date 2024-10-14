import type { Channel, UserResponse } from 'stream-chat';

import type { DefaultErmisChatGenerics } from '../../types/types';

export type ChannelOrUserResponse<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Channel<ErmisChatGenerics> | UserResponse<ErmisChatGenerics>;

export const isChannel = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  output: ChannelOrUserResponse<ErmisChatGenerics>,
): output is Channel<ErmisChatGenerics> => (output as Channel<ErmisChatGenerics>).cid != null;
