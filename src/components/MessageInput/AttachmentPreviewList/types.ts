import { LocalAttachment } from '../types';
import type { DefaultErmisChatGenerics } from '../../../types';

export type AttachmentPreviewProps<
  A extends LocalAttachment,
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = {
  attachment: A;
  handleRetry: (
    attachment: LocalAttachment<ErmisChatGenerics>,
  ) => void | Promise<LocalAttachment<ErmisChatGenerics> | undefined>;
  removeAttachments: (ids: string[]) => void;
};
