import { useMemo } from 'react';

import type { ChatContextValue } from '../../../context/ChatContext';
import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useCreateChatContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  value: ChatContextValue<ErmisChatGenerics>,
) => {
  const {
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
  } = value;

  const channelCid = channel?.cid;
  const channelsQueryError = channelsQueryState.error;
  const channelsQueryInProgress = channelsQueryState.queryInProgress;
  const clientValues = `${client.clientID}${Object.keys(client.activeChannels).length}${
    Object.keys(client.listeners).length
  }
  ${client.user?.id}`;
  const mutedUsersLength = mutes.length;

  const chatContext: ChatContextValue<ErmisChatGenerics> = useMemo(
    () => ({
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
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      channelCid,
      channelsQueryError,
      channelsQueryInProgress,
      clientValues,
      mutedUsersLength,
      navOpen,
    ],
  );

  return chatContext;
};
