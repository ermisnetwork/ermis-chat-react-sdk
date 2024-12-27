import React, { useState } from 'react';
import type { ChannelFilters, ChannelOptions, ChannelSort } from 'ermis-chat-js-sdk';
import { Channel, Chat, useCreateChatClient } from 'ermis-chat-react-sdk';
import clsx from 'clsx';
import { EmojiPicker } from 'ermis-chat-react-sdk/emojis';

import data from '@emoji-mart/data';
import { init, SearchIndex } from 'emoji-mart';

import 'ermis-chat-css/dist/v2/css/index.css';
import './styles/index.css';

import {
  ChannelInner,
  CreateChannel,
  MessagingSidebar,
  MessagingThreadHeader,
  SendButton,
} from './components';

import { GiphyContextProvider, useThemeContext } from './context';

import { useChecklist, useMobileView, useUpdateAppHeightOnResize } from './hooks';

import type { ErmisChatGenerics } from './types';

init({ data });

type AppProps = {
  apiKey: string;
  projectId: string;
  userToConnect: { id: string; name?: string; image?: string };
  userToken: string | undefined;
  targetOrigin: string;
  channelListOptions: {
    options: ChannelOptions;
    filters: ChannelFilters;
    sort: ChannelSort;
  };
};

const EmojiPickerWithTheme = () => {
  const { theme } = useThemeContext();

  return <EmojiPicker pickerProps={{ theme }} />;
};

const App = (props: AppProps) => {
  const { apiKey, projectId, userToConnect, userToken, targetOrigin, channelListOptions } = props;
  const [isCreating, setIsCreating] = useState(false);

  const chatClient = useCreateChatClient<ErmisChatGenerics>({
    apiKey,
    options: {
      baseURL: 'https://api-dev.ermis.network',
      timeout: 6000,
    },
    projectId,
    userData: userToConnect,
    tokenOrProvider: userToken,
  });
  const toggleMobile = useMobileView();
  const { themeClassName } = useThemeContext();

  useChecklist(chatClient, targetOrigin);
  useUpdateAppHeightOnResize();

  if (!chatClient) {
    return null; // render nothing until connection to the backend is established
  }

  return (
    <Chat client={chatClient} theme={clsx('messaging', themeClassName)}>
      <MessagingSidebar
        channelListOptions={channelListOptions}
        onClick={toggleMobile}
        onCreateChannel={() => setIsCreating(!isCreating)}
        onPreviewSelect={() => setIsCreating(false)}
      />
      <Channel
        maxNumberOfFiles={10}
        multipleUploads={true}
        SendButton={SendButton}
        ThreadHeader={MessagingThreadHeader}
        TypingIndicator={() => null}
        EmojiPicker={EmojiPickerWithTheme}
        emojiSearchIndex={SearchIndex}
        enrichURLForPreview
      >
        {isCreating && (
          <CreateChannel toggleMobile={toggleMobile} onClose={() => setIsCreating(false)} />
        )}
        <GiphyContextProvider>
          <ChannelInner theme={themeClassName} toggleMobile={toggleMobile} />
        </GiphyContextProvider>
      </Channel>
    </Chat>
  );
};

export default App;
