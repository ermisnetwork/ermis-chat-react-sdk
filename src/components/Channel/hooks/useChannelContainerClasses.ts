import type { ChatContextValue } from '../../../context/ChatContext';
import { useChatContext } from '../../../context/ChatContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useChannelContainerClasses = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  customClasses,
}: Pick<ChatContextValue, 'customClasses'>) => {
  const { useImageFlagEmojisOnWindows } = useChatContext<ErmisChatGenerics>('Channel');

  return {
    channelClass: customClasses?.channel ?? 'str-chat__channel',
    chatClass: customClasses?.chat ?? 'str-chat',
    chatContainerClass: customClasses?.chatContainer ?? 'str-chat__container',
    windowsEmojiClass:
      useImageFlagEmojisOnWindows && navigator.userAgent.match(/Win/)
        ? 'str-chat--windows-flags'
        : '',
  };
};
