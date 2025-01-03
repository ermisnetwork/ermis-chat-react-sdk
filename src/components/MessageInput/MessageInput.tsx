import React, { PropsWithChildren } from 'react';

import { DefaultTriggerProvider } from './DefaultTriggerProvider';
import { MessageInputFlat } from './MessageInputFlat';
import { useCooldownTimer } from './hooks/useCooldownTimer';
import { useCreateMessageInputContext } from './hooks/useCreateMessageInputContext';
import { useMessageInputState } from './hooks/useMessageInputState';
import { StreamMessage, useChannelStateContext } from '../../context/ChannelStateContext';
import { ComponentContextValue, useComponentContext } from '../../context/ComponentContext';
import { MessageInputContextProvider } from '../../context/MessageInputContext';

import type { Channel, Message, SendFileAPIResponse } from 'ermis-chat-js-sdk';

import type { MessageToSend } from '../../context/ChannelActionContext';
import type {
  CustomTrigger,
  DefaultErmisChatGenerics,
  SearchQueryParams,
  SendMessageOptions,
  UnknownType,
} from '../../types/types';
import type { URLEnrichmentConfig } from './hooks/useLinkPreviews';
import type { FileUpload, ImageUpload } from './types';
import type { CustomAudioRecordingConfig } from '../MediaRecorder';

export type EmojiSearchIndexResult = {
  id: string;
  name: string;
  skins: Array<{ native: string }>;
  emoticons?: Array<string>;
  native?: string;
};

export interface EmojiSearchIndex<T extends UnknownType = UnknownType> {
  search: (
    query: string,
  ) => PromiseLike<Array<EmojiSearchIndexResult & T>> | Array<EmojiSearchIndexResult & T> | null;
}

export type MessageInputProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
> = {
  /** Additional props to be passed to the underlying `AutoCompleteTextarea` component, [available props](https://www.npmjs.com/package/react-textarea-autosize) */
  additionalTextareaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  /**
   * When enabled, recorded messages won’t be sent immediately.
   * Instead, they will “stack up” with other attachments in the message composer allowing the user to send multiple attachments as part of the same message.
   */
  asyncMessagesMultiSendEnabled?: boolean;
  /** Allows to configure the audio recording parameters for voice messages. */
  audioRecordingConfig?: CustomAudioRecordingConfig;
  /** Controls whether the users will be provided with the UI to record voice messages. */
  audioRecordingEnabled?: boolean;
  /** Function to clear the editing state while editing a message */
  clearEditingState?: () => void;
  /** If true, disables the text input */
  disabled?: boolean;
  /** If true, the suggestion list will not display and autocomplete @mentions. Default: false. */
  disableMentions?: boolean;
  /** Function to override the default file upload request */
  doFileUploadRequest?: (
    file: FileUpload['file'],
    channel: Channel<ErmisChatGenerics>,
  ) => Promise<SendFileAPIResponse>;
  /** Function to override the default image upload request */
  doImageUploadRequest?: (
    file: ImageUpload['file'],
    channel: Channel<ErmisChatGenerics>,
  ) => Promise<SendFileAPIResponse>;
  /** Mechanism to be used with autocomplete and text replace features of the `MessageInput` component, see [emoji-mart `SearchIndex`](https://github.com/missive/emoji-mart#%EF%B8%8F%EF%B8%8F-headless-search) */
  emojiSearchIndex?: ComponentContextValue['emojiSearchIndex'];
  /** Custom error handler function to be called with a file/image upload fails */
  errorHandler?: (
    error: Error,
    type: string,
    file: (FileUpload | ImageUpload)['file'] & { id?: string },
  ) => void;
  /** If true, focuses the text input on component mount */
  focus?: boolean;
  /** Generates the default value for the underlying textarea element. The function's return value takes precedence before additionalTextareaProps.defaultValue. */
  getDefaultValue?: () => string | string[];
  /** If true, expands the text input vertically for new lines */
  grow?: boolean;
  /** Allows to hide MessageInput's send button. */
  hideSendButton?: boolean;
  /** Custom UI component handling how the message input is rendered, defaults to and accepts the same props as [MessageInputFlat](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/MessageInputFlat.tsx) */
  Input?: React.ComponentType<MessageInputProps<ErmisChatGenerics, V>>;
  /** Max number of rows the underlying `textarea` component is allowed to grow */
  maxRows?: number;
  /** If true, the suggestion list will search all app users for an @mention, not just current channel members/watchers. Default: false. */
  mentionAllAppUsers?: boolean;
  /** Object containing filters/sort/options overrides for an @mention user query */
  mentionQueryParams?: SearchQueryParams<ErmisChatGenerics>['userFilters'];
  /** If provided, the existing message will be edited on submit */
  message?: StreamMessage<ErmisChatGenerics>;
  /** If true, disables file uploads for all attachments except for those with type 'image'. Default: false */
  noFiles?: boolean;
  /** Function to override the default submit handler */
  overrideSubmitHandler?: (
    message: MessageToSend<ErmisChatGenerics>,
    channelCid: string,
    customMessageData?: Partial<Message<ErmisChatGenerics>>,
    options?: SendMessageOptions,
  ) => Promise<void> | void;
  /** When replying in a thread, the parent message object */
  parent?: StreamMessage<ErmisChatGenerics>;
  /** If true, triggers typing events on text input keystroke */
  publishTypingEvent?: boolean;
  /** If true, will use an optional dependency to support transliteration in the input for mentions, default is false. See: https://github.com/getstream/transliterate */
  /**
   * Currently, `Enter` is the default submission key and  `Shift`+`Enter` is the default combination for the new line.
   * If specified, this function overrides the default behavior specified previously.
   *
   * Example of default behaviour:
   * ```tsx
   * const defaultShouldSubmit = (event) => event.key === "Enter" && !event.shiftKey;
   * ```
   */
  shouldSubmit?: (event: KeyboardEvent) => boolean;
  /** Configuration parameters for link previews. */
  urlEnrichmentConfig?: URLEnrichmentConfig;
  useMentionsTransliteration?: boolean;
};

const MessageInputProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: PropsWithChildren<MessageInputProps<ErmisChatGenerics, V>>,
) => {
  const cooldownTimerState = useCooldownTimer<ErmisChatGenerics>();
  const messageInputState = useMessageInputState<ErmisChatGenerics, V>(props);
  const { emojiSearchIndex } = useComponentContext('MessageInput');

  const messageInputContextValue = useCreateMessageInputContext<ErmisChatGenerics, V>({
    ...cooldownTimerState,
    ...messageInputState,
    ...props,
    emojiSearchIndex: props.emojiSearchIndex ?? emojiSearchIndex,
  });

  return (
    <MessageInputContextProvider<ErmisChatGenerics, V> value={messageInputContextValue}>
      {props.children}
    </MessageInputContextProvider>
  );
};

const UnMemoizedMessageInput = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: MessageInputProps<ErmisChatGenerics, V>,
) => {
  const { Input: PropInput } = props;

  const { dragAndDropWindow } = useChannelStateContext<ErmisChatGenerics>();
  const { Input: ContextInput, TriggerProvider = DefaultTriggerProvider } = useComponentContext<
    ErmisChatGenerics,
    V
  >('MessageInput');

  const Input = PropInput || ContextInput || MessageInputFlat;

  if (dragAndDropWindow)
    return (
      <>
        <TriggerProvider>
          <Input />
        </TriggerProvider>
      </>
    );

  return (
    <MessageInputProvider {...props}>
      <TriggerProvider>
        <Input />
      </TriggerProvider>
    </MessageInputProvider>
  );
};

/**
 * A high level component that has provides all functionality to the Input it renders.
 */
export const MessageInput = React.memo(UnMemoizedMessageInput) as typeof UnMemoizedMessageInput;
