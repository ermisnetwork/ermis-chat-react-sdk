import { useCallback, useEffect, useMemo, useState } from 'react';
import { MessageInputContextValue, useTranslationContext } from '../../../context';
import { AudioRecorderConfig, MediaRecorderController, MediaRecordingState } from '../classes';

import type { LocalVoiceRecordingAttachment } from '../../MessageInput';
import type { DefaultErmisChatGenerics } from '../../../types';

export type CustomAudioRecordingConfig = Partial<AudioRecorderConfig>;

export type RecordingController<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  completeRecording: () => void;
  permissionState?: PermissionState;
  recorder?: MediaRecorderController;
  recording?: LocalVoiceRecordingAttachment<ErmisChatGenerics>;
  recordingState?: MediaRecordingState;
};

type UseMediaRecorderParams<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Pick<
  MessageInputContextValue<ErmisChatGenerics>,
  'asyncMessagesMultiSendEnabled' | 'handleSubmit' | 'uploadAttachment'
> & {
  enabled: boolean;
  generateRecordingTitle?: (mimeType: string) => string;
  recordingConfig?: CustomAudioRecordingConfig;
};

export const useMediaRecorder = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>({
  asyncMessagesMultiSendEnabled,
  enabled,
  generateRecordingTitle,
  handleSubmit,
  recordingConfig,
  uploadAttachment,
}: UseMediaRecorderParams<ErmisChatGenerics>): RecordingController<ErmisChatGenerics> => {
  const { t } = useTranslationContext('useMediaRecorder');

  const [recording, setRecording] = useState<LocalVoiceRecordingAttachment<ErmisChatGenerics>>();
  const [recordingState, setRecordingState] = useState<MediaRecordingState>();
  const [permissionState, setPermissionState] = useState<PermissionState>();
  const [isScheduledForSubmit, scheduleForSubmit] = useState(false);

  const recorder = useMemo(
    () =>
      enabled
        ? new MediaRecorderController({
            config: recordingConfig ?? {},
            generateRecordingTitle,
            t,
          })
        : undefined,
    [recordingConfig, enabled, generateRecordingTitle, t],
  );

  const completeRecording = useCallback(async () => {
    if (!recorder) return;
    const recording = await recorder.stop();
    if (!recording) return;
    await uploadAttachment(recording);
    if (!asyncMessagesMultiSendEnabled) {
      // FIXME: cannot call handleSubmit() directly as the function has stale reference to attachments
      scheduleForSubmit(true);
    }
    recorder.cleanUp();
  }, [asyncMessagesMultiSendEnabled, recorder, uploadAttachment]);

  useEffect(() => {
    if (!isScheduledForSubmit) return;
    handleSubmit();
    scheduleForSubmit(false);
  }, [handleSubmit, isScheduledForSubmit]);

  useEffect(() => {
    if (!recorder) return;
    recorder.permission.watch();
    const recordingSubscription = recorder.recording.subscribe(setRecording);
    const recordingStateSubscription = recorder.recordingState.subscribe(setRecordingState);
    const permissionStateSubscription = recorder.permission.state.subscribe(setPermissionState);

    return () => {
      recorder.cancel();
      recorder.permission.unwatch();
      recordingSubscription.unsubscribe();
      recordingStateSubscription.unsubscribe();
      permissionStateSubscription.unsubscribe();
    };
  }, [recorder]);

  return {
    completeRecording,
    permissionState,
    recorder,
    recording,
    recordingState,
  };
};
