import React, { useMemo } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import { BaseImage } from './BaseImage';
import { useTranslationContext } from '../../context';

import type { Attachment } from 'ermis-chat-js-sdk';
import type { DefaultErmisChatGenerics } from '../../types/types';

export type ModalGalleryProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  /** The images for the Carousel component */
  images: Attachment<ErmisChatGenerics>[];
  /** The index for the component */
  index?: number;
};

const onError: React.ReactEventHandler<HTMLImageElement> = (e) => {
  // Prevent having alt attribute on img as the img takes the height of the alt text
  // instead of the CSS / element width & height when the CSS mask (fallback) is applied.
  (e.target as HTMLImageElement).alt = '';
};

const renderItem = ({ original, originalAlt }: ReactImageGalleryItem) => (
  <BaseImage alt={originalAlt} className='image-gallery-image' onError={onError} src={original} />
);

export const ModalGallery = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: ModalGalleryProps<ErmisChatGenerics>,
) => {
  const { images, index } = props;
  const { t } = useTranslationContext('ModalGallery');

  const formattedArray = useMemo(
    () =>
      images.map((image) => {
        const imageSrc = image.image_url || image.thumb_url || '';
        return {
          original: imageSrc,
          originalAlt: t('User uploaded content'),
          source: imageSrc,
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images],
  );

  return (
    <ImageGallery
      items={formattedArray}
      renderItem={renderItem}
      showIndex={true}
      showPlayButton={false}
      showThumbnails={false}
      startIndex={index}
    />
  );
};
