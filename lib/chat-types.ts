import type { UIMessage } from 'ai';
import type { Suggestion } from '@/lib/db/schema';

export type ChatAttachment = {
  url: string;
  name?: string;
  contentType?: string;
};

export type ClientUIMessage = UIMessage & {
  content?: string;
  experimental_attachments?: ChatAttachment[];
};

export type AppendInput =
  | ClientUIMessage
  | {
      role: 'user';
      content: string;
    };

export type AppendFn = (message: AppendInput) => Promise<void>;

export type ReloadFn = () => Promise<void>;

export type ArtifactStreamDelta = {
  type:
    | 'text-delta'
    | 'code-delta'
    | 'sheet-delta'
    | 'image-delta'
    | 'title'
    | 'id'
    | 'suggestion'
    | 'clear'
    | 'finish'
    | 'kind';
  content: string | Suggestion;
};
