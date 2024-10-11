import React from 'react';

import ReactMarkdown from 'react-markdown';

import type { Channel, TranslationLanguages, UserResponse } from 'ermis-chat-js-sdk';

import type { TranslationContextValue } from '../../context/TranslationContext';

import type { DefaultErmisChatGenerics } from '../../types/types';

export const renderPreviewText = (text: string) => <ReactMarkdown skipHtml>{text}</ReactMarkdown>;

export const getLatestMessagePreview = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  channel: Channel<ErmisChatGenerics>,
  t: TranslationContextValue['t'],
  userLanguage: TranslationContextValue['userLanguage'] = 'en',
): string | JSX.Element => {
  const latestMessage = channel.state.messages[channel.state.messages.length - 1];

  const previewTextToRender =
    latestMessage?.i18n?.[`${userLanguage}_text` as `${TranslationLanguages}_text`] ||
    latestMessage?.text;

  if (!latestMessage) {
    return t('Nothing yet...');
  }

  if (latestMessage.deleted_at) {
    return t('Message deleted');
  }

  if (previewTextToRender) {
    const renderedText = renderPreviewText(previewTextToRender);
    return renderedText;
  }

  if (latestMessage.command) {
    return `/${latestMessage.command}`;
  }

  if (latestMessage.attachments?.length) {
    return t('🏙 Attachment...');
  }

  return t('Empty message...');
};

const getChannelDisplayInfo = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  info: 'name' | 'image',
  channel: Channel<ErmisChatGenerics>,
  currentUser?: UserResponse<ErmisChatGenerics>,
) => {
  if (channel.data?.[info]) return channel.data[info];
  const members = Object.values(channel.state.members);
  if (members.length !== 2) return;
  const otherMember = members.find((member) => member.user?.id !== currentUser?.id);
  return otherMember?.user?.[info];
};

export const getDisplayTitle = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  channel: Channel<ErmisChatGenerics>,
  currentUser?: UserResponse<ErmisChatGenerics>,
) => getChannelDisplayInfo('name', channel, currentUser);

export const getDisplayImage = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  channel: Channel<ErmisChatGenerics>,
  currentUser?: UserResponse<ErmisChatGenerics>,
) => getChannelDisplayInfo('image', channel, currentUser);
