import { useCallback, useMemo } from 'react';

import { useChatContext, useComponentContext, useMessageContext } from '../../../context';

import type { ReactionsListProps } from '../ReactionsList';
import type { DefaultErmisChatGenerics } from '../../../types/types';
import type { ReactionsComparator, ReactionSummary } from '../types';

type SharedReactionListProps = 'reaction_counts' | 'reactionOptions' | 'reactions';

type UseProcessReactionsParams = Pick<ReactionsListProps, SharedReactionListProps> & {
  sortReactions?: ReactionsComparator;
};

export const useProcessReactions = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  params: UseProcessReactionsParams,
) => {
  const {
    reaction_counts: propReactionCounts,
    reactionOptions: propReactionOptions,
    reactions: propReactions,
  } = params;
  const { message } = useMessageContext<ErmisChatGenerics>('useProcessReactions');
  const { reactionOptions: contextReactionOptions } = useComponentContext<ErmisChatGenerics>(
    'useProcessReactions',
  );
  const { client } = useChatContext('useProcessReactions');

  const reactionOptions = propReactionOptions ?? contextReactionOptions;
  const latestReactions = propReactions || message.latest_reactions;
  const reactionCounts = propReactionCounts || message?.reaction_counts;

  const getEmojiByReactionType = useCallback(
    (reactionType: string) =>
      reactionOptions.find(({ type }) => type === reactionType)?.Component ?? null,
    [reactionOptions],
  );

  // const isSupportedReaction = useCallback(
  //   (reactionType: string) =>
  //     reactionOptions.some((reactionOption) => reactionOption.type === reactionType),
  //   [reactionOptions],
  // );

  const getLatestReactedUsers = useCallback(
    (reactionType?: string) =>
      latestReactions?.flatMap((reaction) => {
        if (reactionType && reactionType === reaction.type) {
          const id = reaction.user_id || '';
          const user = client.state.users[id];
          const name = user ? user.name : id;
          const avatar = user ? user.avatar || '' : '';
          return { avatar, id, name };
        }
        return [];
      }) ?? [],
    [client, latestReactions],
  );

  const existingReactions: ReactionSummary[] = useMemo(() => {
    if (!reactionCounts) {
      return [];
    }

    const unsortedReactions = Object.keys(reactionCounts).map((reactionType) => {
      const latestReactedUsers = getLatestReactedUsers(reactionType);
      const isOwnReaction = latestReactedUsers.some((user) => user.id === client.userID);
      const count = reactionCounts[reactionType];

      return {
        EmojiComponent: getEmojiByReactionType(reactionType),
        isOwnReaction,
        latestReactedUsers,
        reactionCount: count,
        reactionType,
      };
    });

    return unsortedReactions;
  }, [client, getEmojiByReactionType, getLatestReactedUsers, reactionCounts]);

  const hasReactions = existingReactions.length > 0;

  const totalReactionCount = useMemo(
    () => existingReactions.reduce((total, { reactionCount }) => total + reactionCount, 0),
    [existingReactions],
  );

  return {
    existingReactions,
    hasReactions,
    totalReactionCount,
  };
};
