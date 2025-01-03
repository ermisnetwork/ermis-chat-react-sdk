import { useCallback, useEffect, useRef } from 'react';
import { logChatPromiseExecution } from 'ermis-chat-js-sdk';
import type { MessageInputReducerAction, MessageInputState } from './useMessageInputState';
import type { MessageInputProps } from '../MessageInput';
import { useChannelStateContext } from '../../../context/ChannelStateContext';

import type { CustomTrigger, DefaultErmisChatGenerics } from '../../../types/types';
import type { EnrichURLsController } from './useLinkPreviews';

export const useMessageInputText = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  V extends CustomTrigger = CustomTrigger
>(
  props: MessageInputProps<ErmisChatGenerics, V>,
  state: MessageInputState<ErmisChatGenerics>,
  dispatch: React.Dispatch<MessageInputReducerAction<ErmisChatGenerics>>,
  findAndEnqueueURLsToEnrich?: EnrichURLsController['findAndEnqueueURLsToEnrich'],
) => {
  const { channel } = useChannelStateContext<ErmisChatGenerics>('useMessageInputText');
  const { additionalTextareaProps, focus, parent, publishTypingEvent = true } = props;
  const { text } = state;

  const textareaRef = useRef<HTMLTextAreaElement>();

  // Focus
  useEffect(() => {
    if (focus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focus]);

  // Text + cursor position
  const newCursorPosition = useRef<number>();

  const insertText = useCallback(
    (textToInsert: string) => {
      const { maxLength } = additionalTextareaProps || {};

      if (!textareaRef.current) {
        return dispatch({
          getNewText: (text) => {
            const updatedText = text + textToInsert;
            if (maxLength && updatedText.length > maxLength) {
              return updatedText.slice(0, maxLength);
            }
            return updatedText;
          },
          type: 'setText',
        });
      }

      const { selectionEnd, selectionStart } = textareaRef.current;
      newCursorPosition.current = selectionStart + textToInsert.length;

      dispatch({
        getNewText: (prevText) => {
          const updatedText =
            prevText.slice(0, selectionStart) + textToInsert + prevText.slice(selectionEnd);

          if (maxLength && updatedText.length > maxLength) {
            return updatedText.slice(0, maxLength);
          }

          return updatedText;
        },
        type: 'setText',
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [additionalTextareaProps, newCursorPosition, textareaRef],
  );

  useEffect(() => {
    const textareaElement = textareaRef.current;
    if (textareaElement && newCursorPosition.current !== undefined) {
      textareaElement.selectionStart = newCursorPosition.current;
      textareaElement.selectionEnd = newCursorPosition.current;
      newCursorPosition.current = undefined;
    }
  }, [text, newCursorPosition]);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      event.preventDefault();
      if (!event || !event.target) {
        return;
      }

      const newText = event.target.value;
      dispatch({
        getNewText: () => newText,
        type: 'setText',
      });

      findAndEnqueueURLsToEnrich?.(newText);

      if (publishTypingEvent && newText && channel) {
        logChatPromiseExecution(channel.keystroke(parent?.id), 'start typing event');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [channel, findAndEnqueueURLsToEnrich, parent, publishTypingEvent],
  );

  return {
    handleChange,
    insertText,
    textareaRef,
  };
};
