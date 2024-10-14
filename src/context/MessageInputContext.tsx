import React, { createContext, PropsWithChildren, useContext } from 'react';

import type { TriggerSettings } from '../components/MessageInput/DefaultTriggerProvider';
import type { CooldownTimerState, MessageInputProps } from '../components/MessageInput';
import type {
  CommandsListState,
  MentionsListState,
  MessageInputHookProps,
  MessageInputState,
} from '../components/MessageInput/hooks/useMessageInputState';

import type { CustomTrigger, DefaultErmisChatGenerics } from '../types/types';

export type MessageInputContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
> = MessageInputState<ErmisChatGenerics> &
  MessageInputHookProps<ErmisChatGenerics> &
  Omit<MessageInputProps<ErmisChatGenerics, V>, 'Input'> &
  CooldownTimerState & {
    autocompleteTriggers?: TriggerSettings<ErmisChatGenerics, V>;
  } & CommandsListState &
  MentionsListState;

export const MessageInputContext = createContext<
  (MessageInputState & MessageInputHookProps) | undefined
>(undefined);

export const MessageInputContextProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>({
  children,
  value,
}: PropsWithChildren<{
  value: MessageInputContextValue<ErmisChatGenerics, V>;
}>) => (
  <MessageInputContext.Provider value={value as MessageInputContextValue}>
    {children}
  </MessageInputContext.Provider>
);

export const useMessageInputContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  componentName?: string,
) => {
  const contextValue = useContext(MessageInputContext);

  if (!contextValue) {
    console.warn(
      `The useMessageInputContext hook was called outside of the MessageInputContext provider. Make sure this hook is called within the MessageInput's UI component. The errored call is located in the ${componentName} component.`,
    );

    return {} as MessageInputContextValue<ErmisChatGenerics, V>;
  }

  return contextValue as MessageInputContextValue<ErmisChatGenerics, V>;
};
