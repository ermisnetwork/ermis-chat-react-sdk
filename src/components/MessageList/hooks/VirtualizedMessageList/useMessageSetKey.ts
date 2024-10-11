import { useEffect, useRef, useState } from 'react';
import { StreamMessage } from '../../../../context';
import { DefaultErmisChatGenerics } from '../../../../types/types';

type UseMessageSetKeyParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  messages?: StreamMessage<ErmisChatGenerics>[];
};

export const useMessageSetKey = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  messages,
}: UseMessageSetKeyParams<ErmisChatGenerics>) => {
  /**
   * Logic to update the key of the virtuoso component when the list jumps to a new location.
   */
  const [messageSetKey, setMessageSetKey] = useState(+new Date());
  const firstMessageId = useRef<string | undefined>();

  useEffect(() => {
    const continuousSet = messages?.find((message) => message.id === firstMessageId.current);
    if (!continuousSet) {
      setMessageSetKey(+new Date());
    }
    firstMessageId.current = messages?.[0]?.id;
  }, [messages]);

  return {
    messageSetKey,
  };
};
