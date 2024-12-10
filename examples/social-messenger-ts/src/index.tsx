import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import { getChannelListOptions } from './channelListOptions';
import { ThemeContextProvider } from './context';
import { UserResponse } from 'ermis-chat-js-sdk';
import { ErmisChatGenerics } from './types';

const urlParams = new URLSearchParams(window.location.search);
const apiKey = urlParams.get('api_key') || process.env.REACT_APP_STREAM_KEY;
const projectId = urlParams.get('project_id') || process.env.REACT_APP_PROJECT_ID;
const user = urlParams.get('user') || process.env.REACT_APP_USER_ID;
const userToken = urlParams.get('user_token') || process.env.REACT_APP_USER_TOKEN;
const targetOrigin =
  urlParams.get('target_origin') || (process.env.REACT_APP_TARGET_ORIGIN as string);

const channelListOptions = getChannelListOptions();
const userToConnect: UserResponse<ErmisChatGenerics> = {
  id: user!,
  name: user!,
  image: '',
};

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeContextProvider targetOrigin={targetOrigin}>
      <App
        apiKey={apiKey!}
        projectId={projectId!}
        userToConnect={userToConnect}
        userToken={userToken}
        targetOrigin={targetOrigin!}
        channelListOptions={channelListOptions}
      />
    </ThemeContextProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
