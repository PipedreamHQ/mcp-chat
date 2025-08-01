"use server";

import { getEffectiveSession } from '@/lib/auth-utils';
import { type Account } from '@pipedream/sdk/server';
import { pdClient } from '@/lib/pd-backend-client';

/**
 * Fetches connected accounts for the current authenticated user
 * @returns Array of connected accounts
 */
export async function getConnectedAccounts(): Promise<Account[]> {
  const session = await getEffectiveSession();
  if (!session?.user?.id) {
    return [];
  }
  
  try {
    const response = await pdClient().getAccounts({
      external_user_id: session.user.id,
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
 * Deletes a connected account by ID
 * @param accountId The ID of the account to delete
 */
export async function deleteConnectedAccount(accountId: string): Promise<void> {
  const pd = pdClient()
  const session = await getEffectiveSession();
  if (!session?.user?.id) {
    throw new Error('User not authenticated');
  }

  try {
    // Verify the user owns this account before deleting
    const accounts = await pd.getAccounts({
      external_user_id: session.user.id,
    });
    
    const accountBelongsToUser = accounts?.data?.some(account => account.id === accountId);
    
    if (!accountBelongsToUser) {
      throw new Error('Account not found or not owned by user');
    }
    
    await pd.deleteAccount(accountId);
  } catch (error) {
    throw new Error('Failed to delete account');
  }
}