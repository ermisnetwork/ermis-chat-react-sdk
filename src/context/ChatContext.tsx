import React, { PropsWithChildren, useContext } from 'react';

import type { AppSettingsAPIResponse, Channel, Mute } from 'ermis-chat-js-sdk';

import { getDisplayName } from './utils/getDisplayName';
import type { ChatProps } from '../components/Chat/Chat';
import type { DefaultErmisChatGenerics, UnknownType } from '../types/types';
import type { ChannelsQueryState } from '../components/Chat/hooks/useChannelsQueryState';

type CSSClasses =
  | 'chat'
  | 'chatContainer'
  | 'channel'
  | 'channelList'
  | 'message'
  | 'messageList'
  | 'thread'
  | 'threadList'
  | 'virtualMessage'
  | 'virtualizedMessageList';

export type CustomClasses = Partial<Record<CSSClasses, string>>;

type ChannelCID = string; // e.g.: "messaging:general"

export type ThemeVersion = '1' | '2';

export type ChatContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /**
   * Indicates, whether a channels query has been triggered within ChannelList by its channels pagination controller.
   */
  channelsQueryState: ChannelsQueryState;
  closeMobileNav: () => void;
  getAppSettings: () => Promise<AppSettingsAPIResponse<ErmisChatGenerics>> | null;
  latestMessageDatesByChannels: Record<ChannelCID, Date>;
  mutes: Array<Mute<ErmisChatGenerics>>;
  openMobileNav: () => void;
  /**
   * Sets active channel to be rendered within Channel component.
   * @param newChannel
   * @param watchers
   * @param event
   */
  setActiveChannel: (
    newChannel?: Channel<ErmisChatGenerics>,
    watchers?: { limit?: number; offset?: number },
    event?: React.BaseSyntheticEvent,
  ) => void;
  /**
   * Allows to opt out of the use of legacy CSS (version "1") and opt into the use of the latest SDK's CSS (version "2").
   */
  themeVersion: ThemeVersion;
  useImageFlagEmojisOnWindows: boolean;
  /**
   * Active channel used to render the contents of the Channel component.
   */
  channel?: Channel<ErmisChatGenerics>;
  /**
   * Object through which custom classes can be set for main container components of the SDK.
   */
  customClasses?: CustomClasses;
  navOpen?: boolean;
} & Required<Pick<ChatProps<ErmisChatGenerics>, 'theme' | 'client'>>;

export const ChatContext = React.createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  children,
  value,
}: PropsWithChildren<{
  value: ChatContextValue<ErmisChatGenerics>;
}>) => (
  <ChatContext.Provider value={(value as unknown) as ChatContextValue}>
    {children}
  </ChatContext.Provider>
);

export const useChatContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  componentName?: string,
) => {
  const contextValue = useContext(ChatContext);

  if (!contextValue) {
    console.warn(
      `The useChatContext hook was called outside of the ChatContext provider. Make sure this hook is called within a child of the Chat component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ChatContextValue<ErmisChatGenerics>;
  }

  return (contextValue as unknown) as ChatContextValue<ErmisChatGenerics>;
};

/**
 * Typescript currently does not support partial inference so if ChatContext
 * typing is desired while using the HOC withChatContext the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withChatContext = <
  P extends UnknownType,
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  Component: React.ComponentType<P>,
) => {
  const WithChatContextComponent = (props: Omit<P, keyof ChatContextValue<ErmisChatGenerics>>) => {
    const chatContext = useChatContext<ErmisChatGenerics>();

    return <Component {...(props as P)} {...chatContext} />;
  };
  WithChatContextComponent.displayName = `WithChatContext${getDisplayName(Component)}`;
  return WithChatContextComponent;
};
