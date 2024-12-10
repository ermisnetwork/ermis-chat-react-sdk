import React, { PropsWithChildren, useContext } from 'react';

import type {
  APIErrorResponse,
  Attachment,
  ErrorFromResponse,
  Message,
  MessageResponse,
  UpdatedMessage,
  UpdateMessageAPIResponse,
  UserResponse,
} from 'ermis-chat-js-sdk';

import type { StreamMessage } from './ChannelStateContext';

import type { ChannelStateReducerAction } from '../components/Channel/channelState';
import type { CustomMentionHandler } from '../components/Message/hooks/useMentionsHandler';

import type {
  ChannelUnreadUiState,
  DefaultErmisChatGenerics,
  SendMessageOptions,
  UnknownType,
  UpdateMessageOptions,
} from '../types/types';

export type MarkReadWrapperOptions = {
  /**
   * Signal, whether the `channelUnreadUiState` should be updated.
   * By default, the local state update is prevented when the Channel component is mounted.
   * This is in order to keep the UI indicating the original unread state, when the user opens a channel.
   */
  updateChannelUiUnreadState?: boolean;
};

export type MessageAttachments<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Array<Attachment<ErmisChatGenerics>>;

export type MessageToSend<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  attachments?: MessageAttachments<ErmisChatGenerics>;
  error?: ErrorFromResponse<APIErrorResponse>;
  errorStatusCode?: number;
  id?: string;
  mentioned_users?: UserResponse<ErmisChatGenerics>[];
  parent?: StreamMessage<ErmisChatGenerics>;
  parent_id?: string;
  status?: string;
  text?: string;
};

export type RetrySendMessage<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = (message: StreamMessage<ErmisChatGenerics>) => Promise<void>;

export type ChannelActionContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  addNotification: (text: string, type: 'success' | 'error') => void;
  closeThread: (event?: React.BaseSyntheticEvent) => void;
  deleteMessage: (
    message: StreamMessage<ErmisChatGenerics>,
  ) => Promise<MessageResponse<ErmisChatGenerics>>;
  dispatch: React.Dispatch<ChannelStateReducerAction<ErmisChatGenerics>>;
  editMessage: (
    message: UpdatedMessage<ErmisChatGenerics>,
    options?: UpdateMessageOptions,
  ) => Promise<UpdateMessageAPIResponse<ErmisChatGenerics> | void>;
  jumpToFirstUnreadMessage: (queryMessageLimit?: number) => Promise<void>;
  jumpToLatestMessage: () => Promise<void>;
  jumpToMessage: (messageId: string, limit?: number) => Promise<void>;
  loadMore: (limit?: number) => Promise<number>;
  loadMoreNewer: (limit?: number) => Promise<number>;
  loadMoreThread: () => Promise<void>;
  markRead: (options?: MarkReadWrapperOptions) => void;
  onMentionsClick: CustomMentionHandler<ErmisChatGenerics>;
  onMentionsHover: CustomMentionHandler<ErmisChatGenerics>;
  openThread: (message: StreamMessage<ErmisChatGenerics>, event?: React.BaseSyntheticEvent) => void;
  removeMessage: (message: StreamMessage<ErmisChatGenerics>) => void;
  retrySendMessage: RetrySendMessage<ErmisChatGenerics>;
  sendMessage: (
    message: MessageToSend<ErmisChatGenerics>,
    customMessageData?: Partial<Message<ErmisChatGenerics>>,
    options?: SendMessageOptions,
  ) => Promise<void>;
  setChannelUnreadUiState: React.Dispatch<React.SetStateAction<ChannelUnreadUiState | undefined>>;
  setQuotedMessage: React.Dispatch<
    React.SetStateAction<StreamMessage<ErmisChatGenerics> | undefined>
  >;
  updateMessage: (message: StreamMessage<ErmisChatGenerics>) => void;
};

export const ChannelActionContext = React.createContext<ChannelActionContextValue | undefined>(
  undefined,
);

export const ChannelActionProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  children,
  value,
}: PropsWithChildren<{
  value: ChannelActionContextValue<ErmisChatGenerics>;
}>) => (
  <ChannelActionContext.Provider value={(value as unknown) as ChannelActionContextValue}>
    {children}
  </ChannelActionContext.Provider>
);

export const useChannelActionContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  componentName?: string,
) => {
  const contextValue = useContext(ChannelActionContext);

  if (!contextValue) {
    console.warn(
      `The useChannelActionContext hook was called outside of the ChannelActionContext provider. Make sure this hook is called within a child of the Channel component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ChannelActionContextValue<ErmisChatGenerics>;
  }

  return (contextValue as unknown) as ChannelActionContextValue<ErmisChatGenerics>;
};

/**
 * Typescript currently does not support partial inference, so if ChannelActionContext
 * typing is desired while using the HOC withChannelActionContext, the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withChannelActionContext = <
  P extends UnknownType,
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  Component: React.ComponentType<P>,
) => {
  const WithChannelActionContextComponent = (
    props: Omit<P, keyof ChannelActionContextValue<ErmisChatGenerics>>,
  ) => {
    const channelActionContext = useChannelActionContext<ErmisChatGenerics>();

    return <Component {...(props as P)} {...channelActionContext} />;
  };

  WithChannelActionContextComponent.displayName = (
    Component.displayName ||
    Component.name ||
    'Component'
  ).replace('Base', '');

  return WithChannelActionContextComponent;
};
