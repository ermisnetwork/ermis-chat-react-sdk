import React from 'react';
import type { Action, Attachment } from 'ermis-chat-js-sdk';

import { useTranslationContext } from '../../context';

import type { ActionHandlerReturnType } from '../Message/hooks/useActionHandler';
import type { DefaultStreamChatGenerics } from '../../types/types';

export type AttachmentActionsProps<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
> = Attachment<StreamChatGenerics> & {
  /** A list of actions */
  actions: Action[];
  /** Unique id for action button key. Key is generated by concatenating this id with action value - {`${id}-${action.value}`} */
  id: string;
  /** The text for the form input */
  text: string;
  /** Click event handler */
  actionHandler?: ActionHandlerReturnType;
};

const UnMemoizedAttachmentActions = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  props: AttachmentActionsProps<StreamChatGenerics>,
) => {
  const { actionHandler, actions, id, text } = props;
  const { t } = useTranslationContext('UnMemoizedAttachmentActions');

  const handleActionClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    name?: string,
    value?: string,
  ) => actionHandler?.(name, value, event);

  return (
    <div className='str-chat__message-attachment-actions'>
      <div className='str-chat__message-attachment-actions-form'>
        <span>{text}</span>
        {actions.map((action) => (
          <button
            className={`str-chat__message-attachment-actions-button str-chat__message-attachment-actions-button--${action.style}`}
            data-testid={`${action.name}`}
            data-value={action.value}
            key={`${id}-${action.value}`}
            onClick={(event) => handleActionClick(event, action.name, action.value)}
          >
            {action.text ? t<string>(action.text) : null}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * A component for rendering the actions you can take on an attachment.
 */
export const AttachmentActions = React.memo(
  UnMemoizedAttachmentActions,
) as typeof UnMemoizedAttachmentActions;
