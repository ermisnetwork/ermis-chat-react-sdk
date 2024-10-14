import type { Attachment, DefaultGenerics, ExtendableGenerics, OGAttachment } from 'ermis-chat-js-sdk';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type AttachmentLoadingState = 'uploading' | 'finished' | 'failed';

export type FileUpload = {
  file: {
    name: string;
    lastModified?: number;
    lastModifiedDate?: Date;
    size?: number;
    type?: string;
    uri?: string;
  };
  id: string;
  state: AttachmentLoadingState;
  thumb_url?: string;
  url?: string;
};
export type ImageUpload<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  file: {
    name: string;
    height?: number;
    lastModified?: number;
    lastModifiedDate?: Date;
    size?: number;
    type?: string;
    uri?: string;
    width?: number;
  };
  id: string;
  state: AttachmentLoadingState;
  previewUri?: string;
  url?: string;
} & Pick<
  Attachment<ErmisChatGenerics>,
  'og_scrape_url' | 'title' | 'title_link' | 'author_name' | 'text'
>;

export enum LinkPreviewState {
  /** Link preview has been dismissed using MessageInputContextValue.dismissLinkPreview **/
  DISMISSED = 'dismissed',
  /** Link preview could not be loaded, the enrichment request has failed. **/
  FAILED = 'failed',
  /** Link preview has been successfully loaded. **/
  LOADED = 'loaded',
  /** The enrichment query is in progress for a given link. **/
  LOADING = 'loading',
  /** The link is scheduled for enrichment. **/
  QUEUED = 'queued',
}

export type LinkURL = string;

export type LinkPreview = OGAttachment & {
  state: LinkPreviewState;
};

export enum SetLinkPreviewMode {
  UPSERT,
  SET,
  REMOVE,
}

export type LinkPreviewMap = Map<LinkURL, LinkPreview>;

export type VoiceRecordingAttachment<
  ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics
> = Attachment<ErmisChatGenerics> & {
  asset_url: string;
  type: 'voiceRecording';
  duration?: number;
  file_size?: number;
  mime_type?: string;
  title?: string;
  waveform_data?: Array<number>;
};

type FileAttachment<
  ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics
> = Attachment<ErmisChatGenerics> & {
  type: 'file';
  asset_url?: string;
  file_size?: number;
  mime_type?: string;
  title?: string;
};

export type AudioAttachment<
  ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics
> = Attachment<ErmisChatGenerics> & {
  type: 'audio';
  asset_url?: string;
  file_size?: number;
  mime_type?: string;
  title?: string;
};

export type VideoAttachment<
  ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics
> = Attachment<ErmisChatGenerics> & {
  type: 'video';
  asset_url?: string;
  mime_type?: string;
  thumb_url?: string;
  title?: string;
};

type ImageAttachment<
  ErmisChatGenerics extends ExtendableGenerics = DefaultGenerics
> = Attachment<ErmisChatGenerics> & {
  type: 'image';
  fallback?: string;
  image_url?: string;
  original_height?: number;
  original_width?: number;
};

export type BaseLocalAttachmentMetadata = {
  id: string;
};

export type LocalAttachmentUploadMetadata = {
  file?: File;
  uploadState?: AttachmentLoadingState;
};

export type LocalImageAttachmentUploadMetadata = LocalAttachmentUploadMetadata & {
  previewUri?: string;
};

export type LocalAttachmentCast<A, L = Record<string, unknown>> = A & {
  localMetadata: L & BaseLocalAttachmentMetadata;
};

export type LocalAttachmentMetadata<
  CustomLocalMetadata = Record<string, unknown>
> = CustomLocalMetadata & BaseLocalAttachmentMetadata & LocalImageAttachmentUploadMetadata;

export type LocalVoiceRecordingAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = LocalAttachmentCast<
  VoiceRecordingAttachment<ErmisChatGenerics>,
  LocalAttachmentUploadMetadata & CustomLocalMetadata
>;

export type LocalAudioAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = LocalAttachmentCast<
  AudioAttachment<ErmisChatGenerics>,
  LocalAttachmentUploadMetadata & CustomLocalMetadata
>;

export type LocalVideoAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = LocalAttachmentCast<
  VideoAttachment<ErmisChatGenerics>,
  LocalAttachmentUploadMetadata & CustomLocalMetadata
>;

export type LocalImageAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = LocalAttachmentCast<
  ImageAttachment<ErmisChatGenerics>,
  LocalImageAttachmentUploadMetadata & CustomLocalMetadata
>;

export type LocalFileAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = LocalAttachmentCast<
  FileAttachment<ErmisChatGenerics>,
  LocalAttachmentUploadMetadata & CustomLocalMetadata
>;

export type AnyLocalAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics,
  CustomLocalMetadata = Record<string, unknown>
> = LocalAttachmentCast<
  Attachment<ErmisChatGenerics>,
  LocalAttachmentMetadata<CustomLocalMetadata>
>;

export type LocalAttachment<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> =
  | AnyLocalAttachment<ErmisChatGenerics>
  | LocalFileAttachment<ErmisChatGenerics>
  | LocalImageAttachment<ErmisChatGenerics>
  | LocalAudioAttachment<ErmisChatGenerics>
  | LocalVideoAttachment<ErmisChatGenerics>
  | LocalVoiceRecordingAttachment<ErmisChatGenerics>;
