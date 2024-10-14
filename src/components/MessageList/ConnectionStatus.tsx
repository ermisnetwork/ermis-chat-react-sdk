import React, { useEffect, useState } from 'react';

import type { Event } from 'stream-chat';

import { CustomNotification } from './CustomNotification';
import { useChatContext, useTranslationContext } from '../../context';
import type { DefaultErmisChatGenerics } from '../../types/types';

const UnMemoizedConnectionStatus = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>() => {
  const { client } = useChatContext<ErmisChatGenerics>('ConnectionStatus');
  const { t } = useTranslationContext('ConnectionStatus');

  const [online, setOnline] = useState(true);

  useEffect(() => {
    const connectionChanged = ({ online: onlineStatus = false }: Event<ErmisChatGenerics>) => {
      if (online !== onlineStatus) {
        setOnline(onlineStatus);
      }
    };

    client.on('connection.changed', connectionChanged);
    return () => client.off('connection.changed', connectionChanged);
  }, [client, online]);

  return (
    <CustomNotification
      active={!online}
      className='str-chat__connection-status-notification'
      type='error'
    >
      {t<string>('Connection failure, reconnecting now...')}
    </CustomNotification>
  );
};

export const ConnectionStatus = React.memo(UnMemoizedConnectionStatus);
