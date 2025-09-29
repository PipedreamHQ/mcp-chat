'use client';

import { deleteConnectedAccount, deleteUserAccount } from '@/app/(chat)/accounts/actions';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Account } from '@pipedream/sdk/browser';

interface ConnectedAccountsProps {
  accounts: Account[];
}

export function ConnectedAccounts({ accounts }: ConnectedAccountsProps) {
  const router = useRouter();
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isDeletingUserAccount, setIsDeletingUserAccount] = useState(false);
  const [showDeleteUserDialog, setShowDeleteUserDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!accountToDelete) return;

    try {
      setIsDeleting(accountToDelete);
      await deleteConnectedAccount(accountToDelete);
      router.refresh();
    } catch (error) {
      setError('Failed to delete account. Please try again later.');
    } finally {
      setIsDeleting(null);
      setAccountToDelete(null);
    }
  };

  const handleDeleteUserAccount = async () => {
    try {
      setIsDeletingUserAccount(true);
      await deleteUserAccount();
      // If we reach here without an error, the deletion was successful and user will be redirected
    } catch (error) {
      console.error('Delete account error:', error);
      // Check if this is actually a redirect error (which means success)
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('NEXT_REDIRECT')) {
        // This is expected - the user is being redirected after successful deletion
        return;
      }
      setError('Failed to delete account. Please try again later.');
      setIsDeletingUserAccount(false);
      setShowDeleteUserDialog(false);
    }
  };

  if (error) {
    return (
      <div className="rounded-md border p-4 bg-background max-w-3xl">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  const hasAccounts = accounts && accounts.length > 0;

  // Sort accounts alphabetically by app name then by account name
  const sortedAccounts = hasAccounts ? [...accounts].sort((a: Account, b: Account) => {
    // First sort by app name
    const appNameComparison = (a.app?.name || '').localeCompare(b.app?.name || '');
    if (appNameComparison !== 0) {
      return appNameComparison;
    }
    // If app names are the same, sort by account name
    return (a.name || '').localeCompare(b.name || '');
  }) : [];

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Manage your connected accounts</h3>
      
      {!hasAccounts ? (
        <div className="rounded-md border p-4 bg-background max-w-3xl">
          <p className='py-4'>Your connected accounts will be listed here after you connect them, you can delete them at any time.</p>
        </div>
      ) : (
        <div className="grid gap-3 max-w-3xl">
          {sortedAccounts.map((account) => (
          <div
            key={account.id}
            className="flex flex-col p-3 rounded-md border"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {account.app?.imgSrc ? (
                    <div className="size-12 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 p-1.5">
                      <Image
                        src={account.app.imgSrc}
                        alt={account.app.name || 'App icon'}
                        className="size-full object-contain"
                        width={48}
                        height={48}
                      />
                    </div>
                  ) : (
                    <div className="size-12 rounded-md flex items-center justify-center bg-gray-100">
                      {/* Default icon for apps without images */}
                      <span className="text-lg font-bold text-gray-400">
                        {account.app?.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {account.app?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {account.name || 'Unnamed account'}
                  </p>
                  <div className="flex flex-col space-y-1 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Connected {account.createdAt ? new Date(account.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 rounded-full"
                onClick={() => setAccountToDelete(account.id ?? null)}
                aria-label="Delete account"
              >
                <Trash2 className="size-6 text-destructive dark:text-red-400 dark:hover:text-red-300" />
                <span className="sr-only">Delete account</span>
              </Button>
            </div>
          </div>
        ))}
        </div>
      )}

      {/* Delete Account Section */}
      <div className="mt-12 pt-8 border-t border-border max-w-3xl">
        <h3 className="text-lg font-semibold text-destructive mb-4">Danger zone</h3>
        <p className="text-muted-foreground mb-6">
          Delete your account and all your data including chat conversations and connected accounts. This action cannot be undone.
        </p>
        
        <Button 
          variant="destructive" 
          disabled={isDeletingUserAccount}
          onClick={() => setShowDeleteUserDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeletingUserAccount ? "Deleting account..." : "Delete account"}
        </Button>
      </div>

      <AlertDialog open={!!accountToDelete} onOpenChange={(open) => !open && setAccountToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete connected account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this connected account?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={!!isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteUserDialog} onOpenChange={(open) => !open && setShowDeleteUserDialog(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your account and all your data including chats, messages, and connected accounts. 
              You will be signed out and will no longer be able to access your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingUserAccount}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUserAccount}
              disabled={isDeletingUserAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletingUserAccount ? "Deleting..." : "Delete account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
