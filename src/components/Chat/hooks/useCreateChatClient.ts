import { useEffect, useState } from 'react';

import {
  DefaultGenerics,
  ErmisChat,
  ErmisChatOptions,
  ExtendableGenerics,
  OwnUserResponse,
  TokenOrProvider,
  UserResponse,
} from 'ermis-chat-js-sdk';

/**
 * React hook to create, connect and return `ErmisChat` client.
 */
export const useCreateChatClient = <SCG extends ExtendableGenerics = DefaultGenerics>({
  apiKey,
  options,
  projectId,
  tokenOrProvider,
  userData,
}: {
  apiKey: string;
  options: ErmisChatOptions;
  projectId: string;
  tokenOrProvider: TokenOrProvider;
  userData: OwnUserResponse<SCG> | UserResponse<SCG>;
}) => {
  const [chatClient, setChatClient] = useState<ErmisChat<SCG> | null>(null);
  const [cachedUserData, setCachedUserData] = useState(userData);

  if (userData.id !== cachedUserData.id) {
    setCachedUserData(userData);
  }

  useEffect(() => {
    const client = new ErmisChat<SCG>(apiKey, projectId, options);
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
  }, [apiKey, projectId, cachedUserData, tokenOrProvider]);

  return chatClient;
};
