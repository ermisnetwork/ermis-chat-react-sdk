import { useEffect } from 'react';

import { useChatContext } from '../../../context/ChatContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

export const useConnectionRecoveredListener = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  forceUpdate?: () => void,
) => {
  const { client } = useChatContext<ErmisChatGenerics>('useConnectionRecoveredListener');

  useEffect(() => {
    const handleEvent = () => {
      if (forceUpdate) {
        forceUpdate();
      }
    };

    client.on('connection.recovered', handleEvent);

    return () => {
      client.off('connection.recovered', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
