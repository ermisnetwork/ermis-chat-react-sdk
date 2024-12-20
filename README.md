# [ErmisChat](https://ermis.network) Chat UI SDK for React

![Platform](https://img.shields.io/badge/platform-REACT-orange.svg)
![Languages](https://img.shields.io/badge/language-TYPESCRIPT-orange.svg)
[![npm](https://img.shields.io/npm/v/ermis-chat-react-sdk.svg?style=popout&colorB=red)](https://www.npmjs.com/package/ermis-chat-react-sdk)

## Table of contents

1.  [Introduction](#introduction)
1.  [Requirements](#requirements)
1.  [Getting Started](#getting-started)
1.  [UI Components](#ui-components)

## Introduction

The Chat React SDK provides the tools and components you need to seamlessly integrate real-time messaging features into your React application. The SDK offers powerful functionalities such as:
- Rich media messages
- Reactions
- Text input commands (ex: Giphy and @mentions)
- Image and file uploads
- Video playback
- Audio recording
- Read state and typing indicators
- Channel and message lists

## Requirements

You need to install:
- **React**: Version 18 or later (with hooks support)
- **Node.js**: Version 18 or later
- **Package Manager**: npm 9>= or yarn 1>=

## Getting started

This guide will help you quickly integrate the ErmisChat React SDK into your application. Follow the steps below to set up the SDK and start using its features.

### Step 1: Install the SDK

To begin, install the SDK using npm or yarn:

```bash
# Using npm
$ npm install ermis-chat-js-sdk ermis-chat-react-sdk

# Using yarn
yarn add ermis-chat-js-sdk ermis-chat-react-sdk
```

### Step 2: Initialize the SDK

Before initialze SDK, you need to generate an **API key** and **ProjectID** on the [Ermis Dashboard](https://ermis.network). You also need to integrate a login flow to obtain a **userToken** and **userID**. Follow the [authentication guide](https://docs.ermis.network/JavaScript/doc#step-3-install-walletconnect) for detailed instructions.

```javascript
import { Chat, useCreateChatClient } from 'ermis-chat-react-sdk';
import 'ermis-chat-react-sdk/css/v2/index.css';

const apiKey = "your-api-key";
const projectId = "your-project-id";
const userId = "user-id";
const token = "user-token";
const options = {
  baseURL: 'https://api-dev.ermis.network',
  timeout: 6000,
}

const App = () => {
  const chatClient = useCreateChatClient({
    apiKey,
    options, // optional
    projectId,
    tokenOrProvider: userToken,
    userData: { id: userId },
  });

  if (!chatClient) return <>Loading...</>;

  return (
    <Chat client={chatClient}>
      // Your chat components will go here
    </Chat>
  )
};

export default App;

```

### Step 3: Set up a Chat interface

You can use pre-built components from the SDK to quickly create a chat interface:

```javascript
import { ChannelFilters, ChannelOptions, ChannelSort } from 'ermis-chat-js-sdk';
import {
  Channel,
  ChannelHeader,
  ChannelList,
  Chat,
  MessageInput,
  MessageList,
  Window,
  useCreateChatClient,
} from 'ermis-chat-react-sdk';
import 'ermis-chat-react-sdk/css/v2/index.css';

const apiKey = "your-api-key";
const projectId = "your-project-id";
const userId = "user-id";
const token = "user-token";
const options = {
  baseURL: 'https://api-dev.ermis.network',
  timeout: 6000,
}
const filters: ChannelFilters = {};
const options: ChannelOptions = {};
const sort: ChannelSort = {};

const App = () => {
  const chatClient = useCreateChatClient({
    apiKey,
    options, // optional
    projectId,
    tokenOrProvider: userToken,
    userData: { id: userId },
  });

  if (!chatClient) return <>Loading...</>;

  return (
    <Chat client={chatClient}>
      <ChannelList filters={filters} options={options} sort={sort} />
      <Channel>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput focus />
        </Window>
      </Channel>
    </Chat>
  )
};

export default App;

```
This setup provides a simple chat interface with channels, message lists, and an input box.

## UI Components

1. [Theming](#theming)
2. [Chat](#chat)
3. [Channel](#channel)
4. [Channel List](#channel-list)
5. [Message List](#message-list)
6. [Message](#message)
7. [Message Input](#message-input)

### Theming

The SDK provides default CSS, which can be overridden by the integrators.

#### 1. Importing the stylesheet
If you’re using SCSS:

```javascript
import 'ermis-chat-react-sdk/dist/css/v2/index.scss';
```
If you’re using CSS:

```javascript
import 'ermis-chat-react-sdk/dist/css/v2/index.css';
```

#### 2. Dark and light themes

The default theme has dark and light variants. Here is how you can switch between the different themes:

```javascript

const theme = "str-chat__theme-dark" // str-chat__theme-light
<Chat client={chatClient} theme>
    // Your chat components will go here
</Chat>
```
or only to a specific component (Channel or/and ChannelList):

```javascript

<Chat
  client={chatClient}
  customClasses={{
    channelList: "str-chat__theme-dark str-chat__channel-list",
    channel: "str-chat__theme-light str-chat__channel",
  }}
>
  // Your chat components will go here
</Chat>
```

#### 3. Customization global variables
You can use global variables to apply changes to the whole chat UI (as opposed to changing the design of individual components).

Global variables can be grouped into the following categories:
- **Theme**: colors, typography and border radiuses ([list of global theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/_global-theme-variables.scss))

- **Layout**: spacing (padding and margin) and sizing ([list of global layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/_global-layout-variables.scss))

Here is how you can customize global variables:

```scss

.str-chat {
  --str-chat__primary-color: #009688;
  --str-chat__active-primary-color: #004d40;
  --str-chat__surface-color: #f5f5f5;
  --str-chat__secondary-surface-color: #fafafa;
  --str-chat__primary-surface-color: #e0f2f1;
  --str-chat__primary-surface-color-low-emphasis: #edf7f7;
  --str-chat__border-radius-circle: 6px;
}
```

#### 4. Customization component variables
You can use component layer variables to change the design of individual components.

Component variables can be further grouped in the following ways:
- **Themes**: variables for changing text and background colors, borders and shadow
- **Layout variables**: defined for some components (but not all) to change the size of a specific part of a component

You can find the list of components below:
| Component name      | Variables   |
| :-------- | :----- |
| `AttachmentList`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/AttachmentList/AttachmentList-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/AttachmentList/AttachmentList-layout.scss) |
| `AttachmentPreviewList`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/AttachmentPreviewList/AttachmentPreviewList-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/AttachmentPreviewList/AttachmentPreviewList-layout.scss) |
| `Avatar`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/Avatar/Avatar-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/Avatar/Avatar-layout.scss) |
| `Channel`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/Channel/Channel-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/Channel/Channel-layout.scss) |
| `ChannelHeader`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/ChannelHeader/ChannelHeader-theme.scss)|
| `ChannelList`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/ChannelList/ChannelList-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/ChannelList/ChannelList-layout.scss) |
| `LoadingIndicator`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/LoadingIndicator/LoadingIndicator-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/LoadingIndicator/LoadingIndicator-layout.scss) |
| `Message`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/Message/Message-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/Message/Message-layout.scss) |
| `MessageActionsBox`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageActionsBox/MessageActionsBox-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageActionsBox/MessageActionsBox-layout.scss) |
| `MessageInput`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageInput/MessageInput-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageInput/MessageInput-layout.scss) |
| `MessageList`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageList/MessageList-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageList/MessageList-layout.scss) |
| `MessageReactions`      | [theme variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageReactions/MessageReactions-theme.scss), [layout variables](https://github.com/ermisnetwork/ermis-chat-css/blob/main/src/v2/styles/MessageReactions/MessageReactions-layout.scss) |

### Chat

The `Chat` component is a React Context provider that wraps the entire Ermis Chat application. It provides the ChatContext to its children, which includes the `ErmisChat` client instance. All other components within the library must be nested as children of `Chat` to maintain proper functionality.


#### 1. Usage

The `Chat` component does not inject any UI, so its implementation is fairly simple. Once an instance of the `ErmisChat` client has been created, you pass the client object as a prop to add it to the `ChatContext`.




```javascript
<Chat client={chatClient}>
  // Your chat components will go here
</Chat>
```

#### 2. Props

- **client**

The `ErmisChat` client instance. Any methods from the ermis-chat-js-sdk API interface can be run off this object.

```javascript
const channel = chatClient.channel(channel_type, channel_id);
```

| Type      |
| :-------- |
| object    |

- **theme**

Used for injecting className/s to the `Channel` and `ChannelList` components.

| Type      |
| :-------- |
| string    |

- **customClasses**

Object containing custom CSS classnames to override the library’s default container CSS. Many of the high level React components in the library come with predefined CSS container classes that inject basic display styling. To remove or replace these wrapper classes entirely, the `Chat` component takes a `customClasses` prop. This prop accepts a mapping of overridable container classnames.

```javascript
const customClasses: CustomClasses = {
  chat: "custom-chat-class",
  channel: "custom-channel-class",
};

const App = () => (
  <Chat client={chatClient} customClasses={customClasses}>
    // Your chat components will go here
  </Chat>
);
```

The accepted object keys and the default classnames they override are as follows:

+ chat - `str-chat`
+ chatContainer - `str-chat__container`
+ channel - `str-chat-channel`
+ channelList - `str-chat-channel-list`
+ message - `str-chat__li str-chat__li--${groupStyles}`
+ messageList - `str-chat__list`
+ virtualMessage - `str-chat__virtual-list-message-wrapper`
+ virtualizedMessageList - `str-chat__virtual-list`

| Type      |
| :-------- |
| object    |

- **defaultLanguage**

Sets the default fallback language for UI component translation, defaults to ‘en’ for English.

| Type      | Default |
| :-------- |:----|
| string    | 'en' |

- **i18nInstance**

The Streami18n translation instance. Create an instance of this class when you wish to change the connected user’s default language or override default text in the library.

```javascript
const i18nInstance = new Streami18n({
  language: "es",
  translationsForLanguage: {
    "Nothing yet...": "Nada",
  },
});
<Chat client={chatClient} i18nInstance={i18nInstance}>
  // Your chat components will go here
</Chat>;
```

| Type      |
| :-------- |
| object    |

### Channel

#### 1. Channel

The `Channel` component is a React Context provider that wraps all the logic, functionality, and UI for an individual chat channel.

##### 1.1. Usage
The `Channel` component does not inject any UI, so its implementation is fairly simple and can be handled in one of two ways, both with and without a `ChannelList` component. If you are using a `ChannelList`, do not add a `channel` object as a prop on `Channel`. However, in the absence of a `ChannelList`, the `channel` prop is required. By default, the `ChannelList` sets the active `channel` object, which is then injected it into the `ChannelStateContext`, so manual prop passing is not required.

+ **Example 1** - without `ChannelList`
  ```javascript
  <Chat client={chatClient}>
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  </Chat>
  ```

+ **Example 2** - with `ChannelList`
  ```javascript
  <Chat client={chatClient}>
    <ChannelList />
    <Channel>
      <MessageList />
      <MessageInput />
    </Channel>
  </Chat>
  ```

##### 1.2. Props

- **channel**
  The currently active `ErmisChat` channel instance to be loaded into the `Channel` component and referenced by its children.
  ```javascript
  const channel_type = 'team'; // or 'messaging'
  const channel_id = 'b44937e4-c0d4-4a73-847c-3730a923ce83:65c07c7cc7c28e32d8f797c2e13c3e02f1fd';
  const channel = chatClient.channel(channel_type, channel_id);
  ```
  | Type      |
  | :-------- |
  | object    |


- **acceptedFiles**
  A list of accepted file upload types.
  | Type      |
  | :-------- |
  | string[]    |

- **Attachment**
  Custom UI component to display a message attachment.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [Attachment](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Attachment/Attachment.tsx) |

- **AttachmentPreviewList**
  Custom UI component to display an attachment previews in `MessageInput`.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [AttachmentPreviewList](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/AttachmentPreviewList/AttachmentPreviewList.tsx) |

- **AttachmentSelectorInitiationButtonContents**
  Custom UI component for contents of attachment selector initiation button.
  | Type      |
  | :-------- |
  | component    |

- **DateSeparator**
  Custom UI component for date separators.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [DateSeparator](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/DateSeparator/DateSeparator.tsx) |

- **AudioRecorder**
  Custom UI component to display an attachment previews in `MessageInput`.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [AudioRecorder](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MediaRecorder/AudioRecorder/AudioRecorder.tsx) |

- **Avatar**
  Custom UI component to display a user’s avatar.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [Avatar](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Avatar/Avatar.tsx) |

- **channelQueryOptions**
  Optional configuration parameters used for the initial channel query.
  In the example below, we specify, that the first page of messages when a channel is queried should have 20 messages (the default is 100). Note that the channel prop has to be passed along channelQueryOptions.

  ```javascript
  import { ChannelQueryOptions } from "ermis-chat-js-sdk";
  import { Channel, useChatContext } from "ermis-chat-react-sdk";

  const channelQueryOptions: ChannelQueryOptions = {
    messages: { limit: 20 },
  };

  type ChannelRendererProps = {
    id: string;
    type: string;
  };

  const ChannelRenderer = ({ id, type }: ChannelRendererProps) => {
    const { client } = useChatContext();
    return (
      <Channel
        channel={client.channel(type, id)}
        channelQueryOptions={channelQueryOptions}
      >
        {/* Channel children */}
      </Channel>
    );
  };
  ```
- **dragAndDropWindow**
  If true, chat users will be able to drag and drop file uploads to the entire channel window.
  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | `false` |

- **EditMessageInput**
  Custom UI component to override default edit message input.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [EditMessageForm](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/EditMessageForm.tsx) |

- **FileUploadIcon**
  Custom UI component for file upload icon.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [FileUploadIcon](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/icons.tsx) |

- **Input**
  Custom UI component handling how the message input is rendered.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageInputFlat](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/MessageInputFlat.tsx) |

- **Message**
  Custom UI component to display a message in the standard `MessageList`.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageSimple](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/MessageSimple.tsx) |

- **MessageDeleted**
  Custom UI component for a deleted message.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageDeleted](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/MessageDeleted.tsx) | 

- **MessageRepliesCountButton**
  Custom UI component to display message replies.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageRepliesCountButton](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/MessageRepliesCountButton.tsx) |

- **MessageSystem**
  Custom UI component to display system messages.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [EventComponent](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/EventComponent/EventComponent.tsx) |

- **MessageTimestamp**
  Custom UI component to display a timestamp on a message. This does not include a timestamp for edited messages.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageTimestamp](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/MessageTimestamp.tsx) | 

- **Timestamp**
  Custom UI component to display a date used in timestamps. It’s used internally by the default `MessageTimestamp`, and to display a timestamp for edited messages.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [Timestamp](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/Timestamp.tsx) |

- **TypingIndicator**
  Custom UI component for the typing indicator.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [TypingIndicator](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/TypingIndicator/TypingIndicator.tsx) |      

- **ModalGallery**
  Custom UI component for viewing message’s image attachments.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [ModalGallery](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Gallery/ModalGallery.tsx) |            

- **QuotedMessage**
  Custom UI component to override quoted message UI on a sent message.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [QuotedMessage](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/QuotedMessage.tsx) |

- **QuotedMessagePreview**
  Custom UI component to override the message input’s quoted message preview.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [QuotedMessagePreview](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/QuotedMessagePreview.tsx) |


- **ReactionsList**
  Custom UI component to display the list of reactions on a message.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [ReactionsList](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Reactions/ReactionsList.tsx) |

- **SendButton**
  Custom UI component for send button.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [SendButton](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/SendButton.tsx) |    

- **multipleUploads**
  Whether to allow multiple attachment uploads on a message.
  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | `true` |  

- **LoadingErrorIndicator**
  Custom UI component to be shown if the channel query fails.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [ChatDown](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/ChatDown/ChatDown.tsx) |  

- **LoadingIndicator**
  Custom UI component to render while the `MessageList` is loading new messages.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [LoadingChannels](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Loading/LoadingChannels.tsx) |  

- **onMentionsClick**
  Custom action handler function to run on click of an @mention in a message.
  | Type      |
  | :-------- |
  | function    |

#### 2. ChannelHeader
The `ChannelHeader` component displays pertinent information regarding the currently active channel, including image and title.

##### 2.1. Usage
Use this component by adding it as a child of the Channel component. If you want to ‘override’ this component, you simply use your custom component instead.

+ **Example 1**
  ```javascript
  <Channel channel={channel}>
    <ChannelHeader title={"General"} />
  </Channel>
  ```

+ **Example 2** -  using a custom heading component.
  ```javascript
  <Channel channel={channel}>
    <YourCustomChannelHeader />
  </Channel>
  ```

##### 2.2. Props

- **Avatar**
  A custom UI component to display the avatar image.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [Avatar](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Avatar/Avatar.tsx) |  

- **image**
  The displayed image URL for the header, defaults to the `channel` image if there is one.
  | Type      | Default |
  | :-------- | :-------- |
  | string    | the `channel` image | 

- **MenuIcon**
  A custom UI component to display menu icon.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MenuIcon](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/ChannelHeader/icons.tsx) |  

- **title**
  A string to set the title manually, defaults to the `channel` name if there is one.
  | Type      | Default |
  | :-------- | :-------- |
  | string    | the `channel` name | 

#### 3. ChannelActionContext
The `ChannelActionContext` is one of the context providers exposed in the `Channel` component and is consumable by all of the `Channel` children components. The context provides all of the action properties and handlers for a `channel`, and you can access these by calling the `useChannelActionContext` custom hook.

##### 3.1. Usage
Pull values from context with our custom hook:

```javascript
const { sendMessage, editMessage } = useChannelActionContext();
```

##### 3.2. Values

- **addNotification**
  Function to add a temporary notification to `MessageList`, and it will be removed after 5 seconds.
  | Type      |
  | :-------- |
  | function |

- **dispatch**
  The dispatch function for the [ChannelStateReducer](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Channel/channelState.ts).
  | Type      |
  | :-------- |
  | ChannelStateReducerAction |  

- **updateMessage**
  The function to update a `message` on `Channel`, takes a `message` object.
  | Type      |
  | :-------- |
  | function | 

- **sendMessage**
  The function to send a `message` on `Channel`. Takes a `message` object with the basic message information as the first argument, and custom data as the second argument.
  | Type      |
  | :-------- |
  | function | 

- **removeMessage**
  The function to remove a `message` from `MessageList`, handled by the `Channel` component. Takes a `message` object.
  | Type      |
  | :-------- |
  | function |    

- **setQuotedMessage**
  The function to send a `QuotedMessage` on a `Channel`, take a message object.
  | Type      |
  | :-------- |
  | function |

- **loadMore**
  The function to load next page/batch of `messages` (used for pagination).
  | Type      |
  | :-------- |
  | function | 

- **onMentionsClick**
  Custom action handler function to execute when @mention is clicked, takes a DOM click event object and an array of mentioned users.
  | Type      |
  | :-------- |
  | function |    

- **jumpToLatestMessage**
  Used in conjunction with `jumpToMessage`. Restores the position of the message list back to the most recent messages.
  | Type      |
  | :-------- |
  | `() => Promise<void>` | 

- **jumpToMessage**
  When called, `jumpToMessage` causes the current message list to jump to the message with the id specified in the `messageId` parameter. Here’s an example of a button, which, when clicked, searches for a given message and navigates to it:

  ```javascript
  const JumpToMessage = () => {
    const { jumpToMessage } = useChannelActionContext();
    const messageID = "53cd8db1-117e-4409-817c-025a491f2064";

    return (
      <button
        data-testid="jump-to-message"
        onClick={() => {
          jumpToMessage(messageID);
        }}
      >
        Jump to this message
      </button>
    );
  };

  return (
    <Channel channel={channel}>
      <JumpToMessage />
      <Window>
        <MessageList />
      </Window>
    </Channel>
  );
  ```
  | Type      |
  | :-------- |
  | `(messageId: string) => Promise<void>` |          

#### 4. ChannelStateContext
The `ChannelStateContext` is a one of the context providers exposed in the `Channel` component and is consumable by all of the `Channel` children components. The context provides all the state properties and logic for a `channel`, and you can access these by calling the `useChannelStateContext` custom hook.

##### 4.1. Usage
Pull values from context with our custom hook:

```javascript
const { channel } = useChannelStateContext();
```

##### 4.2. Values

- **channel**
  The currently active `ErmisChat` `channel` instance to be loaded into the `Channel` component and referenced by its children.
  | Type      |
  | :-------- |
  | object | 

- **hasMore**
  If the channel has more, older, messages to paginate through.
  | Type      |
  | :-------- |
  | boolean |

- **hasMoreNewer**
  If the channel has more, newer, messages to paginate through.
  | Type      |
  | :-------- |
  | boolean |  

- **members**
  Members of this `channel` (members are permanent, watchers are users who are online right now).
  | Type      |
  | :-------- |
  | object[] |  

- **messages**
  Array of message objects.
  | Type      |
  | :-------- |
  | object[] |

- **quotedMessage**
  An inline message reply to another message.
  | Type      |
  | :-------- |
  | object |  

- **read**
  The read state for each `channel` member.
  | Type      |
  | :-------- |
  | object |  

- **loading**
  Boolean for the `channel` loading state.
  | Type      |
  | :-------- |
  | boolean |

- **loadingMore**
  Boolean for the `channel` loading more messages.
  | Type      |
  | :-------- |
  | boolean |    

### Channel List

#### 1. Channel List

The `ChannelList` component queries an array of `channel` objects from the Ermis Chat API and displays as a customizable list in the UI. It accepts props for `filters`, `sort` and `options`, which allows you to tailor your request to the [Query Channels](https://docs.ermis.network/JavaScript/doc#1-query-channels) API. The response array from this API is then rendered in a list and loaded into the DOM.

```javascript
const channels = await client.queryChannels(filters, sort, options);
```

##### 1.1. Usage
The `ChannelList` does not have any required props, but in order to refine channel query results we recommend providing values for `filters`, `sort` and `options`.

```javascript
const filters = { type: "messaging" }
const sort = { last_message_at: -1 };
const options = { message_limit: 10 }

<Chat client={client}>
  <ChannelList filters={filters} sort={sort} options={options} />
  <Channel>
    <MessageList />
    <MessageInput />
  </Channel>
</Chat>
```

##### 1.2. Props

- **allowNewMessagesFromUnfilteredChannels**
  When the client receives `message.new`, `notification.added_to_channel` events, we automatically push that channel to the top of the list. If the channel doesn’t currently exist in the list, we grab the channel from `client.activeChannels` and push it to the top of the list. You can disable this behavior by setting this prop to false, which will prevent channels not in the list from incrementing the list.
  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | true | 

- **Avatar**
  Custom UI component to display the user’s avatar.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [Avatar](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Avatar/Avatar.tsx) |

- **filters**
  An object containing channel query `filters`, check our [query parameters docs](https://docs.ermis.network/JavaScript/doc#1-query-channels) for more information.
  | Type      |
  | :-------- |
  | object    |

- **sort**
  An object containing channel query `sort`, check our [query parameters docs](https://docs.ermis.network/JavaScript/doc#1-query-channels) for more information.
  | Type      |
  | :-------- |
  | object    |   

- **options**
  An object containing channel query `options`, check our [query parameters docs](https://docs.ermis.network/JavaScript/doc#1-query-channels) for more information.
  | Type      |
  | :-------- |
  | object    |      

- **List**
  Custom UI component to display the container for the queried channels.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [ChannelListMessenger](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/ChannelList/ChannelListMessenger.tsx) |  

- **Preview**
  Custom UI component to display the channel preview in the list.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [ChannelPreviewMessenger](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/ChannelPreview/ChannelPreviewMessenger.tsx) |     

- **customActiveChannel**
  Set a channel (with this ID) to active and force it to move to the top of the list.
  | Type      |
  | :-------- |
  | string    |    

- **EmptyStateIndicator**
  Custom UI component for rendering an empty list.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [EmptyStateIndicator](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/EmptyStateIndicator/EmptyStateIndicator.tsx) |  

- **getLatestMessagePreview**
  Custom function that generates the message preview in ChannelPreview component.
  | Type      |
  | :-------- |
  | (channel: `Channel`, t: `TranslationContextValue`['t'], userLanguage: `TranslationContextValue`['userLanguage']) => string | JSX.Element    |

- **LoadingErrorIndicator**
  Custom UI component to display the loading error indicator.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [ChatDown](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/ChatDown/ChatDown.tsx) |

- **LoadingIndicator**
  Custom UI component to display the loading state.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [LoadingChannels](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Loading/LoadingChannels.tsx) |   

- **onAddedToChannel**
  Function to override the default behavior when a user is added to a channel.
  | Type      |
  | :-------- |
  | function    |

- **onChannelDeleted**
  Function to override the default behavior when a channel is deleted.
  | Type      |
  | :-------- |
  | function    |

- **onChannelTruncated**
  Function to override the default behavior when a channel is truncated.
  | Type      |
  | :-------- |
  | function    |

- **onChannelUpdated**
  Function to override the default behavior when a channel is updated.
  | Type      |
  | :-------- |
  | function    |

- **onMessageNew**
  Function to override the default behavior when a message is received on a channel not being watched.
  | Type      |
  | :-------- |
  | function    |

- **onRemovedFromChannel**
  Function to override the default behavior when a user gets removed from a channel.
  | Type      |
  | :-------- |
  | function    | 

- **Paginator**
  Custom UI component to handle channel pagination logic.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [LoadMorePaginator](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/LoadMore/LoadMorePaginator.tsx) |

- **renderChannels**
  Function to override the default behavior when rendering channels, so this function is called instead of rendering the Preview directly.
  | Type      |
  | :-------- |
  | function    |             

#### 2. ChannelListContext
The context value is provided by `ChannelListContextProvider` which wraps the contents rendered by `ChannelList`. It exposes API that the default and custom components rendered by `ChannelList` can take advantage of. The components that can consume the context are customizable via `ChannelListProps`:
- `Avatar` - component used to display channel image
- `EmptyStateIndicator` - rendered when the channels query returns and empty array
- `LoadingErrorIndicator` - rendered when the channels query fails
- `LoadingIndicator`- rendered during the channels query
- `List` - component rendering `LoadingErrorIndicator`, `LoadingIndicator`, `EmptyStateIndicator`, `Paginator` and the list of channel `Preview` components
- `Paginator` - takes care of requesting to load more channels into the list (pagination)
- `Preview` - renders the information of a channel in the channel list

##### 2.1. Usage
Access the API from context with our custom hook:

```javascript
import { useChannelListContext } from "ermis-chat-react-sdk";

export const CustomComponent = () => {
  const { channels } = useChannelListContext();
  // component logic ...
  return {
    /* rendered elements */
  };
};
```

##### 2.2. Values

- **channels**
  State representing the array of loaded channels. Channels query is executed by default only within the `ChannelList` component in the SDK.
  | Type      |
  | :-------- |
  | `Channel[]`    |

### Message List

#### 1. Message List

The `MessageList` component renders a scrollable list of messages. The UI for each individual message is rendered conditionally based on its message.type value. The list renders date separators, message reactions, new message notifications, system messages, deleted messages, and standard messages containing text and/or attachments.

By default, the `MessageList` loads the most recent 25 messages held in the `channel.state`. More messages are fetched from the Stream Chat API and loaded into the DOM on scrolling up the list. The currently loaded messages are held in the `ChannelStateContext` and can be referenced with our custom hook.

```javascript
const { messages } = useChannelStateContext();
```

##### 1.1. Usage

As a context consumer, the `MessageList` component must be rendered as a child of the `Channel` component. It can be rendered with or without a provided `messages` prop. Providing your own `messages` value will override the default value drawn from the `ChannelStateContext`.

**Example 1** - without messages prop
```javascript
<Chat client={client}>
  <ChannelList />
  <Channel>
    <MessageList />
    <MessageInput />
  </Channel>
</Chat>
```
**Example 2** - with messages prop
```javascript
const customMessages = [
  // array of messages
];

<Chat client={client}>
  <ChannelList />
  <Channel>
    <MessageList messages={customMessages} />
    <MessageInput />
  </Channel>
</Chat>;
```

##### 2.1. Props

- **closeReactionSelectorOnClick**
  If true, picking a reaction from the `ReactionSelector` component will close the selector.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |

- **customMessageActions**
  An object containing custom message actions (key) and function handlers (value). For each custom action a dedicated item (button) in `MessageActionsBox` is rendered. The key is used as a display text inside the button. Therefore, it should not be cryptic but rather bear the end user in mind when formulating it.

  ```javascript
  const customActions = {
    "Copy text": (message) => {
      navigator.clipboard.writeText(message.text || "");
    },
  };

  <MessageList customMessageActions={customActions} />;
  ```

  | Type      |
  | :-------- |
  | object    |

- **disableDateSeparator**
  If true, disables the injection of date separator UI components in the `Channel` `MessageList` component.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |  

- **disableQuotedMessages**
  If true, disables the ability for users to quote messages.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |

- **formatDate**
  Overrides the default date formatting logic, has access to the original date object.

  | Type      |
  | :-------- |
  | `(date: Date) => string`    |  

- **getDeleteMessageErrorNotification**
  Function that returns the notification text to be displayed when the delete message request fails. This function receives the deleted message object as its argument.

  | Type      |
  | :-------- |
  | `(message: StreamMessage) => string`    |

- **getFetchReactionsErrorNotification**
  Function that returns the notification text to be displayed when loading message reactions fails. This function receives the current message object as its argument.

  | Type      |
  | :-------- |
  | `(message: StreamMessage) => string`    |

- **hasMore**
  Whether the list has more items to load.
  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | `ChannelStateContextValue[‘hasMore’]` |

- **loadingMore**
  Whether the list is currently loading more items.
  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | `ChannelStateContextValue[‘loadingMore’]` | 

- **maxTimeBetweenGroupedMessages**
  Maximum time in milliseconds that should occur between messages to still consider them grouped together.
  | Type      |
  | :-------- |
  | number    |      

- **Message**
  Custom UI component to display an individual message.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageSimple](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/MessageSimple.tsx) |     

- **messageActions**
  Array of allowed message actions (ex: ‘edit’, ‘delete’, quote). To disable all actions, provide an empty array.
  | Type      | Default |
  | :-------- | :-------- |
  | array    | [‘edit’, ‘delete’, ‘quote’, ‘react’] | 

- **messageLimit**
  The limit to use when paginating new messages (the page size).
  | Type      | Default |
  | :-------- | :-------- |
  | number    | 100 |     

- **messages**
  The messages to render in the list. Provide your own array to override the data stored in context.
  | Type      | Default |
  | :-------- | :-------- |
  | array    | `ChannelStateContextValue[‘messages’]` | 

- **noGroupByUser**
  If true, turns off message UI grouping by user.
  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |    

#### 2. MessageListContext

The context value is provided by `MessageListContextProvider` which wraps the contents rendered by `MessageList`. It exposes API that the default and custom components rendered by `MessageList` can take advantage of. The components that can consume the context are:

- `EmptyStateIndicator` - rendered when there are no messages in the channel. The component can be customized.
- `LoadingIndicator` - rendered while loading more messages to the channel. The component can be customized.
- `TypingIndicator` - component indicating that another user is typing a message in a given channel. The component can be customized.
- `Message` and its children - component to render a message. The component can be customized.
- `DateSeparator` - component rendered to separate messages posted on different dates. The component can be customized.
- `MessageSystem` - component to display system messages in the message list. The component can be customized.
- `HeaderComponent` - component to be displayed before the oldest message in the message list. The component can be customized.

##### 2.1. Usage
Pull the value from context with our custom hook:
```javascript
import { useMessageListContext } from "ermis-chat-react-sdk";

export const CustomComponent = () => {
  const { listElement, scrollToBottom } = useMessageListContext();
  // component logic ...
  return {
    /* rendered elements */
  };
};
```

##### 2.2. Values
- **listElement**
  The scroll container within which the messages and typing indicator are rendered. You may want to perform scroll-to-bottom operations based on the listElement’s scroll state.

  | Type      |
  | :-------- |
  | `HTMLDivElement`   |  

- **scrollToBottom**
  Function that scrolls the `listElement` to the bottom.

  | Type      |
  | :-------- |
  | `() => void`   |   

### Message

#### 1. Message

The `Message` component is a React Context provider that wraps all the logic, functionality, and UI for the individual messages displayed in a message list. It provides the `MessageContext` to its children. All the message UI components consume the `MessageContext` and rely on the stored data for their display and interaction.

##### 1.1. Usage

The `Message` component is used internally as part of the logic of the `MessageList`. The `MessageList` renders a list of messages and passes each individual `message` object into a `Message` component. Since the component is used internally by default, it only needs to be explicitly imported from the library and used in unique use cases.

##### 1.2. Props

- **message**
  The `ErmisChat` message object, which provides necessary data to the underlying UI components.

  | Type      |
  | :-------- |
  | object   |

- **disableQuotedMessages**
  If true, disables the ability for users to quote messages.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |

- **formatDate**
  Overrides the default date formatting logic, has access to the original date object.

  | Type      |
  | :-------- |
  | (date: Date) => string    |

- **highlighted**
  Whether to highlight and focus the message on load. Used internally in the process of jumping to a message.

  | Type      |
  | :-------- |
  | boolean    |

- **Message**
  Custom UI component to display a message.

  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageSimple](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Message/MessageSimple.tsx) |   

- **messageActions**
  Array of allowed message actions (ex: ‘edit’, ‘delete’, quote). To disable all actions, provide an empty array.
  | Type      | Default |
  | :-------- | :-------- |
  | array    | [‘edit’, ‘delete’, ‘quote’, ‘react’] |

- **messageListRect**
  DOMRect object linked to the parent wrapper div around the `InfiniteScroll` component.

  | Type      |
  | :-------- |
  | DOMRect    |

- **readBy**
  An array of users that have read the current message.

  | Type      |
  | :-------- |
  | array    |    

#### 2. MessageContext

The `MessageContext` is established within the `Message` component. It provides data to the Message UI component and its children. Use the values stored within this context to build a custom Message UI component. You can access the context values by calling the `useMessageContext` custom hook.

##### 2.1. Usage
Pull values from context with our custom hook:

```javascript
const { message } = useMessageContext();
```

##### 2.2. Values

- **actionsEnabled**
  If true, actions such as edit, delete, flag, etc. are enabled on the message.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | true |

- **formatDate**
  Overrides the default date formatting logic, has access to the original date object.

  | Type      |
  | :-------- |
  | (date: Date) => string    |

- **getMessageActions**
  Function that returns an array of the allowed actions on a message by the currently connected user.

  | Type      |
  | :-------- |
  | () => MessageActionsArray    |

- **handleDelete**
  Function that removes a message from the current channel.

  | Type      |
  | :-------- |
  | (event: React.BaseSyntheticEvent) => Promise<void> | void    | 

- **handleReaction**
  Function that adds/removes a reaction on a message.

  | Type      |
  | :-------- |
  | (reactionType: string, event: React.BaseSyntheticEvent) => Promise<void>    |  

- **highlighted**
  Whether to highlight and focus the message on load. Used internally in the process of jumping to a message.

  | Type      |
  | :-------- |
  | boolean    |

- **isMyMessage**
  Function that returns whether or not a message belongs to the current user.

  | Type      |
  | :-------- |
  | () => boolean    |

- **message**
  The `ErmisChat` message object, which provides necessary data to the underlying UI components.

  | Type      |
  | :-------- |
  | object |        

- **messageListRect**
  DOMRect object linked to the parent `MessageList` component.

  | Type      |
  | :-------- |
  | DOMRect    |    

- **readBy**
  An array of users that have read the current message.

  | Type      |
  | :-------- |
  | array    |   

### Message Input
#### 1. Message Input
The `MessageInput` component is a React Context provider that wraps all of the logic, functionality, and UI for the message input displayed in a channel. It provides the `MessageInputContext` to its children. All of the input UI components consume the `MessageInputContext` and rely on the stored data for their display and interaction.

##### 1.1. Usage
As a context consumer, the `MessageInput` component must be rendered as a child of the `Channel` component. `MessageInput` has no required props and calls custom hooks to assemble the context values loaded into the `MessageInputContext` and provided to its children.

```javascript
<Chat client={client}>
  <ChannelList />
  <Channel>
    <MessageList />
    <MessageInput />
  </Channel>
</Chat>
```

##### 1.2. Props
- **disabled**
  If true, disables the text input.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |

- **disableMentions**
  If true, the suggestion list will not display and autocomplete @mentions.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false | 

- **focus**
  If true, focuses the text input on component mount.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |

- **grow**
  If true, expands the text input vertically for new lines.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | true |

- **hideSendButton**
  Allows to hide MessageInput’s send button. Used by `MessageSimple` to hide the send button in `EditMessageForm`.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |        

- **Input**
  Custom UI component handling how the message input is rendered.
  | Type      | Default |
  | :-------- | :-------- |
  | component    | [MessageInputFlat](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/MessageInput/MessageInputFlat.tsx) |

- **maxRows**
  Max number of rows the underlying `textarea` component is allowed to grow.

  | Type      | Default |
  | :-------- | :-------- |
  | number    | 10 |

- **minRows**
  Min number of rows the underlying `textarea` will start with. The `grow` on `MessageInput` prop has to be enabled for `minRows` to take effect.

  | Type      | Default |
  | :-------- | :-------- |
  | number    | 1 |  

- **mentionAllAppUsers**
  If true, the suggestion list will search all app users for an @mention, not just current channel members/watchers.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |   

- **noFiles**
  If true, disables file uploads for all attachments except for those with type ‘image’.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |    

#### 2. MessageInputContext

The `MessageInputContext` is established within the `MessageInput` component. The value is the combination of the `MessageInputProps`, `MessageInputState` (returned by the `useMessageInputState` hook). It provides data to the Input UI component and its children. Use the values stored within this context to build a custom Input UI component. You can access the context values by calling the `useMessageInputContext` custom hook.

##### 2.1. Usage
Pull values from context with our custom hook:

```javascript
const { autocompleteTriggers, handleSubmit } = useMessageInputContext();
```

##### 2.2. Values

- **attachments**
  An array of attachments added to the current message. Every attachment object carries attribute `localMetadata` that is internally used to manage the attachment state in the composer (update, remove attachments from the state, keep reference to uploaded files, keep information about the file upload state). The `localMetadata` object is discarded from each attachment object before sending the resulting message to the server. The attachments array does not contain attachments created by URL enrichment. These scraped attachments are kept in `linkPreviews` map.

  | Type      |
  | :-------- |
  | LocalAttachment[]    |

- **autocompleteTriggers**
  A mapping of the current triggers permitted in the currently active channel.

  | Type      | Default |
  | :-------- | :-------- |
  | object    | `@` - mentions |

- **closeMentionsList**
  Function to manually close the list of potential users to mention.

  | Type      |
  | :-------- |
  | () => void    |   

- **cooldownInterval**
  If slow mode is enabled, the required wait time between messages for each user.

  | Type      |
  | :-------- |
  | number    | 

- **cooldownRemaining**
  If slow mode is enabled, the amount of time remaining before the connected user can send another message.

  | Type      |
  | :-------- |
  | number    | 

- **setCooldownRemaining**
  React state hook function that sets the cooldownRemaining value.

  | Type      |
  | :-------- |
  | `React.Dispatch<React.SetStateAction<number>>`    |    

- **disabled**
  If true, disables the text input.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |

- **disableMentions**
  If true, the suggestion list will not display and autocomplete @mentions.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |   

- **focus**
  If true, focuses the text input on component mount.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |       

- **grow**
  If true, expands the text input vertically for new lines.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | true |

- **handleChange**
  Function that runs onChange to the underlying `textarea` component.

  | Type      |
  | :-------- |
  | `React.ChangeEventHandler<HTMLTextAreaElement>`    |

- **handleEmojiKeyDown**
  Opens the `EmojiPicker` component on Enter or Spacebar key down.

  | Type      |
  | :-------- |
  | `React.KeyboardEventHandler<HTMLSpanElement>`    |

- **handleSubmit**
  Function that runs onSubmit to the underlying `textarea` component.

  | Type      |
  | :-------- |
  | `(event: React.BaseSyntheticEvent, customMessageData?: Message) => void`    |    

- **hideSendButton**
  Allows to hide MessageInput’s send button. Used by `MessageSimple` to hide the send button in `EditMessageForm`. Received from `MessageInputProps`.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false | 

- **insertText**
  Function to insert text into the value of the underlying `textarea` component.

  | Type      |
  | :-------- |
  | (textToInsert: string) => void    | 

- **isUploadEnabled**
  If true, file uploads are enabled in the currently active channel.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | true |     

- **maxRows**
  Max number of rows the underlying `textarea` component is allowed to grow.

  | Type      | Default |
  | :-------- | :-------- |
  | number    | 10 | 

- **mentionAllAppUsers**
  If true, the suggestion list will search all app users for an @mention, not just current channel members/watchers.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |

- **mentioned_users**
  An array of users mentioned in the current message.

  | Type      |
  | :-------- |
  | UserResponse[]    |  

- **minRows**
  Min number of rows the underlying `textarea` will start with. The `grow` on `MessageInput` prop has to be enabled for `minRows` to take effect.

  | Type      | Default |
  | :-------- | :-------- |
  | number    | 1 |  

- **noFiles**
  If true, disables file uploads for all attachments except for those with type ‘image’.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false | 

- **text**
  The current input value of the underlying `textarea` component.

  | Type      |
  | :-------- |
  | string    |  

- **setText**
  Function that overrides and sets the text value of the underlying `textarea` component.

  | Type      |
  | :-------- |
  | (text: string) => void    |   

- **showMentionsList**
  If true, show the list of potential users to mention above the text input.

  | Type      | Default |
  | :-------- | :-------- |
  | boolean    | false |  