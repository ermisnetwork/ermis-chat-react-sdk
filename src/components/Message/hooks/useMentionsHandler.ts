import { useChannelActionContext } from '../../../context/ChannelActionContext';

import type React from 'react';
import type { UserResponse } from 'ermis-chat-js-sdk';

import type { ReactEventHandler } from '../types';

import type { StreamMessage } from '../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export type CustomMentionHandler<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = (event: React.BaseSyntheticEvent, mentioned_users: UserResponse<ErmisChatGenerics>[]) => void;

export type MentionedUserEventHandler<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = (event: React.BaseSyntheticEvent, mentionedUsers: UserResponse<ErmisChatGenerics>[]) => void;

function createEventHandler<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  fn?: CustomMentionHandler<ErmisChatGenerics>,
  message?: StreamMessage<ErmisChatGenerics>,
): ReactEventHandler {
  return (event) => {
    if (typeof fn !== 'function' || !message?.mentioned_users?.length) {
      return;
    }
    fn(event, message.mentioned_users);
  };
}

export const useMentionsHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
  customMentionHandler?: {
    onMentionsClick?: CustomMentionHandler<ErmisChatGenerics>;
    onMentionsHover?: CustomMentionHandler<ErmisChatGenerics>;
  },
) => {
  const {
    onMentionsClick: contextOnMentionsClick,
    onMentionsHover: contextOnMentionsHover,
  } = useChannelActionContext<ErmisChatGenerics>('useMentionsHandler');

  const onMentionsClick =
    customMentionHandler?.onMentionsClick || contextOnMentionsClick || (() => null);

  const onMentionsHover =
    customMentionHandler?.onMentionsHover || contextOnMentionsHover || (() => null);

  return {
    onMentionsClick: createEventHandler(onMentionsClick, message),
    onMentionsHover: createEventHandler(onMentionsHover, message),
  };
};
