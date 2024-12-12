import React, { PropsWithChildren, useState } from 'react';
import clsx from 'clsx';

import type { ReactionResponse } from 'ermis-chat-js-sdk';

import { useChatContext } from '../../context/ChatContext';
import { MessageContextValue, useMessageContext } from '../../context/MessageContext';
import { useProcessReactions } from './hooks/useProcessReactions';
import { useEnterLeaveHandlers } from '../Tooltip/hooks';
import { PopperTooltip } from '../Tooltip';

import type { DefaultErmisChatGenerics } from '../../types/types';
import type { ReactionOptions } from './reactionOptions';

type WithTooltipProps = {
  onMouseEnter: React.MouseEventHandler;
  onMouseLeave: React.MouseEventHandler;
  title: React.ReactNode;
};

const WithTooltip = ({
  children,
  onMouseEnter,
  onMouseLeave,
  title,
}: PropsWithChildren<WithTooltipProps>) => {
  const [referenceElement, setReferenceElement] = useState<HTMLSpanElement | null>(null);
  const { handleEnter, handleLeave, tooltipVisible } = useEnterLeaveHandlers({
    onMouseEnter,
    onMouseLeave,
  });

  const { themeVersion } = useChatContext('WithTooltip');

  return (
    <>
      {themeVersion === '2' && (
        <PopperTooltip referenceElement={referenceElement} visible={tooltipVisible}>
          {title}
        </PopperTooltip>
      )}
      <span onMouseEnter={handleEnter} onMouseLeave={handleLeave} ref={setReferenceElement}>
        {children}
      </span>
    </>
  );
};

export type SimpleReactionsListProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Partial<Pick<MessageContextValue, 'handleReaction'>> & {
  reaction_counts?: Record<string, number>;
  /** A list of the currently supported reactions on a message */
  reactionOptions?: ReactionOptions;
  /** An array of the reaction objects to display in the list */
  reactions?: ReactionResponse<ErmisChatGenerics>[];
};

const UnMemoizedSimpleReactionsList = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: SimpleReactionsListProps<ErmisChatGenerics>,
) => {
  const { handleReaction: propHandleReaction, ...rest } = props;

  const { handleReaction: contextHandleReaction } = useMessageContext<ErmisChatGenerics>(
    'SimpleReactionsList',
  );

  const { existingReactions, hasReactions, totalReactionCount } = useProcessReactions(rest);

  const [tooltipReactionType, setTooltipReactionType] = useState<string | undefined>(undefined);
  const { themeVersion } = useChatContext('SimpleReactionsList');

  const handleReaction = propHandleReaction || contextHandleReaction;

  if (!hasReactions) return null;

  return (
    <div className='str-chat__message-reactions-container'>
      <ul
        className='str-chat__simple-reactions-list str-chat__message-reactions'
        data-testid='simple-reaction-list'
        onMouseLeave={() => setTooltipReactionType(undefined)}
      >
        {existingReactions.map(
          ({ EmojiComponent, isOwnReaction, latestReactedUsers, reactionType }) => {
            const tooltipVisible = tooltipReactionType === reactionType;
            const tooltipContent = latestReactedUsers.map((user) => user.name).join(', ');

            return (
              EmojiComponent && (
                <li
                  className={clsx('str-chat__simple-reactions-list-item', {
                    'str-chat__message-reaction-own': isOwnReaction,
                  })}
                  key={reactionType}
                  onClick={(event) => handleReaction(reactionType, event)}
                  onKeyUp={(event) => handleReaction(reactionType, event)}
                >
                  <WithTooltip
                    onMouseEnter={() => setTooltipReactionType(reactionType)}
                    onMouseLeave={() => setTooltipReactionType(undefined)}
                    title={tooltipContent}
                  >
                    <EmojiComponent />
                    &nbsp;
                    {tooltipVisible && themeVersion === '1' && (
                      <div className='str-chat__simple-reactions-list-tooltip'>
                        <div className='arrow' />
                        {tooltipContent}
                      </div>
                    )}
                  </WithTooltip>
                </li>
              )
            );
          },
        )}
        {
          <li className='str-chat__simple-reactions-list-item--last-number'>
            {totalReactionCount}
          </li>
        }
      </ul>
    </div>
  );
};

export const SimpleReactionsList = React.memo(
  UnMemoizedSimpleReactionsList,
) as typeof UnMemoizedSimpleReactionsList;
