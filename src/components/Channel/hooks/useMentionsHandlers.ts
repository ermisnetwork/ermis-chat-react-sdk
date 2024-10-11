import React, { useCallback } from 'react';

import type { UserResponse } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export type OnMentionAction<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = (event: React.BaseSyntheticEvent, user?: UserResponse<ErmisChatGenerics>) => void;

export const useMentionsHandlers = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  onMentionsHover?: OnMentionAction<ErmisChatGenerics>,
  onMentionsClick?: OnMentionAction<ErmisChatGenerics>,
) =>
  useCallback(
    (event: React.BaseSyntheticEvent, mentioned_users: UserResponse<ErmisChatGenerics>[]) => {
      if ((!onMentionsHover && !onMentionsClick) || !(event.target instanceof HTMLElement)) {
        return;
      }

      const target = event.target;
      const textContent = target.innerHTML.replace('*', '');

      if (textContent[0] === '@') {
        const userName = textContent.replace('@', '');
        const user = mentioned_users?.find(({ id, name }) => name === userName || id === userName);

        if (
          onMentionsHover &&
          typeof onMentionsHover === 'function' &&
          event.type === 'mouseover'
        ) {
          onMentionsHover(event, user);
        }

        if (onMentionsClick && event.type === 'click' && typeof onMentionsClick === 'function') {
          onMentionsClick(event, user);
        }
      }
    },
    [onMentionsClick, onMentionsHover],
  );
