import React, { PropsWithChildren, useContext } from 'react';

import type { AttachmentProps } from '../components/Attachment/Attachment';
import type { AvatarProps } from '../components/Avatar/Avatar';
import type { DateSeparatorProps } from '../components/DateSeparator/DateSeparator';
import type { EmptyStateIndicatorProps } from '../components/EmptyStateIndicator/EmptyStateIndicator';
import type { EventComponentProps } from '../components/EventComponent/EventComponent';
import type { LoadingIndicatorProps } from '../components/Loading/LoadingIndicator';
import type { FixedHeightMessageProps } from '../components/Message/FixedHeightMessage';
import type {
  MessageProps,
  MessageUIComponentProps,
  PinIndicatorProps,
} from '../components/Message/types';
import type { MessageDeletedProps } from '../components/Message/MessageDeleted';
import type { GiphyPreviewMessageProps } from '../components/MessageList/GiphyPreviewMessage';
import type { MessageListNotificationsProps } from '../components/MessageList/MessageListNotifications';
import type { MessageNotificationProps } from '../components/MessageList/MessageNotification';
import type { MessageOptionsProps } from '../components/Message/MessageOptions';
import type { EmojiSearchIndex, MessageInputProps } from '../components/MessageInput/MessageInput';
import type { QuotedMessagePreviewProps } from '../components/MessageInput/QuotedMessagePreview';
import type { MessageRepliesCountButtonProps } from '../components/Message/MessageRepliesCountButton';
import type { MessageStatusProps } from '../components/Message/MessageStatus';
import type { MessageTimestampProps } from '../components/Message/MessageTimestamp';
import type { ModalGalleryProps } from '../components/Gallery/ModalGallery';
import type { ReactionSelectorProps } from '../components/Reactions/ReactionSelector';
import type { ReactionsListProps } from '../components/Reactions/ReactionsList';
import type {
  SuggestionItemProps,
  SuggestionListProps,
} from '../components/ChatAutoComplete/ChatAutoComplete';
import { UnreadMessagesSeparatorProps } from '../components/MessageList/UnreadMessagesSeparator';
import type { SuggestionListHeaderProps } from '../components/AutoCompleteTextarea';
import type { ThreadHeaderProps } from '../components/Thread/ThreadHeader';
import type { TypingIndicatorProps } from '../components/TypingIndicator/TypingIndicator';

import type { CustomTrigger, DefaultErmisChatGenerics, UnknownType } from '../types/types';
import {
  BaseImageProps,
  CooldownTimerProps,
  CustomMessageActionsListProps,
  StartRecordingAudioButtonProps,
} from '../components';
import type { AttachmentPreviewListProps } from '../components/MessageInput';
import type { LinkPreviewListProps } from '../components/MessageInput/LinkPreviewList';
import type { ReactionOptions } from '../components/Reactions/reactionOptions';
import type { MessageBouncePromptProps } from '../components/MessageBounce';
import type { UnreadMessagesNotificationProps } from '../components/MessageList/UnreadMessagesNotification';
import type { SendButtonProps } from '../components/MessageInput/SendButton';
import type { RecordingPermissionDeniedNotificationProps } from '../components';
import type { TimestampProps } from '../components/Message/Timestamp';

export type ComponentContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
> = {
  Attachment: React.ComponentType<AttachmentProps<ErmisChatGenerics>>;
  DateSeparator: React.ComponentType<DateSeparatorProps>;
  Message: React.ComponentType<MessageUIComponentProps<ErmisChatGenerics>>;
  MessageSystem: React.ComponentType<EventComponentProps<ErmisChatGenerics>>;
  reactionOptions: ReactionOptions;
  UnreadMessagesSeparator: React.ComponentType<UnreadMessagesSeparatorProps>;
  AttachmentPreviewList?: React.ComponentType<AttachmentPreviewListProps>;
  AudioRecorder?: React.ComponentType;
  AutocompleteSuggestionHeader?: React.ComponentType<SuggestionListHeaderProps>;
  AutocompleteSuggestionItem?: React.ComponentType<SuggestionItemProps<ErmisChatGenerics>>;
  AutocompleteSuggestionList?: React.ComponentType<SuggestionListProps<ErmisChatGenerics>>;
  Avatar?: React.ComponentType<AvatarProps<ErmisChatGenerics>>;
  BaseImage?: React.ComponentType<BaseImageProps>;
  CooldownTimer?: React.ComponentType<CooldownTimerProps>;
  CustomMessageActionsList?: React.ComponentType<CustomMessageActionsListProps<ErmisChatGenerics>>;
  EditMessageInput?: React.ComponentType<MessageInputProps<ErmisChatGenerics>>;
  EmojiPicker?: React.ComponentType;
  emojiSearchIndex?: EmojiSearchIndex;
  EmptyStateIndicator?: React.ComponentType<EmptyStateIndicatorProps>;
  FileUploadIcon?: React.ComponentType;
  GiphyPreviewMessage?: React.ComponentType<GiphyPreviewMessageProps<ErmisChatGenerics>>;
  HeaderComponent?: React.ComponentType;
  Input?: React.ComponentType<MessageInputProps<ErmisChatGenerics, V>>;
  LinkPreviewList?: React.ComponentType<LinkPreviewListProps>;
  LoadingIndicator?: React.ComponentType<LoadingIndicatorProps>;
  MessageBouncePrompt?: React.ComponentType<MessageBouncePromptProps>;
  MessageDeleted?: React.ComponentType<MessageDeletedProps<ErmisChatGenerics>>;
  MessageListNotifications?: React.ComponentType<MessageListNotificationsProps>;
  MessageNotification?: React.ComponentType<MessageNotificationProps>;
  MessageOptions?: React.ComponentType<MessageOptionsProps<ErmisChatGenerics>>;
  MessageRepliesCountButton?: React.ComponentType<MessageRepliesCountButtonProps>;
  MessageStatus?: React.ComponentType<MessageStatusProps>;
  MessageTimestamp?: React.ComponentType<MessageTimestampProps<ErmisChatGenerics>>;
  ModalGallery?: React.ComponentType<ModalGalleryProps>;
  PinIndicator?: React.ComponentType<PinIndicatorProps<ErmisChatGenerics>>;
  QuotedMessage?: React.ComponentType;
  QuotedMessagePreview?: React.ComponentType<QuotedMessagePreviewProps<ErmisChatGenerics>>;
  ReactionSelector?: React.ForwardRefExoticComponent<ReactionSelectorProps<ErmisChatGenerics>>;
  ReactionsList?: React.ComponentType<ReactionsListProps<ErmisChatGenerics>>;
  RecordingPermissionDeniedNotification?: React.ComponentType<RecordingPermissionDeniedNotificationProps>;
  SendButton?: React.ComponentType<SendButtonProps<ErmisChatGenerics>>;
  StartRecordingAudioButton?: React.ComponentType<StartRecordingAudioButtonProps>;
  ThreadHead?: React.ComponentType<MessageProps<ErmisChatGenerics>>;
  ThreadHeader?: React.ComponentType<ThreadHeaderProps<ErmisChatGenerics>>;
  ThreadInput?: React.ComponentType<MessageInputProps<ErmisChatGenerics, V>>;
  ThreadStart?: React.ComponentType;
  Timestamp?: React.ComponentType<TimestampProps>;
  TriggerProvider?: React.ComponentType;
  TypingIndicator?: React.ComponentType<TypingIndicatorProps>;
  UnreadMessagesNotification?: React.ComponentType<UnreadMessagesNotificationProps>;
  VirtualMessage?: React.ComponentType<FixedHeightMessageProps<ErmisChatGenerics>>;
};

export const ComponentContext = React.createContext<ComponentContextValue | undefined>(undefined);

export const ComponentProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>({
  children,
  value,
}: PropsWithChildren<{
  value: Partial<ComponentContextValue<ErmisChatGenerics, V>>;
}>) => (
  <ComponentContext.Provider value={(value as unknown) as ComponentContextValue}>
    {children}
  </ComponentContext.Provider>
);

export const useComponentContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  componentName?: string,
) => {
  const contextValue = useContext(ComponentContext);

  if (!contextValue) {
    console.warn(
      `The useComponentContext hook was called outside of the ComponentContext provider. Make sure this hook is called within a child of the Channel component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ComponentContextValue<ErmisChatGenerics, V>;
  }

  return contextValue as ComponentContextValue<ErmisChatGenerics, V>;
};

/**
 * Typescript currently does not support partial inference, so if ComponentContext
 * typing is desired while using the HOC withComponentContext, the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withComponentContext = <
  P extends UnknownType,
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  Component: React.ComponentType<P>,
) => {
  const WithComponentContextComponent = (
    props: Omit<P, keyof ComponentContextValue<ErmisChatGenerics, V>>,
  ) => {
    const componentContext = useComponentContext<ErmisChatGenerics, V>();

    return <Component {...(props as P)} {...componentContext} />;
  };

  WithComponentContextComponent.displayName = (
    Component.displayName ||
    Component.name ||
    'Component'
  ).replace('Base', '');

  return WithComponentContextComponent;
};
