"use server";

import { getEffectiveSession } from '@/lib/auth-utils';
import { pdClient } from '@/lib/pd-backend-client';
import { deleteUserById } from '@/lib/db/queries';
import { signOut } from '@/app/(auth)/auth';
import { redirect } from 'next/navigation';
import type { Account } from '@pipedream/sdk/browser';

/**
 * Fetches connected accounts for the current authenticated user
 * @returns Array of connected accounts
 */
export async function getConnectedAccounts(): Promise<Account[]> {
  const session = await getEffectiveSession();
  const { id: externalUserId } = session?.user || {};
  if (!externalUserId) {
    return [];
  }

  try {
    const response = await pdClient().accounts.list({
      externalUserId,
    });

    if (response?.data && Array.isArray(response.data)) {
      return response.data;
    }

    return [];
  } catch (error) {
    // Return empty array on error to prevent UI from breaking
    return [];
  }
}

/**
 * Fetches a single connected account by ID for the current authenticated user
 * @param accountId The ID of the account to fetch
 * @returns The account if found and owned by the user, null otherwise
 */
export async function getConnectedAccountById(accountId: string): Promise<Account | null> {
  const session = await getEffectiveSession();
  if (!session?.user?.id) {
    return null;
  }

  try {
    const account = await pdClient().accounts.retrieve(accountId);

    // Verify the account belongs to the current user
    if (account && account.externalId === session.user.id) {
      return account;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Deletes a connected account by ID
 * @param accountId The ID of the account to delete
 */
export async function deleteConnectedAccount(accountId: string): Promise<void> {
  const pd = pdClient()
  const session = await getEffectiveSession();
  const { id: externalUserId } = session?.user || {};
  if (!externalUserId) {
    throw new Error('User not authenticated');
  }

  try {
    // Verify the user owns this account before deleting
    const accounts = await pd.accounts.list({
      externalUserId
    });

    const accountBelongsToUser = accounts?.data?.some(account => account.id === accountId);

    if (!accountBelongsToUser) {
      throw new Error('Account not found or not owned by user');
    }

    await pd.accounts.delete(accountId);
  } catch (error) {
    throw new Error('Failed to delete account');
  }
}

/**
 * Deletes the user's account completely, including all their data
 * This will delete the external user from Pipedream, all user data from the database,
 * and sign the user out
 */
export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  const session = await getEffectiveSession();
  const { id: externalUserId } = session?.user || {};
  
  if (!externalUserId) {
    return { success: false, error: 'User not authenticated' };
  }

  try {
    // First, delete the external user from Pipedream
    try {
      const pd = pdClient();
      await pd.users.deleteExternalUser(externalUserId);
    } catch (error) {
      console.error("Error deleting external user from Pipedream:", 
        error instanceof Error ? error.message : String(error));
      // Continue with account deletion even if external user deletion fails
    }
    
    // Delete all user data from the database
    await deleteUserById({ id: externalUserId });
    
  } catch (error) {
    console.error("Error deleting user account:", 
      error instanceof Error ? error.message : String(error));
    throw new Error("Failed to delete account");
  }
  
  // Sign out and redirect - this will throw a redirect which is expected
  await signOut({ redirectTo: '/' });
}
