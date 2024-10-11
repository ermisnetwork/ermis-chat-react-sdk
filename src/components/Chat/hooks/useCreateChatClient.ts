import { useEffect, useState } from 'react';

import { ErmisChat } from 'ermis-chat-js-sdk';

import type {
  DefaultGenerics,
  ExtendableGenerics,
  OwnUserResponse,
  ErmisChatOptions,
  TokenOrProvider,
  UserResponse,
} from 'ermis-chat-js-sdk';

/**
 * React hook to create, connect and return `ErmisChat` client.
 */
export const useCreateChatClient = <SCG extends ExtendableGenerics = DefaultGenerics>({
  apiKey,
  options,
  tokenOrProvider,
  userData,
}: {
  apiKey: string;
  tokenOrProvider: TokenOrProvider;
  userData: OwnUserResponse<SCG> | UserResponse<SCG>;
  options?: ErmisChatOptions;
}) => {
  const [chatClient, setChatClient] = useState<ErmisChat<SCG> | null>(null);
  const [cachedUserData, setCachedUserData] = useState(userData);

  if (userData.id !== cachedUserData.id) {
    setCachedUserData(userData);
  }

  const [cachedOptions] = useState(options);

  useEffect(() => {
    const client = new ErmisChat<SCG>(apiKey, undefined, cachedOptions);
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
  }, [apiKey, cachedUserData, cachedOptions, tokenOrProvider]);

  return chatClient;
};
