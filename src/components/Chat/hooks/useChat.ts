import { useCallback, useEffect, useRef, useState } from 'react';

import {
  defaultDateTimeParser,
  isLanguageSupported,
  SupportedTranslations,
  TranslationContextValue,
} from '../../../context/TranslationContext';
import { Streami18n } from '../../../i18n';
import { version } from '../../../version';

import type { AppSettingsAPIResponse, Channel, ErmisChat, Event, Mute } from 'ermis-chat-js-sdk';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export type UseChatParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  client: ErmisChat<ErmisChatGenerics>;
  defaultLanguage?: SupportedTranslations;
  i18nInstance?: Streami18n;
  initialNavOpen?: boolean;
};

export const useChat = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  client,
  defaultLanguage = 'en',
  i18nInstance,
  initialNavOpen,
}: UseChatParams<ErmisChatGenerics>) => {
  const [translators, setTranslators] = useState<TranslationContextValue>({
    t: (key: string) => key,
    tDateTimeParser: defaultDateTimeParser,
    userLanguage: 'en',
  });

  const [channel, setChannel] = useState<Channel<ErmisChatGenerics>>();
  const [mutes, setMutes] = useState<Array<Mute<ErmisChatGenerics>>>([]);
  const [navOpen, setNavOpen] = useState(initialNavOpen);
  const [latestMessageDatesByChannels, setLatestMessageDatesByChannels] = useState({});

  const clientMutes = (client.user?.mutes as Array<Mute<ErmisChatGenerics>>) || [];

  const closeMobileNav = () => setNavOpen(false);
  const openMobileNav = () => setTimeout(() => setNavOpen(true), 100);

  const appSettings = useRef<Promise<AppSettingsAPIResponse<ErmisChatGenerics>> | null>(null);

  const getAppSettings = () => {
    if (appSettings.current) {
      return appSettings.current;
    }
    appSettings.current = client.getAppSettings();
    return appSettings.current;
  };

  useEffect(() => {
    if (client) {
      const userAgent = client.getUserAgent();
      if (!userAgent.includes('ermis-chat-react-sdk')) {
        client.setUserAgent(`ermis-chat-react-sdk-${version}-${userAgent}`);
      }
    }
  }, [client]);

  useEffect(() => {
    setMutes(clientMutes);

    const handleEvent = (event: Event<ErmisChatGenerics>) => {
      setMutes(event.me?.mutes || []);
    };

    client.on('notification.mutes_updated', handleEvent);
    return () => client.off('notification.mutes_updated', handleEvent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientMutes?.length]);

  useEffect(() => {
    let userLanguage = client.user?.language;

    if (!userLanguage) {
      const browserLanguage = window.navigator.language.slice(0, 2); // just get language code, not country-specific version
      userLanguage = isLanguageSupported(browserLanguage) ? browserLanguage : defaultLanguage;
    }

    const streami18n = i18nInstance || new Streami18n({ language: userLanguage });

    streami18n.registerSetLanguageCallback((t) =>
      setTranslators((prevTranslator) => ({ ...prevTranslator, t })),
    );

    streami18n.getTranslators().then((translator) => {
      setTranslators({
        ...translator,
        userLanguage: userLanguage || defaultLanguage,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18nInstance]);

  const setActiveChannel = useCallback(
    async (
      activeChannel?: Channel<ErmisChatGenerics>,
      watchers: { limit?: number; offset?: number } = {},
      event?: React.BaseSyntheticEvent,
    ) => {
      if (event && event.preventDefault) event.preventDefault();

      if (activeChannel && Object.keys(watchers).length) {
        await activeChannel.query({ watch: true, watchers });
      }

      setChannel(activeChannel);
      closeMobileNav();
    },
    [],
  );

  useEffect(() => {
    setLatestMessageDatesByChannels({});
  }, [client.user?.id]);

  return {
    channel,
    closeMobileNav,
    getAppSettings,
    latestMessageDatesByChannels,
    mutes,
    navOpen,
    openMobileNav,
    setActiveChannel,
    translators,
  };
};
