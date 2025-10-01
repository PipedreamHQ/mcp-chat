'use client';

import { DefaultChatTransport } from 'ai';
import type { ChatAttachment } from '@/lib/chat-types';
import { useChat } from '@ai-sdk/react';
import { useCallback, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';
import { toast } from 'sonner';

import { ChatHeader } from '@/components/chat-header';
import { Artifact, artifactDefinitions, ArtifactKind } from './artifact';
import { MultimodalInput } from './multimodal-input';
import { Messages } from './messages';
import { VisibilityType } from './visibility-selector';
import { useArtifactSelector, useArtifact, initialArtifactData } from '@/hooks/use-artifact';
import { useEffectiveSession } from '@/hooks/use-effective-session';
import type { Vote } from '@/lib/db/schema';
import type { AppendFn, ClientUIMessage, ReloadFn, ArtifactStreamDelta } from '@/lib/chat-types';
import { fetcher, generateUUID } from '@/lib/utils';

export function Chat({
  id,
  initialMessages,
  selectedChatModel,
  selectedVisibilityType,
  isReadonly,
  hasAPIKeys,
}: {
  id: string;
  initialMessages: ClientUIMessage[];
  selectedChatModel: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  hasAPIKeys?: boolean;
}) {
  const { mutate } = useSWRConfig();
  const { data: session } = useEffectiveSession();
  const isSignedIn = !!session?.user;

  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const { artifact, setArtifact, setMetadata } = useArtifact();

  const handleArtifactDelta = useCallback(
    (delta: ArtifactStreamDelta) => {
      const artifactDefinition = artifactDefinitions.find(
        (definition) => definition.kind === artifact.kind,
      );

      artifactDefinition?.onStreamPart?.({
        streamPart: delta,
        setArtifact,
        setMetadata,
      });

      setArtifact((currentArtifact) => {
        const draft = currentArtifact ?? {
          ...initialArtifactData,
          status: 'streaming',
        };

        switch (delta.type) {
          case 'id':
            return {
              ...draft,
              documentId: delta.content as string,
              status: 'streaming',
            };
          case 'title':
            return {
              ...draft,
              title: delta.content as string,
              status: 'streaming',
            };
          case 'kind':
            return {
              ...draft,
              kind: delta.content as ArtifactKind,
              status: 'streaming',
            };
          case 'clear':
            return {
              ...draft,
              content: '',
              status: 'streaming',
            };
          case 'finish':
            return {
              ...draft,
              status: 'idle',
            };
          default:
            return draft;
        }
      });
    },
    [artifact.kind, setArtifact, setMetadata],
  );

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        prepareSendMessagesRequest: ({
          messages: outgoingMessages,
          id: chatId,
          trigger,
          messageId,
        }) => ({
          body: {
            id: chatId,
            messages: outgoingMessages,
            selectedChatModel,
            selectedVisibilityType,
            trigger,
            messageId,
          },
        }),
      }),
    [selectedChatModel, selectedVisibilityType],
  );

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    regenerate,
  } = useChat<ClientUIMessage>({
    id,
    messages: initialMessages,
    transport,
    generateId: generateUUID,
    onFinish: () => {
      mutate('/api/history');
    },
    onError: (error) => {
      if (error instanceof Error && error.message.includes('401')) {
        return;
      }
      toast.error('An error occurred, please try again!');
    },
    onData: (part) => {
      if (part.type === 'data-artifact') {
        handleArtifactDelta(part.data as ArtifactStreamDelta);
      }
    },
  });

  const sendUserMessage = useCallback(
    async ({
      text,
      attachments: outgoingAttachments = [],
    }: {
      text?: string;
      attachments?: ChatAttachment[];
    }) => {
      if (!text && outgoingAttachments.length === 0) {
        return;
      }

      const parts: ClientUIMessage['parts'] = [];

      if (text && text.length > 0) {
        parts.push({ type: 'text', text });
      }

      for (const attachment of outgoingAttachments) {
        parts.push({
          type: 'file',
          url: attachment.url,
          mediaType: attachment.contentType ?? 'application/octet-stream',
          filename: attachment.name,
        });
      }

      const message: ClientUIMessage = {
        id: generateUUID(),
        role: 'user',
        parts,
        content: text ?? '',
        experimental_attachments: outgoingAttachments,
      };

      await sendMessage(message);
    },
    [sendMessage],
  );

  const handleSubmit = useCallback(
    async (
      event?: { preventDefault?: () => void },
      options?: { experimental_attachments?: ChatAttachment[] },
    ) => {
      event?.preventDefault?.();

      const text = input.trim();
      const outgoingAttachments = options?.experimental_attachments ?? attachments;

      if (!text && outgoingAttachments.length === 0) {
        return;
      }

      await sendUserMessage({ text: input, attachments: outgoingAttachments });

      if (!options) {
        setAttachments([]);
      }

      setInput('');
    },
    [attachments, input, sendUserMessage],
  );

  const append: AppendFn = useCallback(
    async (message) => {
      if ('content' in message && message.role === 'user') {
        await sendUserMessage({ text: message.content });
        return;
      }

      await sendMessage(message as ClientUIMessage);
    },
    [sendMessage, sendUserMessage],
  );

  const reload: ReloadFn = useCallback(async () => {
    await regenerate();
  }, [regenerate]);

  const { data: votes } = useSWR<Array<Vote>>(
    messages.length >= 2 ? `/api/vote?chatId=${id}` : null,
    fetcher,
  );

  const isArtifactVisible = useArtifactSelector((state) => state.isVisible);

  if (hasAPIKeys === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh bg-background px-4">
        <div className="max-w-2xl w-full space-y-6 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 dark:bg-red-900/20 dark:border-red-800">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-3">
              Missing AI API Keys
            </h2>
            <p className="text-red-700 dark:text-red-300 mb-4">
              Oops, the chat app requires at least one of these environment variables to be set:
            </p>
            <ul className="text-left space-y-2 mb-4">
              <li className="text-red-600 dark:text-red-400">
                <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm">OPENAI_API_KEY</code> - For OpenAI models
              </li>
              <li className="text-red-600 dark:text-red-400">
                <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm">ANTHROPIC_API_KEY</code> - For Anthropic Claude models
              </li>
              <li className="text-red-600 dark:text-red-400">
                <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded text-sm">GOOGLE_GENERATIVE_AI_API_KEY</code> - For Google Gemini models
              </li>
            </ul>
            <p className="text-sm text-red-600 dark:text-red-400">
              Please add at least one API key to your <code className="bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">.env</code> file and restart the server.
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>
              Need help? Check the{' '}
              <Link
                href="https://github.com/PipedreamHQ/mcp-chat?tab=readme-ov-file#prerequisites"
                className="underline hover:text-foreground"
              >
                README
              </Link>{' '}
              for setup instructions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <>
        <div className="flex flex-col min-w-0 h-dvh bg-background">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col justify-center items-center px-4">
              <div className="text-center mb-8 max-w-3xl">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-2">
                  <h1 className="text-3xl font-bold max-w-[280px] sm:max-w-none leading-tight">
                    Welcome to MCP Chat by Pipedream
                  </h1>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 mt-1 sm:mt-0">
                    Alpha
                  </span>
                </div>
                <p className="text-muted-foreground max-w-sm mx-auto">
                  Chat directly with 2,800+ APIs powered by{' '}
                  <Link
                    className="font-medium underline underline-offset-4"
                    href="https://pipedream.com/docs/connect/mcp/developers"
                    target="_blank"
                  >
                    Pipedream Connect
                  </Link>
                </p>
              </div>

              <form className="w-full bg-background mb-4 max-w-3xl">
                {!isReadonly && (
                  <MultimodalInput
                    chatId={id}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    status={status}
                    stop={stop}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    messages={messages}
                    setMessages={setMessages}
                    append={append}
                  />
                )}
              </form>
            </div>
          ) : (
            <>
              <Messages
                chatId={id}
                status={status}
                votes={votes}
                messages={messages}
                setMessages={setMessages}
                reload={reload}
                isReadonly={isReadonly}
                isArtifactVisible={isArtifactVisible}
                append={append}
                isSignedIn={false}
              />

              <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
                {!isReadonly && (
                  <MultimodalInput
                    chatId={id}
                    input={input}
                    setInput={setInput}
                    handleSubmit={handleSubmit}
                    status={status}
                    stop={stop}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    messages={messages}
                    setMessages={setMessages}
                    append={append}
                  />
                )}
              </form>
            </>
          )}
        </div>

        <Artifact
          chatId={id}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          status={status}
          stop={stop}
          attachments={attachments}
          setAttachments={setAttachments}
          append={append}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          votes={votes}
          isReadonly={isReadonly}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background">
        <ChatHeader
          chatId={id}
          selectedModelId={selectedChatModel}
          selectedVisibilityType={selectedVisibilityType}
          isReadonly={isReadonly}
        />

        <Messages
          chatId={id}
          status={status}
          votes={votes}
          messages={messages}
          setMessages={setMessages}
          reload={reload}
          isReadonly={isReadonly}
          isArtifactVisible={isArtifactVisible}
          append={append}
        />

        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          {!isReadonly && (
            <MultimodalInput
              chatId={id}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              status={status}
              stop={stop}
              attachments={attachments}
              setAttachments={setAttachments}
              messages={messages}
              setMessages={setMessages}
              append={append}
            />
          )}
        </form>
      </div>

      <Artifact
        chatId={id}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        status={status}
        stop={stop}
        attachments={attachments}
        setAttachments={setAttachments}
        append={append}
        messages={messages}
        setMessages={setMessages}
        reload={reload}
        votes={votes}
        isReadonly={isReadonly}
      />
    </>
  );
}
