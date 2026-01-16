import { cookies } from 'next/headers';
import { Suspense } from 'react';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL, DEFAULT_TOOL_MODE } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { DataStreamHandler } from '@/components/data-stream-handler';
import { hasValidAPIKeys } from '@/lib/ai/api-keys';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-dvh" />}>
      <NewChatPage />
    </Suspense>
  );
}

async function NewChatPage() {
  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');
  const toolModeFromCookie = cookieStore.get('tool-mode');

  const id = generateUUID();
  const hasAPIKeys = hasValidAPIKeys();
  const selectedToolMode = toolModeFromCookie?.value ?? DEFAULT_TOOL_MODE;

  return (
    <>
      <Chat
        key={id}
        id={id}
        initialMessages={[]}
        selectedChatModel={modelIdFromCookie?.value ?? DEFAULT_CHAT_MODEL}
        selectedToolMode={selectedToolMode}
        selectedVisibilityType="private"
        isReadonly={false}
        hasAPIKeys={hasAPIKeys}
      />
      <DataStreamHandler id={id} />
    </>
  );
}
