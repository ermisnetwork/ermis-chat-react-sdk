import { useMemo } from 'react';

import type { TypingContextValue } from '../../../context/TypingContext';
import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useCreateTypingContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  value: TypingContextValue<ErmisChatGenerics>,
) => {
  const { typing } = value;

  const typingValue = Object.keys(typing || {}).join();

  const typingContext: TypingContextValue<ErmisChatGenerics> = useMemo(
    () => ({
      typing,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [typingValue],
  );

  return typingContext;
};
