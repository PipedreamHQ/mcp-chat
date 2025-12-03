import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

import { auth } from '@/app/(auth)/auth';
import { Chat } from '@/components/chat';
import { getChatById, getMessagesByChatId } from '@/lib/db/queries';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { DBMessage } from '@/lib/db/schema';
import { Attachment, UIMessage } from 'ai';
import { BASE_METADATA, BASE_TITLE, isAuthDisabled } from '@/lib/constants';
import { getEffectiveSession, shouldPersistData } from '@/lib/auth-utils';
import { hasValidAPIKeys } from '@/lib/ai/api-keys';

export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const { id } = await params;
  
  // In dev mode without auth, skip database lookup and return default metadata
  if (!shouldPersistData()) {
    return BASE_METADATA;
  }

  const chat = await getChatById({ id });

  if (!chat) {
    // When chat is not found, fall back to the default metadata
    return BASE_METADATA;
  }

  // Find the first user message to use as description
  const messages = await getMessagesByChatId({ id });
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  const description = firstUserMessage 
    ? (firstUserMessage.parts.find(part => part.type === 'text')?.text || BASE_TITLE)
    : BASE_TITLE;
  
  // Trim description if too long
  const trimmedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;
  
  const title = `${BASE_TITLE}`;

  // For dynamic routes, we need to use relative URLs, not the hardcoded base URL
  return {
    ...BASE_METADATA,
    // Remove the metadataBase to use the default, which is the current URL
    metadataBase: null,
    title: title,
    description: trimmedDescription,
    openGraph: {
      ...BASE_METADATA.openGraph,
      title: title,
      description: trimmedDescription,
      // Use relative URLs that will be resolved against the current URL
      images: [
        {
          url: '/opengraph-image.png',
          width: 1200,
          height: 630,
          alt: 'Pipedream Chat',
        }
      ],
    },
    twitter: {
      ...BASE_METADATA.twitter,
      title: title,
      description: trimmedDescription,
      // Use relative URLs that will be resolved against the current URL
      images: [
        {
          url: '/twitter-image.png',
          width: 1200,
          height: 630,
          alt: 'Pipedream Chat',
        }
      ],
    },
  };
}

export default function Page(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <ChatPage params={props.params} />
    </Suspense>
  );
}

async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hasAPIKeys = hasValidAPIKeys();

  // In dev mode without auth, create a fresh chat with no messages
  if (!shouldPersistData()) {
    const session = await getEffectiveSession();
    const cookieStore = await cookies();
    const chatModelFromCookie = cookieStore.get('chat-model');

    return (
      <>
        <Chat
          id={id}
          initialMessages={[]}
          selectedChatModel={chatModelFromCookie?.value || DEFAULT_CHAT_MODEL}
          selectedVisibilityType="private"
          isReadonly={false}
          hasAPIKeys={hasAPIKeys}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  const chat = await getChatById({ id });

  if (!chat) {
    notFound();
  }

  const session = await getEffectiveSession();

  if (chat.visibility === 'private') {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== chat.userId) {
      return notFound();
    }
  }

  const messagesFromDb = await getMessagesByChatId({
    id,
  });

  function convertToUIMessages(messages: Array<DBMessage>): Array<UIMessage> {
    return messages.map((message) => {
      const textPart = Array.isArray(message.parts)
        ? message.parts.find((part: any) => part?.type === 'text' && typeof part.text === 'string')
        : undefined;

      // need to fill in content so anthropic doesn't blow up
      // example message: all messages must have non-empty content except for the optional final assistant message
      const content = textPart?.text ?? '';

      return {
        id: message.id,
        parts: message.parts as UIMessage['parts'],
        role: message.role as UIMessage['role'],
        content,
        createdAt: message.createdAt,
        experimental_attachments: (message.attachments as Array<Attachment>) ?? [],
      };
    });
  }

  const cookieStore = await cookies();
  const chatModelFromCookie = cookieStore.get('chat-model');

  if (!chatModelFromCookie) {
    return (
      <>
        <Chat
          id={chat.id}
          initialMessages={convertToUIMessages(messagesFromDb)}
          selectedChatModel={DEFAULT_CHAT_MODEL}
          selectedVisibilityType={chat.visibility}
          isReadonly={session?.user?.id !== chat.userId}
          hasAPIKeys={hasAPIKeys}
        />
        <DataStreamHandler id={id} />
      </>
    );
  }

  return (
    <>
      <Chat
        id={chat.id}
        initialMessages={convertToUIMessages(messagesFromDb)}
        selectedChatModel={chatModelFromCookie.value}
        selectedVisibilityType={chat.visibility}
        isReadonly={session?.user?.id !== chat.userId}
        hasAPIKeys={hasAPIKeys}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
