import { useChatContext } from 'context';
import { ThreadManagerState } from 'ermis-chat-js-sdk';
import { useStateStore } from '../../../store';

export const useThreadManagerState = <T extends readonly unknown[]>(
  selector: (nextValue: ThreadManagerState) => T,
) => {
  const { client } = useChatContext();

  return useStateStore(client.threads.state, selector);
};
