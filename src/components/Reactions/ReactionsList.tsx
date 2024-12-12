import React, { useState } from 'react';
import clsx from 'clsx';

import type { ReactionResponse } from 'ermis-chat-js-sdk';

import { useProcessReactions } from './hooks/useProcessReactions';

import type { ReactEventHandler } from '../Message/types';
import type { DefaultErmisChatGenerics } from '../../types/types';
import type { ReactionOptions } from './reactionOptions';
import type { ReactionsComparator, ReactionType } from './types';
import { ReactionsListModal } from './ReactionsListModal';
import { useTranslationContext } from '../../context';
import { MAX_MESSAGE_REACTIONS_TO_FETCH } from '../Message/hooks';

export type ReactionsListProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** Custom on click handler for an individual reaction, defaults to `onReactionListClick` from the `MessageContext` */
  onClick?: ReactEventHandler;
  reaction_counts?: Record<string, number>;
  /** A list of the currently supported reactions on a message */
  reactionOptions?: ReactionOptions;
  /** An array of the reaction objects to display in the list */
  reactions?: ReactionResponse<ErmisChatGenerics>[];
  /** Display the reactions in the list in reverse order, defaults to false */
  reverse?: boolean;
  /** Comparator function to sort reactions, defaults to chronological order */
  sortReactions?: ReactionsComparator;
};

const UnMemoizedReactionsList = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: ReactionsListProps<ErmisChatGenerics>,
) => {
  const { reverse = false, ...rest } = props;
  const { existingReactions, hasReactions, totalReactionCount } = useProcessReactions(rest);
  const [
    selectedReactionType,
    setSelectedReactionType,
  ] = useState<ReactionType<ErmisChatGenerics> | null>(null);
  const { t } = useTranslationContext('ReactionsList');

  const handleReactionButtonClick = (reactionType: string) => {
    if (totalReactionCount > MAX_MESSAGE_REACTIONS_TO_FETCH) {
      return;
    }

    setSelectedReactionType(reactionType as ReactionType<ErmisChatGenerics>);
  };

  if (!hasReactions) return null;

  return (
    <>
      <div
        aria-label={t('aria/Reaction list')}
        className={clsx('str-chat__reaction-list str-chat__message-reactions-container', {
          'str-chat__reaction-list--reverse': reverse,
        })}
        data-testid='reaction-list'
        role='figure'
      >
        <ul className='str-chat__message-reactions'>
          {existingReactions.map(
            ({ EmojiComponent, isOwnReaction, reactionCount, reactionType }) =>
              EmojiComponent && (
                <li
                  className={clsx('str-chat__message-reaction', {
                    'str-chat__message-reaction-own': isOwnReaction,
                  })}
                  key={reactionType}
                >
                  <button
                    aria-label={`Reactions: ${reactionType}`}
                    data-testid={`reactions-list-button-${reactionType}`}
                    onClick={() => handleReactionButtonClick(reactionType)}
                    type='button'
                  >
                    <span className='str-chat__message-reaction-emoji'>
                      <EmojiComponent />
                    </span>
                    &nbsp;
                    <span
                      className='str-chat__message-reaction-count'
                      data-testclass='reaction-list-reaction-count'
                    >
                      {reactionCount}
                    </span>
                  </button>
                </li>
              ),
          )}
          <li>
            <span className='str-chat__reaction-list--counter'>{totalReactionCount}</span>
          </li>
        </ul>
      </div>
      {selectedReactionType !== null && (
        <ReactionsListModal
          onClose={() => setSelectedReactionType(null)}
          onSelectedReactionTypeChange={setSelectedReactionType}
          open={selectedReactionType !== null}
          reactions={existingReactions}
          selectedReactionType={selectedReactionType}
        />
      )}
    </>
  );
};

/**
 * Component that displays a list of reactions on a message.
 */
export const ReactionsList = React.memo(UnMemoizedReactionsList) as typeof UnMemoizedReactionsList;
