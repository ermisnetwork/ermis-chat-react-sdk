import type { ComponentType } from 'react';
import type { DefaultGenerics, ExtendableGenerics, ReactionResponse } from 'ermis-chat-js-sdk';
import { DefaultErmisChatGenerics } from '../../types';

export interface ReactionSummary {
  EmojiComponent: ComponentType | null;
  firstReactionAt: Date | null;
  isOwnReaction: boolean;
  lastReactionAt: Date | null;
  latestReactedUserNames: string[];
  reactionCount: number;
  reactionType: string;
  unlistedReactedUserCount: number;
}

export type ReactionsComparator = (a: ReactionSummary, b: ReactionSummary) => number;

export type ReactionDetailsComparator<
  ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics
> = (a: ReactionResponse<ErmisChatGenerics>, b: ReactionResponse<ErmisChatGenerics>) => number;

export type ReactionType<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = ReactionResponse<ErmisChatGenerics>['type'];
