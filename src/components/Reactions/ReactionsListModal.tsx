import React from 'react';
import clsx from 'clsx';

import type { ReactionSummary, ReactionType } from './types';

import { Modal, ModalProps } from '../Modal';
import { Avatar } from '../Avatar';
import { DefaultErmisChatGenerics } from '../../types/types';

type ReactionsListModalProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = ModalProps & {
  reactions: ReactionSummary[];
  selectedReactionType: ReactionType<ErmisChatGenerics>;
  onSelectedReactionTypeChange?: (reactionType: ReactionType<ErmisChatGenerics>) => void;
};

export function ReactionsListModal<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  onSelectedReactionTypeChange,
  reactions,
  selectedReactionType,
  ...modalProps
}: ReactionsListModalProps<ErmisChatGenerics>) {
  const selectedReaction = reactions.find(
    ({ reactionType }) => reactionType === selectedReactionType,
  );
  const SelectedEmojiComponent = selectedReaction?.EmojiComponent ?? null;

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
          {selectedReaction?.latestReactedUsers.map((user) => (
            <div className='str-chat__message-reactions-details-reacting-user' key={user?.id}>
              <Avatar
                data-testid='avatar'
                image={user?.avatar as string | undefined}
                name={user?.name || user?.id}
              />
              <span className='str-chat__user-item--name' data-testid='reaction-user-username'>
                {user?.name || user?.id}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
