import React from 'react';

import type { Attachment } from 'ermis-chat-js-sdk';

import { DownloadButton, FileSizeIndicator, PlayButton, ProgressBar } from './components';
import { useAudioController } from './hooks/useAudioController';

import { useChatContext } from '../../context/ChatContext';

import type { DefaultErmisChatGenerics } from '../../types/types';

export type AudioProps<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  og: Attachment<ErmisChatGenerics>;
};

const AudioV1 = ({ og }: AudioProps) => {
  // fixme: pass mimeType if available
  const { asset_url, description, image_url, mime_type, text, title } = og;
  const { audioRef, isPlaying, progress, togglePlay } = useAudioController({ mimeType: mime_type });

  return (
    <div className='str-chat__audio'>
      <div className='str-chat__audio__wrapper'>
        <audio ref={audioRef}>
          <source data-testid='audio-source' src={asset_url} type='audio/mp3' />
        </audio>
        <div className='str-chat__audio__image'>
          <div className='str-chat__audio__image--overlay'>
            {!isPlaying ? (
              <button
                className='str-chat__audio__image--button'
                data-testid='play-audio'
                onClick={togglePlay}
              >
                <svg height='40' viewBox='0 0 64 64' width='40' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M32 58c14.36 0 26-11.64 26-26S46.36 6 32 6 6 17.64 6 32s11.64 26 26 26zm0 6C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32zm13.237-28.412L26.135 45.625a3.27 3.27 0 0 1-4.426-1.4 3.319 3.319 0 0 1-.372-1.47L21 23.36c-.032-1.823 1.41-3.327 3.222-3.358a3.263 3.263 0 0 1 1.473.322l19.438 9.36a3.311 3.311 0 0 1 .103 5.905z'
                    fillRule='nonzero'
                  />
                </svg>
              </button>
            ) : (
              <button
                className='str-chat__audio__image--button'
                data-testid='pause-audio'
                onClick={togglePlay}
              >
                <svg height='40' viewBox='0 0 64 64' width='40' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M32 58.215c14.478 0 26.215-11.737 26.215-26.215S46.478 5.785 32 5.785 5.785 17.522 5.785 32 17.522 58.215 32 58.215zM32 64C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32zm-7.412-45.56h2.892a2.17 2.17 0 0 1 2.17 2.17v23.865a2.17 2.17 0 0 1-2.17 2.17h-2.892a2.17 2.17 0 0 1-2.17-2.17V20.61a2.17 2.17 0 0 1 2.17-2.17zm12.293 0h2.893a2.17 2.17 0 0 1 2.17 2.17v23.865a2.17 2.17 0 0 1-2.17 2.17h-2.893a2.17 2.17 0 0 1-2.17-2.17V20.61a2.17 2.17 0 0 1 2.17-2.17z'
                    fillRule='nonzero'
                  />
                </svg>
              </button>
            )}
          </div>
          {image_url && <img alt={`${description}`} src={image_url} />}
        </div>
        <div className='str-chat__audio__content'>
          <span className='str-chat__audio__content--title'>
            <strong>{title}</strong>
          </span>
          <span className='str-chat__audio__content--subtitle'>{text}</span>
          <div className='str-chat__audio__content--progress'>
            <div
              data-progress={progress}
              data-testid='audio-progress'
              role='progressbar'
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AudioV2 = ({ og }: AudioProps) => {
  const { asset_url, file_size, mime_type, title } = og;
  const { audioRef, isPlaying, progress, seek, togglePlay } = useAudioController({
    mimeType: mime_type,
  });

  if (!asset_url) return null;

  const dataTestId = 'audio-widget';
  const rootClassName = 'str-chat__message-attachment-audio-widget';

  return (
    <div className={rootClassName} data-testid={dataTestId}>
      <audio ref={audioRef}>
        <source data-testid='audio-source' src={asset_url} type='audio/mp3' />
      </audio>
      <div className='str-chat__message-attachment-audio-widget--play-controls'>
        <PlayButton isPlaying={isPlaying} onClick={togglePlay} />
      </div>
      <div className='str-chat__message-attachment-audio-widget--text'>
        <div className='str-chat__message-attachment-audio-widget--text-first-row'>
          <div className='str-chat__message-attachment-audio-widget--title'>{title}</div>
          <DownloadButton assetUrl={asset_url} />
        </div>
        <div className='str-chat__message-attachment-audio-widget--text-second-row'>
          <FileSizeIndicator fileSize={file_size} />
          <ProgressBar onClick={seek} progress={progress} />
        </div>
      </div>
    </div>
  );
};

const UnMemoizedAudio = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(
  props: AudioProps<ErmisChatGenerics>,
) => {
  const { themeVersion } = useChatContext<ErmisChatGenerics>('Audio');

  return themeVersion === '1' ? <AudioV1 {...props} /> : <AudioV2 {...props} />;
};

/**
 * Audio attachment with play/pause button and progress bar
 */
export const Audio = React.memo(UnMemoizedAudio) as typeof UnMemoizedAudio;
