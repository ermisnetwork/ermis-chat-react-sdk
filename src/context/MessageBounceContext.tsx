import React, { createContext, ReactEventHandler, useCallback, useContext, useMemo } from 'react';
import { useMessageContext } from './MessageContext';
import { DefaultErmisChatGenerics, PropsWithChildrenOnly } from '../types/types';
import { StreamMessage } from './ChannelStateContext';
import { useChannelActionContext } from './ChannelActionContext';
import { isMessageBounced } from '../components';

export interface MessageBounceContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> {
  handleDelete: ReactEventHandler;
  handleEdit: ReactEventHandler;
  handleRetry: ReactEventHandler;
  message: StreamMessage<ErmisChatGenerics>;
}

const MessageBounceContext = createContext<MessageBounceContextValue | undefined>(undefined);

export function useMessageBounceContext<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(componentName?: string) {
  const contextValue = useContext(MessageBounceContext);

  if (!contextValue) {
    console.warn(
      `The useMessageBounceContext hook was called outside of the MessageBounceContext provider. The errored call is located in the ${componentName} component.`,
    );

    return {} as MessageBounceContextValue<ErmisChatGenerics>;
  }

  return contextValue;
}

export function MessageBounceProvider<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({ children }: PropsWithChildrenOnly) {
  const {
    handleRetry: doHandleRetry,
    message,
    setEditingState,
  } = useMessageContext<ErmisChatGenerics>('MessageBounceProvider');

  if (!isMessageBounced(message)) {
    console.warn(
      `The MessageBounceProvider was rendered for a message that is not bounced. Have you missed the "isMessageBounced" check?`,
    );
  }

  const { removeMessage } = useChannelActionContext('MessageBounceProvider');

  const handleDelete: ReactEventHandler = useCallback(() => {
    removeMessage(message);
  }, [message, removeMessage]);

  const handleEdit: ReactEventHandler = useCallback(
    (e) => {
      setEditingState(e);
    },
    [setEditingState],
  );

  const handleRetry = useCallback(() => {
    doHandleRetry(message);
  }, [doHandleRetry, message]);

  const value = useMemo(
    () => ({
      handleDelete,
      handleEdit,
      handleRetry,
      message,
    }),
    [handleDelete, handleEdit, handleRetry, message],
  );

  return <MessageBounceContext.Provider value={value}>{children}</MessageBounceContext.Provider>;
}
