import React, { PropsWithChildren } from 'react';

import { useCommandTrigger } from './hooks/useCommandTrigger';
import { useEmojiTrigger } from './hooks/useEmojiTrigger';
import { useUserTrigger } from './hooks/useUserTrigger';

import {
  MessageInputContextProvider,
  useMessageInputContext,
} from '../../context/MessageInputContext';

import type { SuggestionCommand, SuggestionUser } from '../ChatAutoComplete/ChatAutoComplete';
import type { CommandItemProps } from '../CommandItem/CommandItem';
import type { EmoticonItemProps } from '../EmoticonItem/EmoticonItem';
import type { UserItemProps } from '../UserItem/UserItem';

import type { CustomTrigger, DefaultErmisChatGenerics, UnknownType } from '../../types/types';

export type AutocompleteMinimalData = {
  id?: string;
  name?: string;
} & ({ id: string } | { name: string });

export type CommandTriggerSetting<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = TriggerSetting<CommandItemProps, SuggestionCommand<ErmisChatGenerics>>;

export type EmojiTriggerSetting = TriggerSetting<EmoticonItemProps>;

export type UserTriggerSetting<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = TriggerSetting<UserItemProps, SuggestionUser<ErmisChatGenerics>>;

export type TriggerSetting<T extends UnknownType = UnknownType, U = UnknownType> = {
  component: string | React.ComponentType<T>;
  dataProvider: (
    query: string,
    text: string,
    onReady: (data: (U & AutocompleteMinimalData)[], token: string) => void,
  ) => U[] | PromiseLike<void> | void;
  output: (
    entity: U,
  ) =>
    | {
        caretPosition: 'start' | 'end' | 'next' | number;
        text: string;
        key?: string;
      }
    | string
    | null;
  callback?: (item: U) => void;
};

export type TriggerSettings<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
> =
  | {
      [key in keyof V]: TriggerSetting<V[key]['componentProps'], V[key]['data']>;
    }
  | {
      '/': CommandTriggerSetting<ErmisChatGenerics>;
      ':': EmojiTriggerSetting;
      '@': UserTriggerSetting<ErmisChatGenerics>;
    };

export const DefaultTriggerProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  const currentValue = useMessageInputContext<ErmisChatGenerics, V>('DefaultTriggerProvider');

  const defaultAutocompleteTriggers: TriggerSettings<ErmisChatGenerics> = {
    '/': useCommandTrigger<ErmisChatGenerics>(),
    ':': useEmojiTrigger(currentValue.emojiSearchIndex),
    '@': useUserTrigger<ErmisChatGenerics>({
      disableMentions: currentValue.disableMentions,
      mentionAllAppUsers: currentValue.mentionAllAppUsers,
      mentionQueryParams: currentValue.mentionQueryParams,
      onSelectUser: currentValue.onSelectUser,
      useMentionsTransliteration: currentValue.useMentionsTransliteration,
    }),
  };

  const newValue = {
    ...currentValue,
    autocompleteTriggers: defaultAutocompleteTriggers,
  };

  return <MessageInputContextProvider value={newValue}>{children}</MessageInputContextProvider>;
};
