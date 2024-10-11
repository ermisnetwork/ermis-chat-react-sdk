import { useEffect, useState } from 'react';
import { ReactionResponse, ReactionSort } from 'ermis-chat-js-sdk';
import { MessageContextValue, useMessageContext } from '../../../context';
import { DefaultErmisChatGenerics } from '../../../types/types';
import { ReactionType } from '../types';

export interface FetchReactionsOptions<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> {
  reactionType: ReactionType<ErmisChatGenerics>;
  shouldFetch: boolean;
  handleFetchReactions?: MessageContextValue<ErmisChatGenerics>['handleFetchReactions'];
  sort?: ReactionSort<ErmisChatGenerics>;
}

export function useFetchReactions<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(options: FetchReactionsOptions<ErmisChatGenerics>) {
  const {
    handleFetchReactions: contextHandleFetchReactions,
  } = useMessageContext<ErmisChatGenerics>('useFetchReactions');
  const [reactions, setReactions] = useState<ReactionResponse<ErmisChatGenerics>[]>([]);
  const {
    handleFetchReactions: propHandleFetchReactions,
    reactionType,
    shouldFetch,
    sort,
  } = options;
  const [isLoading, setIsLoading] = useState(shouldFetch);
  const handleFetchReactions = propHandleFetchReactions ?? contextHandleFetchReactions;

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    let cancel = false;

    (async () => {
      try {
        setIsLoading(true);
        const reactions = await handleFetchReactions(reactionType, sort);

        if (!cancel) {
          setReactions(reactions);
        }
      } catch (e) {
        if (!cancel) {
          setReactions([]);
        }
      } finally {
        if (!cancel) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancel = true;
    };
  }, [handleFetchReactions, reactionType, shouldFetch, sort]);

  return { isLoading, reactions };
}
