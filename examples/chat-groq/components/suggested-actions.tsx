'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { memo, useState } from 'react';
import { useEffectiveSession } from '@/hooks/use-effective-session';
import { UseChatHelpers } from '@ai-sdk/react';
import { SignInModal } from './sign-in-modal';
import { useIsMobile } from '../hooks/use-mobile';
import { Globe } from 'lucide-react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
}

interface SuggestedAction {
  title: string;
  label: string;
  action: string;
  appSlugs?: string[];
  webSearchIcon?: boolean;
}

function PureSuggestedActions({ chatId, append }: SuggestedActionsProps) {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { status: authStatus } = useEffectiveSession();
  const isMobile = useIsMobile();
  
  const handleActionClick = (e: React.MouseEvent, actionText: string) => {
    // Prevent default button behavior which might cause navigation
    e.preventDefault();
    e.stopPropagation();
    
    if (authStatus === 'unauthenticated') {
      try {
        // Save action text to localStorage as a JSON string so useLocalStorage can parse it
        localStorage.setItem('input', JSON.stringify(actionText));
        setIsSignInModalOpen(true);
      } catch (error) {
        console.error('Error saving suggestion to localStorage:', error);
      }
      return;
    }
    
    // User is authenticated, proceed with the action
    window.history.replaceState({}, '', `/chat/${chatId}`);
    append({
      role: 'user',
      content: actionText,
    });
  };
  
  const suggestedActions: SuggestedAction[] = [
    {
      title: 'Help me prep for my next meeting',
      label: 'and tell me about the attendees',
      action: 'Help me prep for my next meeting in my Google Calendar by telling me what it is and a bit about who the attendees are using a web search.',
      appSlugs: ['app_13Gh2V'],
      webSearchIcon: true,
    },
    {
      title: 'Tell me about my recent customers',
      label: 'in Stripe and how much they spent',
      action: 'Tell me about the most recent 5 customers in Stripe — who are they and how much were their invoices?',
      appSlugs: ['app_OD5hrX'],
    },
    {
      title: 'Draft a product changelog',
      label: 'based on recently closed PRs',
      action: 'Summarize the 10 most recently closed PRs in GitHub and draft a changelog announcement for me in a Notion doc.',
      appSlugs: ['app_OrZhaO', 'app_X7Lhxr'],
    },
    {
      title: 'Summarize my calendar',
      label: 'for next week',
      action: 'Summarize the events on my calendar for next week and give me some of the key takeaway, not every single detail.',
      appSlugs: ['app_13Gh2V'],
    },
  ];

  return (
    <>
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
      
      <div
        data-testid="suggested-actions"
        className="grid sm:grid-cols-2 gap-2 w-full"
      >
      {suggestedActions.slice(0, isMobile ? 2 : 4).map((suggestedAction, index) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.05 * index }}
          key={`suggested-action-${suggestedAction.title}-${index}`}
          className="block"
        >
          <Button
            variant="ghost"
            onClick={(e) => handleActionClick(e, suggestedAction.action)}
            className="text-left border rounded-xl px-4 py-3.5 text-sm flex-1 flex-col gap-1 w-full h-auto justify-start items-start"
          >
            <div className="flex justify-between items-start w-full">
              <span className="font-medium">{suggestedAction.title}</span>
              {(suggestedAction.appSlugs && suggestedAction.appSlugs.length > 0 || suggestedAction.webSearchIcon) && (
                <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                  {/* Add web search icon */}
                  {suggestedAction.webSearchIcon && (
                    <div 
                      className="size-5 rounded-sm overflow-hidden flex items-center justify-center bg-muted/20"
                    >
                      <Globe className="size-4 text-foreground/70 dark:text-white" />
                    </div>
                  )}
                  {/* Add app icons (limit to 2) */}
                  {suggestedAction.appSlugs && suggestedAction.appSlugs.slice(0, suggestedAction.webSearchIcon ? 2 : 3).map((slug) => (
                    <div 
                      key={`app-icon-${slug}`} 
                      className="size-5 rounded-sm overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={`https://pipedream.com/s.v0/${slug}/logo/48`}
                        alt={slug}
                        className="size-full object-contain"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <span className="text-muted-foreground break-words">
              {suggestedAction.label}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
    </>
  );
}

export const SuggestedActions = memo(PureSuggestedActions, () => true);
