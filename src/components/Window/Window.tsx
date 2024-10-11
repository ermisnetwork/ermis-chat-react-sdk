import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';

import { StreamMessage, useChannelStateContext } from '../../context/ChannelStateContext';

import type { DefaultErmisChatGenerics } from '../../types/types';

export type WindowProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** optional prop to force addition of class str-chat__main-panel---with-thread-opn to the Window root element */
  thread?: StreamMessage<ErmisChatGenerics>;
};

const UnMemoizedWindow = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: PropsWithChildren<WindowProps<ErmisChatGenerics>>,
) => {
  const { children, thread: propThread } = props;

  const { thread: contextThread } = useChannelStateContext<ErmisChatGenerics>('Window');

  return (
    <div
      className={clsx('str-chat__main-panel', {
        'str-chat__main-panel--thread-open': contextThread || propThread,
      })}
    >
      {children}
    </div>
  );
};

/**
 * A UI component for conditionally displaying a Thread or Channel
 */
export const Window = React.memo(UnMemoizedWindow) as typeof UnMemoizedWindow;
