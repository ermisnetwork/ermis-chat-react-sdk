import { StreamMessage, useChatContext, useTranslationContext } from '../../../context';
import { DefaultErmisChatGenerics } from '../../../types/types';
import { ReactionResponse, ReactionSort, ErmisChat } from 'ermis-chat-js-sdk';
import { ReactionType } from '../../Reactions/types';

export const MAX_MESSAGE_REACTIONS_TO_FETCH = 1000;

type FetchMessageReactionsNotifications<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  getErrorNotification?: (message: StreamMessage<ErmisChatGenerics>) => string;
  notify?: (notificationText: string, type: 'success' | 'error') => void;
};

export function useReactionsFetcher<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  message: StreamMessage<ErmisChatGenerics>,
  notifications: FetchMessageReactionsNotifications<ErmisChatGenerics> = {},
) {
  const { client } = useChatContext('useRectionsFetcher');
  const { t } = useTranslationContext('useReactionFetcher');
  const { getErrorNotification, notify } = notifications;

  return async (
    reactionType?: ReactionType<ErmisChatGenerics>,
    sort?: ReactionSort<ErmisChatGenerics>,
  ) => {
    try {
      return await fetchMessageReactions(client, message.id, reactionType, sort);
    } catch (e) {
      const errorMessage = getErrorNotification?.(message);
      notify?.(errorMessage || t('Error fetching reactions'), 'error');
      throw e;
    }
  };
}

async function fetchMessageReactions<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  client: ErmisChat<ErmisChatGenerics>,
  messageId: string,
  reactionType?: ReactionType<ErmisChatGenerics>,
  sort?: ReactionSort<ErmisChatGenerics>,
) {
  const reactions: ReactionResponse<ErmisChatGenerics>[] = [];
  const limit = 25;
  let next: string | undefined;
  let hasNext = true;

  while (hasNext && reactions.length < MAX_MESSAGE_REACTIONS_TO_FETCH) {
    const response = await client.queryReactions(
      messageId,
      reactionType ? { type: reactionType } : {},
      sort,
      { limit, next },
    );

    reactions.push(...response.reactions);
    next = response.next;
    hasNext = Boolean(next);
  }

  return reactions;
}
