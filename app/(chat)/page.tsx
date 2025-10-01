import { cookies } from 'next/headers';

import { Chat } from '@/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import { generateUUID } from '@/lib/utils';
import { hasValidAPIKeys } from '@/lib/ai/api-keys';
import type { ClientUIMessage } from '@/lib/chat-types';

export default async function Page() {
  const id = generateUUID();
  const hasAPIKeys = hasValidAPIKeys();

  const cookieStore = await cookies();
  const modelIdFromCookie = cookieStore.get('chat-model');

  if (!modelIdFromCookie) {
    return (
      <Chat
        key={id}
        id={id}
        initialMessages={[] as ClientUIMessage[]}
        selectedChatModel={DEFAULT_CHAT_MODEL}
        selectedVisibilityType="private"
        isReadonly={false}
        hasAPIKeys={hasAPIKeys}
      />
    );
  }

  return (
    <Chat
      key={id}
      id={id}
      initialMessages={[] as ClientUIMessage[]}
      selectedChatModel={modelIdFromCookie.value}
      selectedVisibilityType="private"
      isReadonly={false}
      hasAPIKeys={hasAPIKeys}
    />
  );
}
