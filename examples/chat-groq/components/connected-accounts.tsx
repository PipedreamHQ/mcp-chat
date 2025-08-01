'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deleteConnectedAccount } from '@/app/(chat)/accounts/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
import { type Account } from '@pipedream/sdk';

interface ConnectedAccountsProps {
  accounts: Account[];
}

export function ConnectedAccounts({ accounts }: ConnectedAccountsProps) {
  const router = useRouter();
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
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

  if (error) {
    return (
      <div className="rounded-md border p-4 bg-background max-w-3xl">
        <h3 className="text-lg font-medium mb-2">Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="rounded-md border p-4 bg-background max-w-3xl">
        <h3 className="text-lg font-medium mb-2">No connected accounts yet</h3>
        <p className='py-4'>Your connected accounts will be listed here after you connect them, you can delete them at any time.</p>
      </div>
    );
  }

  // Sort accounts alphabetically by app name then by account name
  const sortedAccounts = [...accounts].sort((a, b) => {
    // First sort by app name
    const appNameComparison = (a.app.name || '').localeCompare(b.app.name || '');
    if (appNameComparison !== 0) {
      return appNameComparison;
    }
    // If app names are the same, sort by account name
    return (a.name || '').localeCompare(b.name || '');
  });

  return (
    <>
      <h3 className="text-lg font-medium mb-4">Manage your connected accounts</h3>
      <div className="grid gap-3 max-w-3xl">
        {sortedAccounts.map((account) => (
          <div 
            key={account.id} 
            className="flex flex-col p-3 rounded-md border"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {account.app.img_src ? (
                    <div className="size-12 rounded-md overflow-hidden flex items-center justify-center bg-gray-100 p-1.5">
                      <Image 
                        src={account.app.img_src} 
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
                        {account.app.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {account.app.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {account.name || 'Unnamed Account'}
                  </p>
                  <div className="flex flex-col space-y-1 mt-1">
                    <p className="text-sm text-muted-foreground">
                      Connected {new Date(account.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 rounded-full"
                onClick={() => setAccountToDelete(account.id)}
                aria-label="Delete account"
              >
                <Trash2 className="size-6 text-destructive dark:text-red-400 dark:hover:text-red-300" />
                <span className="sr-only">Delete account</span>
              </Button>
            </div>
          </div>
        ))}
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
    </>
  );
}