import React from 'react';

import type { StreamMessage } from '../../context/ChannelStateContext';
import type { DefaultErmisChatGenerics } from '../../types/types';

import { useMessageContext } from '../../context/MessageContext';
import { Timestamp as DefaultTimestamp } from './Timestamp';
import { useComponentContext } from '../../context';

export const defaultTimestampFormat = 'h:mmA';

export type MessageTimestampProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /* If true, call the `Day.js` calendar function to get the date string to display. */
  calendar?: boolean;
  /* Adds a CSS class name to the component's outer `time` container. */
  customClass?: string;
  /* Overrides the default timestamp format */
  format?: string;
  /* The `ErmisChat` message object, which provides necessary data to the underlying UI components (overrides the value from `MessageContext`) */
  message?: StreamMessage<ErmisChatGenerics>;
};

const UnMemoizedMessageTimestamp = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageTimestampProps<ErmisChatGenerics>,
) => {
  const { message: propMessage, ...timestampProps } = props;
  const { message: contextMessage } = useMessageContext<ErmisChatGenerics>('MessageTimestamp');
  const { Timestamp = DefaultTimestamp } = useComponentContext('MessageTimestamp');
  const message = propMessage || contextMessage;
  return <Timestamp timestamp={message.created_at} {...timestampProps} />;
};

export const MessageTimestamp = React.memo(
  UnMemoizedMessageTimestamp,
) as typeof UnMemoizedMessageTimestamp;
