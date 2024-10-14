import React, { useMemo } from 'react';
import type { ReactPlayerProps } from 'react-player';
import type { Attachment as StreamAttachment } from 'ermis-chat-js-sdk';

import {
  GroupedRenderedAttachment,
  isAudioAttachment,
  isFileAttachment,
  isMediaAttachment,
  isScrapedContent,
  isUploadedImage,
  isVoiceRecordingAttachment,
} from './utils';

import {
  AudioContainer,
  CardContainer,
  FileContainer,
  GalleryContainer,
  ImageContainer,
  MediaContainer,
  UnsupportedAttachmentContainer,
  VoiceRecordingContainer,
} from './AttachmentContainer';

import type { AttachmentActionsProps } from './AttachmentActions';
import type { AudioProps } from './Audio';
import type { VoiceRecordingProps } from './VoiceRecording';
import type { CardProps } from './Card';
import type { FileAttachmentProps } from './FileAttachment';
import type { GalleryProps, ImageProps } from '../Gallery';
import type { UnsupportedAttachmentProps } from './UnsupportedAttachment';
import type { ActionHandlerReturnType } from '../Message/hooks/useActionHandler';

import type { DefaultErmisChatGenerics } from '../../types/types';

const CONTAINER_MAP = {
  audio: AudioContainer,
  card: CardContainer,
  file: FileContainer,
  media: MediaContainer,
  unsupported: UnsupportedAttachmentContainer,
  voiceRecording: VoiceRecordingContainer,
} as const;

export const ATTACHMENT_GROUPS_ORDER = [
  'card',
  'gallery',
  'image',
  'media',
  'audio',
  'voiceRecording',
  'file',
  'unsupported',
] as const;

export type AttachmentProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** The message attachments to render, see [attachment structure] **/
  attachments: StreamAttachment<ErmisChatGenerics>[];
  /**	The handler function to call when an action is performed on an attachment, examples include canceling a \/giphy command or shuffling the results. */
  actionHandler?: ActionHandlerReturnType;
  /** Custom UI component for displaying attachment actions, defaults to and accepts same props as: [AttachmentActions](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Attachment/AttachmentActions.tsx) */
  AttachmentActions?: React.ComponentType<AttachmentActionsProps<ErmisChatGenerics>>;
  /** Custom UI component for displaying an audio type attachment, defaults to and accepts same props as: [Audio](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Attachment/Audio.tsx) */
  Audio?: React.ComponentType<AudioProps<ErmisChatGenerics>>;
  /** Custom UI component for displaying a card type attachment, defaults to and accepts same props as: [Card](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Attachment/Card.tsx) */
  Card?: React.ComponentType<CardProps>;
  /** Custom UI component for displaying a file type attachment, defaults to and accepts same props as: [File](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Attachment/FileAttachment.tsx) */
  File?: React.ComponentType<FileAttachmentProps<ErmisChatGenerics>>;
  /** Custom UI component for displaying a gallery of image type attachments, defaults to and accepts same props as: [Gallery](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Gallery/Gallery.tsx) */
  Gallery?: React.ComponentType<GalleryProps<ErmisChatGenerics>>;
  /** Custom UI component for displaying an image type attachment, defaults to and accepts same props as: [Image](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Gallery/Image.tsx) */
  Image?: React.ComponentType<ImageProps>;
  /** Optional flag to signal that an attachment is a displayed as a part of a quoted message */
  isQuoted?: boolean;
  /** Custom UI component for displaying a media type attachment, defaults to `ReactPlayer` from 'react-player' */
  Media?: React.ComponentType<ReactPlayerProps>;
  /** Custom UI component for displaying unsupported attachment types, defaults to NullComponent */
  UnsupportedAttachment?: React.ComponentType<UnsupportedAttachmentProps>;
  /** Custom UI component for displaying an audio recording attachment, defaults to and accepts same props as: [VoiceRecording](https://github.com/ermisnetwork/ermis-chat-react-sdk/blob/master/src/components/Attachment/VoiceRecording.tsx) */
  VoiceRecording?: React.ComponentType<VoiceRecordingProps<ErmisChatGenerics>>;
};

/**
 * A component used for rendering message attachments. By default, the component supports: AttachmentActions, Audio, Card, File, Gallery, Image, and Video
 */
export const Attachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: AttachmentProps<ErmisChatGenerics>,
) => {
  const { attachments } = props;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const groupedAttachments = useMemo(() => renderGroupedAttachments(props), [attachments]);

  return (
    <div className='str-chat__attachment-list'>
      {ATTACHMENT_GROUPS_ORDER.reduce(
        (acc, groupName) => [...acc, ...groupedAttachments[groupName]],
        [] as React.ReactNode[],
      )}
    </div>
  );
};

const renderGroupedAttachments = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  attachments,
  ...rest
}: AttachmentProps<ErmisChatGenerics>): GroupedRenderedAttachment => {
  const uploadedImages: StreamAttachment<ErmisChatGenerics>[] = attachments.filter((attachment) =>
    isUploadedImage(attachment),
  );

  const containers = attachments
    .filter((attachment) => !isUploadedImage(attachment))
    .reduce<GroupedRenderedAttachment>(
      (typeMap, attachment) => {
        const attachmentType = getAttachmentType(attachment);

        const Container = CONTAINER_MAP[attachmentType];
        typeMap[attachmentType].push(
          <Container
            key={`${attachmentType}-${typeMap[attachmentType].length}`}
            {...rest}
            attachment={attachment}
          />,
        );

        return typeMap;
      },
      {
        audio: [],
        card: [],
        file: [],
        media: [],
        unsupported: [],
        // not used in reduce
        // eslint-disable-next-line sort-keys
        image: [],
        // eslint-disable-next-line sort-keys
        gallery: [],
        voiceRecording: [],
      },
    );

  if (uploadedImages.length > 1) {
    containers['gallery'] = [
      <GalleryContainer
        key='gallery-container'
        {...rest}
        attachment={{
          images: uploadedImages,
          type: 'gallery',
        }}
      />,
    ];
  } else if (uploadedImages.length === 1) {
    containers['image'] = [
      <ImageContainer key='image-container' {...rest} attachment={uploadedImages[0]} />,
    ];
  }

  return containers;
};

const getAttachmentType = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: AttachmentProps<ErmisChatGenerics>['attachments'][number],
): keyof typeof CONTAINER_MAP => {
  if (isScrapedContent(attachment)) {
    return 'card';
  } else if (isMediaAttachment(attachment)) {
    return 'media';
  } else if (isAudioAttachment(attachment)) {
    return 'audio';
  } else if (isVoiceRecordingAttachment(attachment)) {
    return 'voiceRecording';
  } else if (isFileAttachment(attachment)) {
    return 'file';
  }

  return 'unsupported';
};
