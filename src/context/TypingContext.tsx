import React, { PropsWithChildren, useContext } from 'react';

import type { ChannelState as StreamChannelState } from 'stream-chat';

import type { DefaultErmisChatGenerics, UnknownType } from '../types/types';

export type TypingContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  typing?: StreamChannelState<ErmisChatGenerics>['typing'];
};

export const TypingContext = React.createContext<TypingContextValue | undefined>(undefined);

export const TypingProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  children,
  value,
}: PropsWithChildren<{
  value: TypingContextValue<ErmisChatGenerics>;
}>) => (
  <TypingContext.Provider value={(value as unknown) as TypingContextValue}>
    {children}
  </TypingContext.Provider>
);

export const useTypingContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  componentName?: string,
) => {
  const contextValue = useContext(TypingContext);

  if (!contextValue) {
    console.warn(
      `The useTypingContext hook was called outside of the TypingContext provider. Make sure this hook is called within a child of the Channel component. The errored call is located in the ${componentName} component.`,
    );

    return {} as TypingContextValue<ErmisChatGenerics>;
  }

  return contextValue as TypingContextValue<ErmisChatGenerics>;
};

/**
 * Typescript currently does not support partial inference, so if TypingContext
 * typing is desired while using the HOC withTypingContext, the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withTypingContext = <
  P extends UnknownType,
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  Component: React.ComponentType<P>,
) => {
  const WithTypingContextComponent = (
    props: Omit<P, keyof TypingContextValue<ErmisChatGenerics>>,
  ) => {
    const typingContext = useTypingContext<ErmisChatGenerics>();

    return <Component {...(props as P)} {...typingContext} />;
  };

  WithTypingContextComponent.displayName = (
    Component.displayName ||
    Component.name ||
    'Component'
  ).replace('Base', '');

  return WithTypingContextComponent;
};
