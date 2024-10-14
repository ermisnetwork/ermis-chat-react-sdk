import React from 'react';

import { Message, MessageProps } from '../Message';
import { ThreadStart as DefaultThreadStart } from './ThreadStart';

import { useComponentContext } from '../../context';

import type { DefaultErmisChatGenerics } from '../../types/types';

export const ThreadHead = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: MessageProps<ErmisChatGenerics>,
) => {
  const { ThreadStart = DefaultThreadStart } = useComponentContext<ErmisChatGenerics>(
    'ThreadHead',
  );
  return (
    <div className='str-chat__parent-message-li'>
      <Message initialMessage threadList {...props} />
      <ThreadStart />
    </div>
  );
};
