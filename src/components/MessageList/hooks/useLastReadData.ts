import { useMemo } from 'react';

import { getReadStates } from '../utils';

import type { UserResponse } from 'ermis-chat-js-sdk';

import type { StreamMessage } from '../../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../../types/types';

type UseLastReadDataParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  messages: StreamMessage<ErmisChatGenerics>[];
  returnAllReadData: boolean;
  userID: string | undefined;
  read?: Record<string, { last_read: Date; user: UserResponse<ErmisChatGenerics> }>;
};

export const useLastReadData = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: UseLastReadDataParams<ErmisChatGenerics>,
) => {
  const { messages, read, returnAllReadData, userID } = props;

  return useMemo(
    () =>
      getReadStates(
        messages.filter(({ user }) => user?.id === userID),
        read,
        returnAllReadData,
      ),
    [messages, read, returnAllReadData, userID],
  );
};
