import { getConnectedAccounts } from './actions';
import { ConnectedAccounts } from '@/components/connected-accounts';
import { ChatHeader } from '@/components/chat-header';
import { getEffectiveSession, } from '@/lib/auth-utils';

export default async function AccountsPage() {
  const session = await getEffectiveSession();
  if (!session?.user) {
    return <div>You must be signed in to view this page.</div>;
  }

  const accounts = await getConnectedAccounts();
  
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <ChatHeader 
        chatId="accounts" 
        selectedModelId="" 
        selectedVisibilityType="private"
        isReadonly={true}
      />
      <div className="space-y-6 p-4 pt-6 px-8 md:p-8 md:pt-6 md:px-14">
        <div className="px-2">
          <h2 className="text-3xl font-bold tracking-tight">Account</h2>
          <div className="mt-6">
            <ConnectedAccounts accounts={accounts} />
          </div>
        </div>
      </div>
    </div>
  );
}