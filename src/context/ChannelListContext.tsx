import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
} from 'react';

import type { Channel } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../types/types';

export type ChannelListContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /**
   * State representing the array of loaded channels.
   * Channels query is executed by default only by ChannelList component in the SDK.
   */
  channels: Channel<ErmisChatGenerics>[];
  /**
   * Sets the list of Channel objects to be rendered by ChannelList component.
   */
  setChannels: Dispatch<SetStateAction<Channel<ErmisChatGenerics>[]>>;
};

export const ChannelListContext = createContext<ChannelListContextValue | undefined>(undefined);

/**
 * Context provider for components rendered within the `ChannelList`
 */
export const ChannelListContextProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  children,
  value,
}: PropsWithChildren<{
  value: ChannelListContextValue<ErmisChatGenerics>;
}>) => (
  <ChannelListContext.Provider value={(value as unknown) as ChannelListContextValue}>
    {children}
  </ChannelListContext.Provider>
);

export const useChannelListContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  componentName?: string,
) => {
  const contextValue = useContext(ChannelListContext);

  if (!contextValue) {
    console.warn(
      `The useChannelListContext hook was called outside of the ChannelListContext provider. Make sure this hook is called within the ChannelList component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ChannelListContextValue<ErmisChatGenerics>;
  }

  return (contextValue as unknown) as ChannelListContextValue<ErmisChatGenerics>;
};
