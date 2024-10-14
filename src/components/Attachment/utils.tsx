import React, { PropsWithChildren, ReactNode } from 'react';
import ReactPlayer from 'react-player';
import clsx from 'clsx';

import { AttachmentActions as DefaultAttachmentActions } from './AttachmentActions';
import { Audio as DefaultAudio } from './Audio';
import { Card as DefaultCard } from './Card';
import { FileAttachment as DefaultFile } from './FileAttachment';
import { Gallery as DefaultGallery, ImageComponent as DefaultImage } from '../Gallery';

import type { Attachment } from 'stream-chat';
import type { ATTACHMENT_GROUPS_ORDER, AttachmentProps } from './Attachment';
import type { DefaultErmisChatGenerics, UnknownType } from '../../types/types';
import type {
  LocalAttachment,
  LocalAudioAttachment,
  LocalFileAttachment,
  LocalImageAttachment,
  LocalVideoAttachment,
  LocalVoiceRecordingAttachment,
  VoiceRecordingAttachment,
} from '../MessageInput';

export const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/ogg', 'video/webm', 'video/quicktime'];

export type AttachmentComponentType = typeof ATTACHMENT_GROUPS_ORDER[number];

export type GroupedRenderedAttachment = Record<AttachmentComponentType, ReactNode[]>;

export type GalleryAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  images: Attachment<ErmisChatGenerics>[];
  type: 'gallery';
};

export type AttachmentContainerProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  attachment: Attachment<ErmisChatGenerics> | GalleryAttachment<ErmisChatGenerics>;
  componentType: AttachmentComponentType;
};

export type RenderAttachmentProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Omit<AttachmentProps<ErmisChatGenerics>, 'attachments'> & {
  attachment: Attachment<ErmisChatGenerics>;
};

export type RenderGalleryProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Omit<AttachmentProps<ErmisChatGenerics>, 'attachments'> & {
  attachment: GalleryAttachment<ErmisChatGenerics>;
};

export const isLocalAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: UnknownType,
): attachment is LocalAttachment<ErmisChatGenerics> =>
  !!(attachment.localMetadata as LocalAttachment)?.id;

export const isScrapedContent = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics>,
) => attachment.og_scrape_url || attachment.title_link;

export const isUploadedImage = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics>,
) => attachment.type === 'image' && !isScrapedContent(attachment);

export const isLocalImageAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
): attachment is LocalImageAttachment<ErmisChatGenerics> =>
  isUploadedImage(attachment) && isLocalAttachment(attachment);

export const isGalleryAttachmentType = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  output: Attachment<ErmisChatGenerics> | GalleryAttachment<ErmisChatGenerics>,
): output is GalleryAttachment<ErmisChatGenerics> => Array.isArray(output.images);

export const isAudioAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
) => attachment.type === 'audio';

export const isLocalAudioAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
): attachment is LocalAudioAttachment<ErmisChatGenerics> =>
  isAudioAttachment(attachment) && isLocalAttachment(attachment);

export const isVoiceRecordingAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
): attachment is VoiceRecordingAttachment => attachment.type === 'voiceRecording';

export const isLocalVoiceRecordingAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
): attachment is LocalVoiceRecordingAttachment<ErmisChatGenerics> =>
  isVoiceRecordingAttachment(attachment) && isLocalAttachment(attachment);

export const isFileAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
) =>
  attachment.type === 'file' ||
  !!(
    attachment.mime_type &&
    SUPPORTED_VIDEO_FORMATS.indexOf(attachment.mime_type) === -1 &&
    attachment.type !== 'video'
  );

export const isLocalFileAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
): attachment is LocalFileAttachment<ErmisChatGenerics> =>
  isFileAttachment(attachment) && isLocalAttachment(attachment);

export const isMediaAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
) =>
  (attachment.mime_type && SUPPORTED_VIDEO_FORMATS.indexOf(attachment.mime_type) !== -1) ||
  attachment.type === 'video';

export const isLocalMediaAttachment = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  attachment: Attachment<ErmisChatGenerics> | LocalAttachment<ErmisChatGenerics>,
): attachment is LocalVideoAttachment<ErmisChatGenerics> =>
  isMediaAttachment(attachment) && isLocalAttachment(attachment);

export const isSvgAttachment = (attachment: Attachment) => {
  const filename = attachment.fallback || '';
  return filename.toLowerCase().endsWith('.svg');
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/AttachmentWithinContainer`
 */
export const renderAttachmentWithinContainer = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: PropsWithChildren<AttachmentContainerProps<ErmisChatGenerics>>,
) => {
  const { attachment, children, componentType } = props;
  const isGAT = isGalleryAttachmentType(attachment);
  let extra = '';

  if (!isGAT) {
    extra =
      componentType === 'card' && !attachment?.image_url && !attachment?.thumb_url
        ? 'no-image'
        : attachment?.actions?.length
        ? 'actions'
        : '';
  }

  const classNames = clsx('str-chat__message-attachment', {
    [`str-chat__message-attachment--${componentType}`]: componentType,
    [`str-chat__message-attachment--${attachment?.type}`]: attachment?.type,
    [`str-chat__message-attachment--${componentType}--${extra}`]: componentType && extra,
    'str-chat__message-attachment--svg-image': isSvgAttachment(attachment),
    'str-chat__message-attachment-with-actions': extra === 'actions', // added for theme V2 (better readability)
  });

  return <div className={classNames}>{children}</div>;
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/AttachmentActionsContainer`
 */
export const renderAttachmentActions = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: RenderAttachmentProps<ErmisChatGenerics>,
) => {
  const { actionHandler, attachment, AttachmentActions = DefaultAttachmentActions } = props;

  if (!attachment.actions?.length) return null;

  return (
    <AttachmentActions
      {...attachment}
      actionHandler={(event, name, value) => actionHandler?.(event, name, value)}
      actions={attachment.actions}
      id={attachment.id || ''}
      key={`key-actions-${attachment.id}`}
      text={attachment.text || ''}
    />
  );
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/GalleryContainer`
 */
export const renderGallery = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: RenderGalleryProps<ErmisChatGenerics>,
) => {
  const { attachment, Gallery = DefaultGallery } = props;

  return renderAttachmentWithinContainer({
    attachment,
    children: <Gallery images={attachment.images || []} key='gallery' />,
    componentType: 'gallery',
  });
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/ImageContainer`
 */
export const renderImage = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: RenderAttachmentProps<ErmisChatGenerics>,
) => {
  const { attachment, Image = DefaultImage } = props;

  if (attachment.actions && attachment.actions.length) {
    return renderAttachmentWithinContainer({
      attachment,
      children: (
        <div className='str-chat__attachment' key={`key-image-${attachment.id}`}>
          {<Image {...attachment} />}
          {renderAttachmentActions(props)}
        </div>
      ),
      componentType: 'image',
    });
  }

  return renderAttachmentWithinContainer({
    attachment,
    children: <Image {...attachment} key={`key-image-${attachment.id}`} />,
    componentType: 'image',
  });
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/CardContainer`
 */
export const renderCard = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: RenderAttachmentProps<ErmisChatGenerics>,
) => {
  const { attachment, Card = DefaultCard } = props;

  if (attachment.actions && attachment.actions.length) {
    return renderAttachmentWithinContainer({
      attachment,
      children: (
        <div className='str-chat__attachment' key={`key-image-${attachment.id}`}>
          <Card {...attachment} key={`key-card-${attachment.id}`} />
          {renderAttachmentActions(props)}
        </div>
      ),
      componentType: 'card',
    });
  }

  return renderAttachmentWithinContainer({
    attachment,
    children: <Card {...attachment} key={`key-card-${attachment.id}`} />,
    componentType: 'card',
  });
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/FileContainer`
 */
export const renderFile = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: RenderAttachmentProps<ErmisChatGenerics>,
) => {
  const { attachment, File = DefaultFile } = props;

  if (!attachment.asset_url) return null;

  return renderAttachmentWithinContainer({
    attachment,
    children: <File attachment={attachment} key={`key-file-${attachment.id}`} />,
    componentType: 'file',
  });
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/AudioContainer`
 */
export const renderAudio = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: RenderAttachmentProps<ErmisChatGenerics>,
) => {
  const { attachment, Audio = DefaultAudio } = props;

  return renderAttachmentWithinContainer({
    attachment,
    children: (
      <div className='str-chat__attachment' key={`key-video-${attachment.id}`}>
        <Audio og={attachment} />
      </div>
    ),
    componentType: 'audio',
  });
};

/**
 * @deprecated will be removed in the next major release,
 * replaced with the proper component equivalent `AttachmentContainer/MediaContainer`
 */
export const renderMedia = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: RenderAttachmentProps<ErmisChatGenerics>,
) => {
  const { attachment, Media = ReactPlayer } = props;

  if (attachment.actions?.length) {
    return renderAttachmentWithinContainer({
      attachment,
      children: (
        <div
          className='str-chat__attachment str-chat__attachment-media'
          key={`key-video-${attachment.id}`}
        >
          <div className='str-chat__player-wrapper'>
            <Media
              className='react-player'
              controls
              height='100%'
              url={attachment.asset_url}
              width='100%'
            />
          </div>
          {renderAttachmentActions(props)}
        </div>
      ),
      componentType: 'media',
    });
  }

  return renderAttachmentWithinContainer({
    attachment,
    children: (
      <div className='str-chat__player-wrapper' key={`key-video-${attachment.id}`}>
        <Media
          className='react-player'
          controls
          height='100%'
          url={attachment.asset_url}
          width='100%'
        />
      </div>
    ),
    componentType: 'media',
  });
};

export const divMod = (num: number, divisor: number) => [Math.floor(num / divisor), num % divisor];

export const displayDuration = (totalSeconds?: number) => {
  if (!totalSeconds || totalSeconds < 0) return '00:00';

  const [hours, hoursLeftover] = divMod(totalSeconds, 3600);
  const [minutes, seconds] = divMod(hoursLeftover, 60);
  const roundedSeconds = Math.ceil(seconds);

  const prependHrsZero = hours.toString().length === 1 ? '0' : '';
  const prependMinZero = minutes.toString().length === 1 ? '0' : '';
  const prependSecZero = roundedSeconds.toString().length === 1 ? '0' : '';
  const minSec = `${prependMinZero}${minutes}:${prependSecZero}${roundedSeconds}`;

  return hours ? `${prependHrsZero}${hours}:` + minSec : minSec;
};
