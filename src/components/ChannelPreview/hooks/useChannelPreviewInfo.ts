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

  const { client } = useChatContext<ErmisChatGenerics>('ChannelPreview');
  const [displayTitle, setDisplayTitle] = useState(getDisplayTitle(channel, client.user));
  const [displayImage, setDisplayImage] = useState(getDisplayImage(channel, client.user));

  useEffect(() => {
    const handleEvent = () => {
      setDisplayTitle((displayTitle) => {
        const newDisplayTitle = getDisplayTitle(channel, client.user);
        return displayTitle !== newDisplayTitle ? newDisplayTitle : displayTitle;
      });
      setDisplayImage((displayImage) => {
        const newDisplayImage = getDisplayImage(channel, client.user);
        return displayImage !== newDisplayImage ? newDisplayImage : displayImage;
      });
    };

    client.on('user.updated', handleEvent);
    return () => {
      client.off('user.updated', handleEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    displayImage: overrideImage || displayImage,
    displayTitle: overrideTitle || displayTitle,
  };
};
