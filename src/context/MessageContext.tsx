import React, { PropsWithChildren, useContext } from 'react';

import type { Mute, UserResponse } from 'ermis-chat-js-sdk';

import type { ChannelActionContextValue } from './ChannelActionContext';
import type { StreamMessage } from './ChannelStateContext';

import type { ActionHandlerReturnType } from '../components/Message/hooks/useActionHandler';
import type { PinPermissions } from '../components/Message/hooks/usePinHandler';
import type { ReactEventHandler } from '../components/Message/types';
import type { MessageActionsArray } from '../components/Message/utils';
import type { MessageInputProps } from '../components/MessageInput/MessageInput';
import type { GroupStyle } from '../components/MessageList/utils';
import type { ReactionsComparator } from '../components/Reactions/types';

import type { RenderTextOptions } from '../components/Message/renderText';
import type { DefaultErmisChatGenerics, UnknownType } from '../types/types';

export type CustomMessageActions<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  [key: string]: (
    message: StreamMessage<ErmisChatGenerics>,
    event: React.BaseSyntheticEvent,
  ) => Promise<void> | void;
};

export type MessageContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** If actions such as edit, delete, flag, mute are enabled on Message */
  actionsEnabled: boolean;
  /** Function to exit edit state */
  clearEditingState: (event?: React.BaseSyntheticEvent) => void;
  /** If the Message is in edit state */
  editing: boolean;
  /**
   * Returns all allowed actions on message by current user e.g., ['edit', 'delete', 'flag', 'mute', 'pin', 'quote', 'react', 'reply'].
   * Please check [Message](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message.tsx) component for default implementation.
   */
  getMessageActions: () => MessageActionsArray<string>;
  /** Function to send an action in a Channel */
  handleAction: ActionHandlerReturnType;
  /** Function to delete a message in a Channel */
  handleDelete: ReactEventHandler;
  /** Function to edit a message in a Channel */
  handleEdit: ReactEventHandler;
  /** Function to flag a message in a Channel */
  handleFlag: ReactEventHandler;
  /** Function to mark message and the messages that follow it as unread in a Channel */
  handleMarkUnread: ReactEventHandler;
  /** Function to mute a user in a Channel */
  handleMute: ReactEventHandler;
  /** Function to open a Thread on a Message */
  handleOpenThread: ReactEventHandler;
  /** Function to pin a Message in a Channel */
  handlePin: ReactEventHandler;
  /** Function to post a reaction on a Message */
  handleReaction: (reactionType: string, event: React.BaseSyntheticEvent) => Promise<void>;
  /** Function to retry sending a Message */
  handleRetry: ChannelActionContextValue<ErmisChatGenerics>['retrySendMessage'];
  /** Function that returns whether the Message belongs to the current user */
  isMyMessage: () => boolean;
  /** @deprecated will be removed in the next major release.
   *  Whether sending reactions is enabled for the active channel.
   */
  isReactionEnabled: boolean;
  /** The message object */
  message: StreamMessage<ErmisChatGenerics>;
  /** Indicates whether a message has not been read yet or has been marked unread */
  messageIsUnread: boolean;
  /** Handler function for a click event on an @mention in Message */
  onMentionsClickMessage: ReactEventHandler;
  /** Handler function for a hover event on an @mention in Message */
  onMentionsHoverMessage: ReactEventHandler;
  /** Handler function for a click event on the reaction list */
  onReactionListClick: ReactEventHandler;
  /** Handler function for a click event on the user that posted the Message */
  onUserClick: ReactEventHandler;
  /** Handler function for a hover event on the user that posted the Message */
  onUserHover: ReactEventHandler;
  /** Ref to be placed on the reaction selector component */
  reactionSelectorRef: React.MutableRefObject<HTMLDivElement | null>;
  /** Function to toggle the edit state on a Message */
  setEditingState: ReactEventHandler;
  /** Whether or not to show reaction list details */
  showDetailedReactions: boolean;
  /** Additional props for underlying MessageInput component, [available props] */
  additionalMessageInputProps?: MessageInputProps<ErmisChatGenerics>;
  /** Call this function to keep message list scrolled to the bottom when the scroll height increases, e.g. an element appears below the last message (only used in the `VirtualizedMessageList`) */
  autoscrollToBottom?: () => void;
  /** Object containing custom message actions and function handlers */
  customMessageActions?: CustomMessageActions<ErmisChatGenerics>;
  /** If true, the message is the last one in a group sent by a specific user (only used in the `VirtualizedMessageList`) */
  endOfGroup?: boolean;
  /** If true, the message is the first one in a group sent by a specific user (only used in the `VirtualizedMessageList`) */
  firstOfGroup?: boolean;
  /** Override the default formatting of the date. This is a function that has access to the original date object, returns a string  */
  formatDate?: (date: Date) => string;
  /** If true, group messages sent by each user (only used in the `VirtualizedMessageList`) */
  groupedByUser?: boolean;
  /** A list of styles to apply to this message, ie. top, bottom, single */
  groupStyles?: GroupStyle[];
  /** Whether to highlight and focus the message on load */
  highlighted?: boolean;
  /** Whether the threaded message is the first in the thread list */
  initialMessage?: boolean;
  /** Latest message id on current channel */
  lastReceivedId?: string | null;
  /** DOMRect object for parent MessageList component */
  messageListRect?: DOMRect;
  /** Array of muted users coming from [ChannelStateContext] */
  mutes?: Mute<ErmisChatGenerics>[];
  /** @deprecated in favor of `channelCapabilities - The user roles allowed to pin Messages in various channel types */
  pinPermissions?: PinPermissions;
  /** A list of users that have read this Message */
  readBy?: UserResponse<ErmisChatGenerics>[];
  /** Custom function to render message text content, defaults to the renderText function: [utils](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/utils.tsx) */
  renderText?: (
    text?: string,
    mentioned_users?: UserResponse<ErmisChatGenerics>[],
    options?: RenderTextOptions,
  ) => JSX.Element | null;
  /** Comparator function to sort reactions, defaults to chronological order */
  sortReactions?: ReactionsComparator;
  /** Whether or not the Message is in a Thread */
  threadList?: boolean;
  /** render HTML instead of markdown. Posting HTML is only allowed server-side */
  unsafeHTML?: boolean;
};

export const MessageContext = React.createContext<MessageContextValue | undefined>(undefined);

export const MessageProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  children,
  value,
}: PropsWithChildren<{
  value: MessageContextValue<ErmisChatGenerics>;
}>) => (
  <MessageContext.Provider value={(value as unknown) as MessageContextValue}>
    {children}
  </MessageContext.Provider>
);

export const useMessageContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  componentName?: string,
) => {
  const contextValue = useContext(MessageContext);

  if (!contextValue) {
    console.warn(
      `The useMessageContext hook was called outside of the MessageContext provider. Make sure this hook is called within the Message's UI component. The errored call is located in the ${componentName} component.`,
    );

    return {} as MessageContextValue<ErmisChatGenerics>;
  }

  return (contextValue as unknown) as MessageContextValue<ErmisChatGenerics>;
};

/**
 * Typescript currently does not support partial inference, so if MessageContext
 * typing is desired while using the HOC withMessageContext, the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withMessageContext = <
  P extends UnknownType,
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  Component: React.ComponentType<P>,
) => {
  const WithMessageContextComponent = (
    props: Omit<P, keyof MessageContextValue<ErmisChatGenerics>>,
  ) => {
    const messageContext = useMessageContext<ErmisChatGenerics>();

    return <Component {...(props as P)} {...messageContext} />;
  };

  WithMessageContextComponent.displayName = (
    Component.displayName ||
    Component.name ||
    'Component'
  ).replace('Base', '');

  return WithMessageContextComponent;
};
