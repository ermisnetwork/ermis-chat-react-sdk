import React from 'react';

import { CustomMessageActions } from '../../context/MessageContext';

import type { StreamMessage } from '../../context/ChannelStateContext';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type CustomMessageActionsListProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  message: StreamMessage<ErmisChatGenerics>;
  customMessageActions?: CustomMessageActions<ErmisChatGenerics>;
};

/**
 * @deprecated alias for `CustomMessageActionsListProps`, will be removed in the next major release
 */
export type CustomMessageActionsType<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = CustomMessageActionsListProps<ErmisChatGenerics>;

export const CustomMessageActionsList = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: CustomMessageActionsListProps<ErmisChatGenerics>,
) => {
  const { customMessageActions, message } = props;

  if (!customMessageActions) return null;

  const customActionsArray = Object.keys(customMessageActions);

  return (
    <>
      {customActionsArray.map((customAction) => {
        const customHandler = customMessageActions[customAction];

        return (
          <button
            aria-selected='false'
            className='str-chat__message-actions-list-item str-chat__message-actions-list-item-button'
            key={customAction}
            onClick={(event) => customHandler(message, event)}
            role='option'
          >
            {customAction}
          </button>
        );
      })}
    </>
  );
};
