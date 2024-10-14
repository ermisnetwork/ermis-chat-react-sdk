import { useEffect, useState } from 'react';

import {
  DefaultGenerics,
  ExtendableGenerics,
  OwnUserResponse,
  ErmisChat,
  TokenOrProvider,
  UserResponse,
} from 'stream-chat';

/**
 * React hook to create, connect and return `ErmisChat` client.
 */
export const useCreateChatClient = <SCG extends ExtendableGenerics = DefaultGenerics>({
  apiKey,
  tokenOrProvider,
  userData,
}: {
  apiKey: string;
  tokenOrProvider: TokenOrProvider;
  userData: OwnUserResponse<SCG> | UserResponse<SCG>;
}) => {
  const [chatClient, setChatClient] = useState<ErmisChat<SCG> | null>(null);
  const [cachedUserData, setCachedUserData] = useState(userData);

  if (userData.id !== cachedUserData.id) {
    setCachedUserData(userData);
  }

  useEffect(() => {
    const client = new ErmisChat<SCG>(apiKey);
    let didUserConnectInterrupt = false;

    const connectionPromise = client.connectUser(cachedUserData, tokenOrProvider).then(() => {
      if (!didUserConnectInterrupt) setChatClient(client);
    });

    return () => {
      didUserConnectInterrupt = true;
      setChatClient(null);
      connectionPromise
        .then(() => client.disconnectUser())
        .then(() => {
          console.log(`Connection for user "${cachedUserData.id}" has been closed`);
        });
    };
  }, [apiKey, cachedUserData, tokenOrProvider]);

  return chatClient;
};
