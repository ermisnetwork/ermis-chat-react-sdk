import { useEffect, useState } from 'react';
import type { Channel } from 'ermis-chat-js-sdk';

import { getDisplayImage, getDisplayTitle } from '../utils';
import type { DefaultErmisChatGenerics } from '../../../types/types';

import { useChatContext } from '../../../context';

export type ChannelPreviewInfoParams<ErmisChatGenerics extends DefaultErmisChatGenerics> = {
  channel: Channel<ErmisChatGenerics>;
  /** Manually set the image to render, defaults to the Channel image */
  overrideImage?: string;
  /** Set title manually */
  overrideTitle?: string;
};

export const useChannelPreviewInfo = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: ChannelPreviewInfoParams<ErmisChatGenerics>,
) => {
  const { channel, overrideImage, overrideTitle } = props;

  const { client } = useChatContext<ErmisChatGenerics>('useChannelPreviewInfo');
  const [displayTitle, setDisplayTitle] = useState(
    () => overrideTitle || getDisplayTitle(channel, client.user),
  );
  const [displayImage, setDisplayImage] = useState(
    () => overrideImage || getDisplayImage(channel, client.user),
  );

  useEffect(() => {
    if (overrideTitle && overrideImage) return;

    const updateTitles = () => {
      if (!overrideTitle) setDisplayTitle(getDisplayTitle(channel, client.user));
      if (!overrideImage) setDisplayImage(getDisplayImage(channel, client.user));
    };

    updateTitles();

    client.on('user.updated', updateTitles);
    return () => {
      client.off('user.updated', updateTitles);
    };
  }, [channel, channel.data, client, overrideImage, overrideTitle]);

  return {
    displayImage: overrideImage || displayImage,
    displayTitle: overrideTitle || displayTitle,
  };
};
