import React, { RefObject, useCallback, useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';

import { useChannelActionContext } from '../../../context/ChannelActionContext';
import { StreamMessage, useChannelStateContext } from '../../../context/ChannelStateContext';
import { useChatContext } from '../../../context/ChatContext';

import type { ReactEventHandler } from '../types';

import type { Reaction, ReactionResponse } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const reactionHandlerWarning = `Reaction handler was called, but it is missing one of its required arguments.
Make sure the ChannelAction and ChannelState contexts are properly set and the hook is initialized with a valid message.`;

export const useReactionHandler = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
) => {
  const { updateMessage } = useChannelActionContext<ErmisChatGenerics>('useReactionHandler');
  const { channel, channelCapabilities } = useChannelStateContext<ErmisChatGenerics>(
    'useReactionHandler',
  );
  const { client } = useChatContext<ErmisChatGenerics>('useReactionHandler');

  const createMessagePreview = useCallback(
    (
      add: boolean,
      reaction: ReactionResponse<ErmisChatGenerics>,
      message: StreamMessage<ErmisChatGenerics>,
    ): StreamMessage<ErmisChatGenerics> => {
      const newReactions: Reaction<ErmisChatGenerics>[] | undefined = add
        ? [reaction, ...(message?.latest_reactions || [])]
        : message.latest_reactions?.filter(
            (item) => !(item.type === reaction.type && item.user_id === reaction.user_id),
          );

      return {
        ...message,
        latest_reactions: newReactions || message.latest_reactions,
      } as StreamMessage<ErmisChatGenerics>;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [client.user, client.userID],
  );

  const createReactionPreview = (type: string) => ({
    message_id: message?.id,
    score: 1,
    type,
    user: client.user,
    user_id: client.user?.id,
  });

  const toggleReaction = throttle(async (id: string, type: string, add: boolean) => {
    if (!message || !channelCapabilities['send-reaction']) return;

    const newReaction = createReactionPreview(type) as ReactionResponse<ErmisChatGenerics>;
    const tempMessage = createMessagePreview(add, newReaction, message);

    try {
      updateMessage(tempMessage);

      const messageResponse = add
        ? await channel.sendReaction(id, type)
        : await channel.deleteReaction(id, type);

      updateMessage(messageResponse.message);
    } catch (error) {
      // revert to the original message if the API call fails
      updateMessage(message);
    }
  }, 1000);

  return async (reactionType: string, event?: React.BaseSyntheticEvent) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    if (!message) {
      return console.warn(reactionHandlerWarning);
    }

    let userExistingReaction = (null as unknown) as ReactionResponse<ErmisChatGenerics>;

    if (message.latest_reactions) {
      message.latest_reactions.forEach((reaction) => {
        // own user should only ever contain the current user id
        // just in case we check to prevent bugs with message updates from breaking reactions
        if (reaction.user && client.userID === reaction.user.id && reaction.type === reactionType) {
          userExistingReaction = reaction;
        } else if (reaction.user && client.userID !== reaction.user.id) {
          console.warn(
            `message.latest_reactions contained reactions from a different user, this indicates a bug`,
          );
        }
      });
    }

    try {
      if (userExistingReaction) {
        await toggleReaction(message.id, userExistingReaction.type, false);
      } else {
        await toggleReaction(message.id, reactionType, true);
      }
    } catch (error) {
      console.log({ error });
    }
  };
};

export const useReactionClick = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message?: StreamMessage<ErmisChatGenerics>,
  reactionSelectorRef?: RefObject<HTMLDivElement | null>,
  messageWrapperRef?: RefObject<HTMLDivElement | null>,
  closeReactionSelectorOnClick?: boolean,
) => {
  const { channelCapabilities = {} } = useChannelStateContext<ErmisChatGenerics>(
    'useReactionClick',
  );

  const [showDetailedReactions, setShowDetailedReactions] = useState(false);

  const hasListener = useRef(false);

  const isReactionEnabled = channelCapabilities['send-reaction'];

  const messageDeleted = !!message?.deleted_at;

  const closeDetailedReactions: EventListener = useCallback(
    (event) => {
      if (
        event.target instanceof HTMLElement &&
        reactionSelectorRef?.current?.contains(event.target) &&
        !closeReactionSelectorOnClick
      ) {
        return;
      }

      setShowDetailedReactions(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setShowDetailedReactions, reactionSelectorRef],
  );

  useEffect(() => {
    const messageWrapper = messageWrapperRef?.current;

    if (showDetailedReactions && !hasListener.current) {
      hasListener.current = true;
      document.addEventListener('click', closeDetailedReactions);

      if (messageWrapper) {
        messageWrapper.addEventListener('mouseleave', closeDetailedReactions);
      }
    }

    if (!showDetailedReactions && hasListener.current) {
      document.removeEventListener('click', closeDetailedReactions);

      if (messageWrapper) {
        messageWrapper.removeEventListener('mouseleave', closeDetailedReactions);
      }

      hasListener.current = false;
    }

    return () => {
      if (hasListener.current) {
        document.removeEventListener('click', closeDetailedReactions);

        if (messageWrapper) {
          messageWrapper.removeEventListener('mouseleave', closeDetailedReactions);
        }

        hasListener.current = false;
      }
    };
  }, [showDetailedReactions, closeDetailedReactions, messageWrapperRef]);

  useEffect(() => {
    const messageWrapper = messageWrapperRef?.current;

    if (messageDeleted && hasListener.current) {
      document.removeEventListener('click', closeDetailedReactions);

      if (messageWrapper) {
        messageWrapper.removeEventListener('mouseleave', closeDetailedReactions);
      }

      hasListener.current = false;
    }
  }, [messageDeleted, closeDetailedReactions, messageWrapperRef]);

  const onReactionListClick: ReactEventHandler = (event) => {
    event?.stopPropagation?.();
    setShowDetailedReactions((prev) => !prev);
  };

  return {
    isReactionEnabled,
    onReactionListClick,
    showDetailedReactions,
  };
};
