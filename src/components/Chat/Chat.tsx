import React, { PropsWithChildren } from 'react';

import { useChat } from './hooks/useChat';
import { useCreateChatContext } from './hooks/useCreateChatContext';
import { useChannelsQueryState } from './hooks/useChannelsQueryState';
import { CustomStyles, darkModeTheme, useCustomStyles } from './hooks/useCustomStyles';

import { ChatProvider, CustomClasses, ThemeVersion } from '../../context/ChatContext';
import { SupportedTranslations, TranslationProvider } from '../../context/TranslationContext';

import type { ErmisChat } from 'ermis-chat-js-sdk';

import type { Streami18n } from '../../i18n/Streami18n';

import type { DefaultErmisChatGenerics } from '../../types/types';

/**
 * @deprecated will be removed with the complete transition to the theming V2 (next major release - `v11.0.0`)
 */
export type Theme<T extends string = string> =
  | 'commerce dark'
  | 'commerce light'
  | 'livestream dark'
  | 'livestream light'
  | 'messaging dark'
  | 'messaging light'
  | 'team dark'
  | 'team light'
  | T;

export type ChatProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** The ErmisChat client object */
  client: ErmisChat<ErmisChatGenerics>;
  /** Object containing custom CSS classnames to override the library's default container CSS */
  customClasses?: CustomClasses;
  /**
   * @desc object containing custom styles to override the default CSS variables
   * @deprecated will be removed with the complete transition to the theming v2 (next major release - `v11.0.0`)
   */
  customStyles?: CustomStyles;
  /**
   * @desc if true, toggles the CSS variables to the default dark mode color palette
   * @deprecated will be removed with the complete transition to the theming v2 (next major release - `v11.0.0`)
   */
  darkMode?: boolean;
  /** Sets the default fallback language for UI component translation, defaults to 'en' for English */
  defaultLanguage?: SupportedTranslations;
  /** Instance of Stream i18n */
  i18nInstance?: Streami18n;
  /** Initial status of mobile navigation */
  initialNavOpen?: boolean;
  /** Used for injecting className/s to the Channel and ChannelList components */
  theme?: string;

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
    customStyles,
    darkMode = false,
    defaultLanguage,
    i18nInstance,
    initialNavOpen = true,
    theme = 'messaging light',
    useImageFlagEmojisOnWindows = false,
  } = props;

  const {
    channel,
    closeMobileNav,
    latestMessageDatesByChannels,
    mutes,
    navOpen,
    openMobileNav,
    setActiveChannel,
    translators,
  } = useChat({ client, defaultLanguage, i18nInstance, initialNavOpen });

  const channelsQueryState = useChannelsQueryState();
  const themeVersion: ThemeVersion =
    typeof window !== 'undefined'
      ? ((window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--str-chat__theme-version')
          .replace(' ', '') || '1') as ThemeVersion)
      : '1';

  useCustomStyles(darkMode ? darkModeTheme : customStyles);

  const chatContextValue = useCreateChatContext({
    channel,
    channelsQueryState,
    client,
    closeMobileNav,
    customClasses,
    latestMessageDatesByChannels,
    mutes,
    navOpen,
    openMobileNav,
    setActiveChannel,
    theme,
    themeVersion,
    useImageFlagEmojisOnWindows,
  });

  if (!translators.t) return null;

  return (
    <ChatProvider value={chatContextValue}>
      <TranslationProvider value={translators}>{children}</TranslationProvider>
    </ChatProvider>
  );
};
