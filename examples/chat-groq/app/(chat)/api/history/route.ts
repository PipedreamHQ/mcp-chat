import { getChatsByUserId } from '@/lib/db/queries';
import { getEffectiveSession, shouldPersistData } from '@/lib/auth-utils';

export async function GET() {
  const session = await getEffectiveSession();

  if (!session || !session.user) {
    return Response.json('Unauthorized!', { status: 401 });
  }

  // In dev mode without auth, return empty history
  if (!shouldPersistData()) {
    return Response.json([]);
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const chats = await getChatsByUserId({ id: session.user.id! });
  return Response.json(chats);
}
