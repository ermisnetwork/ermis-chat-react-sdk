import deepequal from 'react-fast-compare';
import emojiRegex from 'emoji-regex';

import type { TFunction } from 'i18next';
import type { MessageResponse, Mute, StreamChat, UserResponse } from 'ermis-chat-js-sdk';
import type { PinPermissions } from './hooks';
import type { MessageProps } from './types';
import type {
  ComponentContextValue,
  CustomMessageActions,
  MessageContextValue,
  StreamMessage,
} from '../../context';
import type { DefaultStreamChatGenerics } from '../../types/types';

/**
 * Following function validates a function which returns notification message.
 * It validates if the first parameter is function and also if return value of function is string or no.
 */
export const validateAndGetMessage = <T extends unknown[]>(
  func: (...args: T) => unknown,
  args: T,
) => {
  if (!func || typeof func !== 'function') return null;

  // below is due to tests passing a single argument
  // rather than an array.
  if (!(args instanceof Array)) {
    // @ts-expect-error
    args = [args];
  }

  const returnValue = func(...args);

  if (typeof returnValue !== 'string') return null;

  return returnValue;
};

/**
 * Tell if the owner of the current message is muted
 */
export const isUserMuted = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  message: StreamMessage<StreamChatGenerics>,
  mutes?: Mute<StreamChatGenerics>[],
) => {
  if (!mutes || !message) return false;

  const userMuted = mutes.filter((el) => el.target.id === message.user?.id);
  return !!userMuted.length;
};

export const MESSAGE_ACTIONS = {
  delete: 'delete',
  edit: 'edit',
  flag: 'flag',
  markUnread: 'markUnread',
  mute: 'mute',
  pin: 'pin',
  quote: 'quote',
  react: 'react',
  reply: 'reply',
};

export type MessageActionsArray<T extends string = string> = Array<
  'delete' | 'edit' | 'flag' | 'mute' | 'pin' | 'quote' | 'react' | 'reply' | T
>;

// @deprecated in favor of `channelCapabilities` - TODO: remove in next major release
export const defaultPinPermissions: PinPermissions = {
  commerce: {
    admin: true,
    anonymous: false,
    channel_member: false,
    channel_moderator: true,
    guest: false,
    member: false,
    moderator: true,
    owner: true,
    user: false,
  },
  gaming: {
    admin: true,
    anonymous: false,
    channel_member: false,
    channel_moderator: true,
    guest: false,
    member: false,
    moderator: true,
    owner: false,
    user: false,
  },
  livestream: {
    admin: true,
    anonymous: false,
    channel_member: false,
    channel_moderator: true,
    guest: false,
    member: false,
    moderator: true,
    owner: true,
    user: false,
  },
  messaging: {
    admin: true,
    anonymous: false,
    channel_member: true,
    channel_moderator: true,
    guest: false,
    member: true,
    moderator: true,
    owner: true,
    user: false,
  },
  team: {
    admin: true,
    anonymous: false,
    channel_member: true,
    channel_moderator: true,
    guest: false,
    member: true,
    moderator: true,
    owner: true,
    user: false,
  },
};

export type Capabilities = {
  canDelete?: boolean;
  canEdit?: boolean;
  canFlag?: boolean;
  canMarkUnread?: boolean;
  canMute?: boolean;
  canPin?: boolean;
  canQuote?: boolean;
  canReact?: boolean;
  canReply?: boolean;
};

export const getMessageActions = (
  actions: MessageActionsArray | boolean,
  {
    canDelete,
    canEdit,
    canFlag,
    canMarkUnread,
    canMute,
    canPin,
    canQuote,
    canReact,
    canReply,
  }: Capabilities,
): MessageActionsArray => {
  const messageActionsAfterPermission: MessageActionsArray = [];
  let messageActions: MessageActionsArray = [];

  if (actions && typeof actions === 'boolean') {
    // If value of actions is true, then populate all the possible values
    messageActions = Object.keys(MESSAGE_ACTIONS);
  } else if (actions && actions.length > 0) {
    messageActions = [...actions];
  } else {
    return [];
  }

  if (canDelete && messageActions.indexOf(MESSAGE_ACTIONS.delete) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.delete);
  }

  if (canEdit && messageActions.indexOf(MESSAGE_ACTIONS.edit) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.edit);
  }

  if (canFlag && messageActions.indexOf(MESSAGE_ACTIONS.flag) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.flag);
  }

  if (canMarkUnread && messageActions.indexOf(MESSAGE_ACTIONS.markUnread) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.markUnread);
  }

  if (canMute && messageActions.indexOf(MESSAGE_ACTIONS.mute) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.mute);
  }

  if (canPin && messageActions.indexOf(MESSAGE_ACTIONS.pin) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.pin);
  }

  if (canQuote && messageActions.indexOf(MESSAGE_ACTIONS.quote) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.quote);
  }

  if (canReact && messageActions.indexOf(MESSAGE_ACTIONS.react) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.react);
  }

  if (canReply && messageActions.indexOf(MESSAGE_ACTIONS.reply) > -1) {
    messageActionsAfterPermission.push(MESSAGE_ACTIONS.reply);
  }

  return messageActionsAfterPermission;
};

export const ACTIONS_NOT_WORKING_IN_THREAD = [
  MESSAGE_ACTIONS.pin,
  MESSAGE_ACTIONS.reply,
  MESSAGE_ACTIONS.markUnread,
];

/**
 * @deprecated use `shouldRenderMessageActions` instead
 */
export const showMessageActionsBox = (
  actions: MessageActionsArray,
  inThread?: boolean | undefined,
) => shouldRenderMessageActions({ inThread, messageActions: actions });

export const shouldRenderMessageActions = <
  SCG extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>({
  customMessageActions,
  CustomMessageActionsList,
  inThread,
  messageActions,
}: {
  messageActions: MessageActionsArray;
  customMessageActions?: CustomMessageActions<SCG>;
  CustomMessageActionsList?: ComponentContextValue<SCG>['CustomMessageActionsList'];
  inThread?: boolean;
}) => {
  if (
    typeof CustomMessageActionsList !== 'undefined' ||
    typeof customMessageActions !== 'undefined'
  )
    return true;

  if (!messageActions.length) return false;

  if (
    inThread &&
    messageActions.filter((action) => !ACTIONS_NOT_WORKING_IN_THREAD.includes(action)).length === 0
  ) {
    return false;
  }

  if (
    messageActions.length === 1 &&
    (messageActions.includes(MESSAGE_ACTIONS.react) ||
      messageActions.includes(MESSAGE_ACTIONS.reply))
  ) {
    return false;
  }

  if (
    messageActions.length === 2 &&
    messageActions.includes(MESSAGE_ACTIONS.react) &&
    messageActions.includes(MESSAGE_ACTIONS.reply)
  ) {
    return false;
  }

  return true;
};

function areMessagesEqual<
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  prevMessage: StreamMessage<StreamChatGenerics>,
  nextMessage: StreamMessage<StreamChatGenerics>,
): boolean {
  return (
    prevMessage.deleted_at === nextMessage.deleted_at &&
    prevMessage.latest_reactions?.length === nextMessage.latest_reactions?.length &&
    prevMessage.own_reactions?.length === nextMessage.own_reactions?.length &&
    prevMessage.pinned === nextMessage.pinned &&
    prevMessage.reply_count === nextMessage.reply_count &&
    prevMessage.status === nextMessage.status &&
    prevMessage.text === nextMessage.text &&
    prevMessage.type === nextMessage.type &&
    prevMessage.updated_at === nextMessage.updated_at &&
    prevMessage.user?.updated_at === nextMessage.user?.updated_at &&
    Boolean(prevMessage.quoted_message) === Boolean(nextMessage.quoted_message) &&
    (!prevMessage.quoted_message ||
      areMessagesEqual(
        prevMessage.quoted_message as StreamMessage<StreamChatGenerics>,
        nextMessage.quoted_message as StreamMessage<StreamChatGenerics>,
      ))
  );
}

export const areMessagePropsEqual = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  prevProps: MessageProps<StreamChatGenerics> & {
    mutes?: Mute<StreamChatGenerics>[];
    showDetailedReactions?: boolean;
  },
  nextProps: MessageProps<StreamChatGenerics> & {
    mutes?: Mute<StreamChatGenerics>[];
    showDetailedReactions?: boolean;
  },
) => {
  const { message: prevMessage, Message: prevMessageUI } = prevProps;
  const { message: nextMessage, Message: nextMessageUI } = nextProps;

  if (prevMessageUI !== nextMessageUI) return false;
  if (prevProps.endOfGroup !== nextProps.endOfGroup) return false;

  if (nextProps.showDetailedReactions !== prevProps.showDetailedReactions) {
    return false;
  }

  if (nextProps.closeReactionSelectorOnClick !== prevProps.closeReactionSelectorOnClick) {
    return false;
  }

  const messagesAreEqual = areMessagesEqual(prevMessage, nextMessage);
  if (!messagesAreEqual) return false;

  const deepEqualProps =
    deepequal(nextProps.messageActions, prevProps.messageActions) &&
    deepequal(nextProps.readBy, prevProps.readBy) &&
    deepequal(nextProps.highlighted, prevProps.highlighted) &&
    deepequal(nextProps.groupStyles, prevProps.groupStyles) && // last 3 messages can have different group styles
    deepequal(nextProps.mutes, prevProps.mutes) &&
    deepequal(nextProps.lastReceivedId, prevProps.lastReceivedId);

  if (!deepEqualProps) return false;

  return (
    prevProps.messageListRect === nextProps.messageListRect // MessageList wrapper layout changes
  );
};

export const areMessageUIPropsEqual = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  prevProps: MessageContextValue<StreamChatGenerics> & {
    showDetailedReactions?: boolean;
  },
  nextProps: MessageContextValue<StreamChatGenerics> & {
    showDetailedReactions?: boolean;
  },
) => {
  const { lastReceivedId: prevLastReceivedId, message: prevMessage } = prevProps;
  const { lastReceivedId: nextLastReceivedId, message: nextMessage } = nextProps;

  if (prevProps.editing !== nextProps.editing) return false;
  if (prevProps.highlighted !== nextProps.highlighted) return false;
  if (prevProps.endOfGroup !== nextProps.endOfGroup) return false;
  if (prevProps.mutes?.length !== nextProps.mutes?.length) return false;
  if (prevProps.readBy?.length !== nextProps.readBy?.length) return false;
  if (prevProps.groupStyles !== nextProps.groupStyles) return false;

  if (prevProps.showDetailedReactions !== nextProps.showDetailedReactions) {
    return false;
  }

  if (
    (prevMessage.id === prevLastReceivedId || prevMessage.id === nextLastReceivedId) &&
    prevLastReceivedId !== nextLastReceivedId
  ) {
    return false;
  }

  return areMessagesEqual(prevMessage, nextMessage);
};

export const messageHasReactions = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  message?: StreamMessage<StreamChatGenerics>,
) => Object.values(message?.reaction_groups ?? {}).some(({ count }) => count > 0);

export const messageHasAttachments = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  message?: StreamMessage<StreamChatGenerics>,
) => !!message?.attachments && !!message.attachments.length;

export const getImages = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  message?: MessageResponse<StreamChatGenerics>,
) => {
  if (!message?.attachments) {
    return [];
  }
  return message.attachments.filter((item) => item.type === 'image');
};

export const getNonImageAttachments = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  message?: MessageResponse<StreamChatGenerics>,
) => {
  if (!message?.attachments) {
    return [];
  }
  return message.attachments.filter((item) => item.type !== 'image');
};

export interface TooltipUsernameMapper {
  <StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics>(
    user: UserResponse<StreamChatGenerics>,
  ): string;
}

/**
 * Default Tooltip Username mapper implementation.
 *
 * @param user the user.
 */
export const mapToUserNameOrId: TooltipUsernameMapper = (user) => user.name || user.id;

export const getReadByTooltipText = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  users: UserResponse<StreamChatGenerics>[],
  t: TFunction,
  client: StreamChat<StreamChatGenerics>,
  tooltipUserNameMapper: TooltipUsernameMapper,
) => {
  let outStr = '';

  if (!t) {
    throw new Error('getReadByTooltipText was called, but translation function is not available');
  }

  if (!tooltipUserNameMapper) {
    throw new Error(
      'getReadByTooltipText was called, but tooltipUserNameMapper function is not available',
    );
  }
  // first filter out client user, so restLength won't count it
  const otherUsers = users
    .filter((item) => item && client?.user && item.id !== client.user.id)
    .map(tooltipUserNameMapper);

  const slicedArr = otherUsers.slice(0, 5);
  const restLength = otherUsers.length - slicedArr.length;

  if (slicedArr.length === 1) {
    outStr = `${slicedArr[0]} `;
  } else if (slicedArr.length === 2) {
    // joins all with "and" but =no commas
    // example: "bob and sam"
    outStr = t('{{ firstUser }} and {{ secondUser }}', {
      firstUser: slicedArr[0],
      secondUser: slicedArr[1],
    });
  } else if (slicedArr.length > 2) {
    // joins all with commas, but last one gets ", and" (oxford comma!)
    // example: "bob, joe, sam and 4 more"
    if (restLength === 0) {
      // mutate slicedArr to remove last user to display it separately
      const lastUser = slicedArr.splice(slicedArr.length - 1, 1);
      outStr = t('{{ commaSeparatedUsers }}, and {{ lastUser }}', {
        commaSeparatedUsers: slicedArr.join(', '),
        lastUser,
      });
    } else {
      outStr = t('{{ commaSeparatedUsers }} and {{ moreCount }} more', {
        commaSeparatedUsers: slicedArr.join(', '),
        moreCount: restLength,
      });
    }
  }

  return outStr;
};

export const isOnlyEmojis = (text?: string) => {
  if (!text) return false;

  const noEmojis = text.replace(emojiRegex(), '');
  const noSpace = noEmojis.replace(/[\s\n]/gm, '');

  return !noSpace;
};

export const isMessageBounced = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  message: Pick<StreamMessage<StreamChatGenerics>, 'type' | 'moderation_details'>,
) =>
  message.type === 'error' &&
  message.moderation_details?.action === 'MESSAGE_RESPONSE_ACTION_BOUNCE';

export const isMessageEdited = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  message: Pick<StreamMessage<StreamChatGenerics>, 'message_text_updated_at'>,
) => !!message.message_text_updated_at;
