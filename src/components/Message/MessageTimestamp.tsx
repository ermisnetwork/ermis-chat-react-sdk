import React from 'react';
import { useMessageContext } from '../../context/MessageContext';
import { Timestamp as DefaultTimestamp } from './Timestamp';
import { useComponentContext } from '../../context';

import type { StreamMessage } from '../../context/ChannelStateContext';
import type { TimestampFormatterOptions } from '../../i18n/types';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type MessageTimestampProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = TimestampFormatterOptions & {
  /* Adds a CSS class name to the component's outer `time` container. */
  customClass?: string;
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
