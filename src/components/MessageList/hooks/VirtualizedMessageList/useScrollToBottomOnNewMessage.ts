import { useEffect, useRef, useState } from 'react';
import { StreamMessage } from '../../../../context';
import { DefaultErmisChatGenerics } from '../../../../types/types';

type UseScrollToBottomOnNewMessageParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  scrollToBottom: () => void;
  messages?: StreamMessage<ErmisChatGenerics>[];
  /** When `true`, the list will scroll to the latest message when the window regains focus */
  scrollToLatestMessageOnFocus?: boolean;
};

export const useScrollToBottomOnNewMessage = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  messages,
  scrollToBottom,
  scrollToLatestMessageOnFocus,
}: UseScrollToBottomOnNewMessageParams<ErmisChatGenerics>) => {
  const [newMessagesReceivedInBackground, setNewMessagesReceivedInBackground] = useState(false);

  const scrollToBottomIfConfigured = useRef<(e: Event) => void>();

  scrollToBottomIfConfigured.current = (event: Event) => {
    if (
      !scrollToLatestMessageOnFocus ||
      !newMessagesReceivedInBackground ||
      event.target !== window
    ) {
      return;
    }

    setTimeout(scrollToBottom, 100);
  };

  useEffect(() => {
    setNewMessagesReceivedInBackground(true);
  }, [messages]);

  useEffect(() => {
    const handleFocus = (event: Event) => {
      scrollToBottomIfConfigured.current?.(event);
    };

    const handleBlur = () => {
      setNewMessagesReceivedInBackground(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
    }

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);
};
