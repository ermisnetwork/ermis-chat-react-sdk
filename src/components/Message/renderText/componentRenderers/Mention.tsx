import React, { PropsWithChildren } from 'react';

import type { UserResponse } from 'ermis-chat-js-sdk';
import type { DefaultErmisChatGenerics } from '../../../../types/types';

export type MentionProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = PropsWithChildren<{
  node: {
    mentionedUser: UserResponse<ErmisChatGenerics>;
  };
}>;

export const Mention = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  node: { mentionedUser },
}: MentionProps<ErmisChatGenerics>) => (
  <span
    className={`str-chat__message-mention ${mentionedUser.id === 'all' && 'mention-all'}`}
    data-user-id={mentionedUser.id}
  >
    {mentionedUser.name}
  </span>
);
