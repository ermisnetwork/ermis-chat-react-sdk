import React, { PropsWithChildren } from 'react';

import { useChat } from './hooks/useChat';
import { useCreateChatContext } from './hooks/useCreateChatContext';
import { useChannelsQueryState } from './hooks/useChannelsQueryState';

import { ChatProvider, CustomClasses } from '../../context/ChatContext';
import { TranslationProvider } from '../../context/TranslationContext';

import type { ErmisChat } from 'ermis-chat-js-sdk';

import type { SupportedTranslations } from '../../i18n/types';
import type { Streami18n } from '../../i18n/Streami18n';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type ChatProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** The ErmisChat client object */
  client: ErmisChat<ErmisChatGenerics>;
  /** Object containing custom CSS classnames to override the library's default container CSS */
  customClasses?: CustomClasses;
  /** Sets the default fallback language for UI component translation, defaults to 'en' for English */
  defaultLanguage?: SupportedTranslations;
  /** Instance of Stream i18n */
  i18nInstance?: Streami18n;
  /** Initial status of mobile navigation */
  initialNavOpen?: boolean;
  /** Used for injecting className/s to the Channel and ChannelList components */
  theme?: string;
  /**
   * Windows 10 does not support country flag emojis out of the box. It chooses to render these emojis as characters instead. Stream
   * Chat can override this behavior by loading a custom web font that will render images instead (PNGs or SVGs depending on the platform).
   * Set this prop to true if you want to use these custom emojis for Windows users.
   *
   * Note: requires importing `ermis-chat-react-sdk/css/v2/emoji-replacement.css` style sheet
   */
  useImageFlagEmojisOnWindows?: boolean;
};

/**
 * Wrapper component for a ErmisChat application. Chat needs to be placed around any other chat components
 * as it provides the ChatContext.
 */
export const Chat = <ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics>(
  props: PropsWithChildren<ChatProps<ErmisChatGenerics>>,
) => {
  const {
    children,
    client,
    customClasses,
    defaultLanguage,
    i18nInstance,
    initialNavOpen = true,
    theme = 'messaging light',
    useImageFlagEmojisOnWindows = false,
  } = props;

  const {
    channel,
    closeMobileNav,
    getAppSettings,
    latestMessageDatesByChannels,
    mutes,
    navOpen,
    openMobileNav,
    setActiveChannel,
    translators,
  } = useChat({ client, defaultLanguage, i18nInstance, initialNavOpen });

  const channelsQueryState = useChannelsQueryState();

  const chatContextValue = useCreateChatContext({
    channel,
    channelsQueryState,
    client,
    closeMobileNav,
    customClasses,
    getAppSettings,
    latestMessageDatesByChannels,
    mutes,
    navOpen,
    openMobileNav,
    setActiveChannel,
    theme,
    useImageFlagEmojisOnWindows,
  });

  if (!translators.t) return null;

  return (
    <ChatProvider value={chatContextValue}>
      <TranslationProvider value={translators}>{children}</TranslationProvider>
    </ChatProvider>
  );
};
