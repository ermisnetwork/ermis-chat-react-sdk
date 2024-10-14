import React, { useMemo } from 'react';
import clsx from 'clsx';

import type { ReactionDetailsComparator, ReactionSummary, ReactionType } from './types';

import { Modal, ModalProps } from '../Modal';
import { useFetchReactions } from './hooks/useFetchReactions';
import { LoadingIndicator } from '../Loading';
import { Avatar } from '../Avatar';
import { MessageContextValue, useMessageContext } from '../../context';
import { DefaultErmisChatGenerics } from '../../types/types';
import { ReactionSort } from 'stream-chat';

type ReactionsListModalProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = ModalProps &
  Partial<
    Pick<MessageContextValue<ErmisChatGenerics>, 'handleFetchReactions' | 'reactionDetailsSort'>
  > & {
    reactions: ReactionSummary[];
    selectedReactionType: ReactionType<ErmisChatGenerics>;
    onSelectedReactionTypeChange?: (reactionType: ReactionType<ErmisChatGenerics>) => void;
    sort?: ReactionSort<ErmisChatGenerics>;
    /** @deprecated use `sort` instead */
    sortReactionDetails?: ReactionDetailsComparator<ErmisChatGenerics>;
  };

const defaultReactionDetailsSort = { created_at: -1 } as const;

export function ReactionsListModal<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  handleFetchReactions,
  onSelectedReactionTypeChange,
  reactionDetailsSort: propReactionDetailsSort,
  reactions,
  selectedReactionType,
  sortReactionDetails: propSortReactionDetails,
  ...modalProps
}: ReactionsListModalProps<ErmisChatGenerics>) {
  const selectedReaction = reactions.find(
    ({ reactionType }) => reactionType === selectedReactionType,
  );
  const SelectedEmojiComponent = selectedReaction?.EmojiComponent ?? null;
  const {
    reactionDetailsSort: contextReactionDetailsSort,
    sortReactionDetails: contextSortReactionDetails,
  } = useMessageContext<ErmisChatGenerics>('ReactionsListModal');
  const legacySortReactionDetails = propSortReactionDetails ?? contextSortReactionDetails;
  const reactionDetailsSort =
    propReactionDetailsSort ?? contextReactionDetailsSort ?? defaultReactionDetailsSort;
  const {
    isLoading: areReactionsLoading,
    reactions: reactionDetails,
  } = useFetchReactions<ErmisChatGenerics>({
    handleFetchReactions,
    reactionType: selectedReactionType,
    shouldFetch: modalProps.open,
    sort: reactionDetailsSort,
  });

  const reactionDetailsWithLegacyFallback = useMemo(
    () =>
      legacySortReactionDetails
        ? [...reactionDetails].sort(legacySortReactionDetails)
        : reactionDetails,
    [legacySortReactionDetails, reactionDetails],
  );

  return (
    <Modal
      {...modalProps}
      className={clsx('str-chat__message-reactions-details-modal', modalProps.className)}
    >
      <div className='str-chat__message-reactions-details' data-testid='reactions-list-modal'>
        <div className='str-chat__message-reactions-details-reaction-types'>
          {reactions.map(
            ({ EmojiComponent, reactionCount, reactionType }) =>
              EmojiComponent && (
                <div
                  className={clsx('str-chat__message-reactions-details-reaction-type', {
                    'str-chat__message-reactions-details-reaction-type--selected':
                      selectedReactionType === reactionType,
                  })}
                  data-testid={`reaction-details-selector-${reactionType}`}
                  key={reactionType}
                  onClick={() =>
                    onSelectedReactionTypeChange?.(reactionType as ReactionType<ErmisChatGenerics>)
                  }
                >
                  <span className='emoji str-chat__message-reaction-emoji str-chat__message-reaction-emoji--with-fallback'>
                    <EmojiComponent />
                  </span>
                  &nbsp;
                  <span className='str-chat__message-reaction-count'>{reactionCount}</span>
                </div>
              ),
          )}
        </div>
        {SelectedEmojiComponent && (
          <div className='emoji str-chat__message-reaction-emoji str-chat__message-reaction-emoji--with-fallback str-chat__message-reaction-emoji-big'>
            <SelectedEmojiComponent />
          </div>
        )}
        <div
          className='str-chat__message-reactions-details-reacting-users'
          data-testid='all-reacting-users'
        >
          {areReactionsLoading ? (
            <LoadingIndicator />
          ) : (
            reactionDetailsWithLegacyFallback.map(({ user }) => (
              <div className='str-chat__message-reactions-details-reacting-user' key={user?.id}>
                <Avatar
                  data-testid='avatar'
                  image={user?.image as string | undefined}
                  name={user?.name || user?.id}
                />
                <span className='str-chat__user-item--name' data-testid='reaction-user-username'>
                  {user?.name || user?.id}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
