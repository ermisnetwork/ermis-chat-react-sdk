import { ReactNode } from 'react';

import type { Attachment } from 'ermis-chat-js-sdk';
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
