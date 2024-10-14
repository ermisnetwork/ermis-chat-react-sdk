import React, { PropsWithChildren, useContext } from 'react';

import type {
  Channel,
  ChannelConfigWithInfo,
  MessageResponse,
  Mute,
  ChannelState as StreamChannelState,
} from 'stream-chat';

import type {
  ChannelUnreadUiState,
  DefaultErmisChatGenerics,
  GiphyVersions,
  ImageAttachmentSizeHandler,
  UnknownType,
  VideoAttachmentSizeHandler,
} from '../types/types';
import type { URLEnrichmentConfig } from '../components/MessageInput/hooks/useLinkPreviews';

export type ChannelNotifications = Array<{
  id: string;
  text: string;
  type: 'success' | 'error';
}>;

export type StreamMessage<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> =
  | ReturnType<StreamChannelState<ErmisChatGenerics>['formatMessage']>
  | MessageResponse<ErmisChatGenerics>;

export type ChannelState<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  suppressAutoscroll: boolean;
  error?: Error | null;
  hasMore?: boolean;
  hasMoreNewer?: boolean;
  highlightedMessageId?: string;
  loading?: boolean;
  loadingMore?: boolean;
  loadingMoreNewer?: boolean;
  members?: StreamChannelState<ErmisChatGenerics>['members'];
  messages?: StreamMessage<ErmisChatGenerics>[];
  pinnedMessages?: StreamMessage<ErmisChatGenerics>[];
  quotedMessage?: StreamMessage<ErmisChatGenerics>;
  read?: StreamChannelState<ErmisChatGenerics>['read'];
  thread?: StreamMessage<ErmisChatGenerics> | null;
  threadHasMore?: boolean;
  threadLoadingMore?: boolean;
  threadMessages?: StreamMessage<ErmisChatGenerics>[];
  threadSuppressAutoscroll?: boolean;
  typing?: StreamChannelState<ErmisChatGenerics>['typing'];
  watcherCount?: number;
  watchers?: StreamChannelState<ErmisChatGenerics>['watchers'];
};

export type ChannelStateContextValue<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Omit<ChannelState<ErmisChatGenerics>, 'typing'> & {
  channel: Channel<ErmisChatGenerics>;
  channelCapabilities: Record<string, boolean>;
  channelConfig: ChannelConfigWithInfo<ErmisChatGenerics> | undefined;
  imageAttachmentSizeHandler: ImageAttachmentSizeHandler;
  multipleUploads: boolean;
  notifications: ChannelNotifications;
  shouldGenerateVideoThumbnail: boolean;
  videoAttachmentSizeHandler: VideoAttachmentSizeHandler;
  acceptedFiles?: string[];
  channelUnreadUiState?: ChannelUnreadUiState<ErmisChatGenerics>;
  debounceURLEnrichmentMs?: URLEnrichmentConfig['debounceURLEnrichmentMs'];
  dragAndDropWindow?: boolean;
  enrichURLForPreview?: URLEnrichmentConfig['enrichURLForPreview'];
  findURLFn?: URLEnrichmentConfig['findURLFn'];
  giphyVersion?: GiphyVersions;
  maxNumberOfFiles?: number;
  mutes?: Array<Mute<ErmisChatGenerics>>;
  onLinkPreviewDismissed?: URLEnrichmentConfig['onLinkPreviewDismissed'];
  watcher_count?: number;
};

export const ChannelStateContext = React.createContext<ChannelStateContextValue | undefined>(
  undefined,
);

export const ChannelStateProvider = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  children,
  value,
}: PropsWithChildren<{
  value: ChannelStateContextValue<ErmisChatGenerics>;
}>) => (
  <ChannelStateContext.Provider value={(value as unknown) as ChannelStateContextValue}>
    {children}
  </ChannelStateContext.Provider>
);

export const useChannelStateContext = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  componentName?: string,
) => {
  const contextValue = useContext(ChannelStateContext);

  if (!contextValue) {
    console.warn(
      `The useChannelStateContext hook was called outside of the ChannelStateContext provider. Make sure this hook is called within a child of the Channel component. The errored call is located in the ${componentName} component.`,
    );

    return {} as ChannelStateContextValue<ErmisChatGenerics>;
  }

  return (contextValue as unknown) as ChannelStateContextValue<ErmisChatGenerics>;
};

/**
 * Typescript currently does not support partial inference, so if ChannelStateContext
 * typing is desired while using the HOC withChannelStateContext, the Props for the
 * wrapped component must be provided as the first generic.
 */
export const withChannelStateContext = <
  P extends UnknownType,
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  Component: React.ComponentType<P>,
) => {
  const WithChannelStateContextComponent = (
    props: Omit<P, keyof ChannelStateContextValue<ErmisChatGenerics>>,
  ) => {
    const channelStateContext = useChannelStateContext<ErmisChatGenerics>();

    return <Component {...(props as P)} {...channelStateContext} />;
  };

  WithChannelStateContextComponent.displayName = (
    Component.displayName ||
    Component.name ||
    'Component'
  ).replace('Base', '');

  return WithChannelStateContextComponent;
};
