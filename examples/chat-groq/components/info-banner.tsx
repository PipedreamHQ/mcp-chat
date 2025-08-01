'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { X, Info } from 'lucide-react';

interface InfoBannerProps {
  isAuthDisabled: boolean;
  isPersistenceDisabled?: boolean;
  className?: string;
}

/**
 * Custom hook for managing dismissible banner states.
 * 
 * This demonstrates a pattern for handling multiple dismissible UI elements
 * with a single, reusable state management solution.
 */
function useDismissibleBanners() {
  const [dismissedBanners, setDismissedBanners] = useState<Set<string>>(new Set());

  const dismissBanner = (bannerId: string) => {
    setDismissedBanners(prev => new Set(prev).add(bannerId));
  };

  const isBannerDismissed = (bannerId: string) => {
    return dismissedBanners.has(bannerId);
  };

  return { dismissBanner, isBannerDismissed };
}

/**
 * Reusable banner component for displaying dismissible messages.
 * 
 * This component demonstrates how to create themed, dismissible banners
 * with consistent styling.
 */
function Banner({ 
  theme, 
  children, 
  onDismiss 
}: { 
  theme: 'warning' | 'info';
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  const isWarning = theme === 'warning';
  const containerClasses = isWarning 
    ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200'
    : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-200';
  const iconClasses = isWarning
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-blue-600 dark:text-blue-400';
  
  return (
    <div className={`flex items-start gap-2 sm:gap-3 p-2 sm:px-3 rounded-md border text-sm font-medium ${containerClasses}`}>
      <Info className={`size-4 shrink-0 mt-px ${iconClasses}`} />
      <div className="flex-1 min-w-0 leading-relaxed">
        {children}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDismiss}
        className="size-6 text-muted-foreground hover:text-foreground shrink-0 mt-px"
      >
        <X className="size-3" />
        <span className="sr-only">Dismiss</span>
      </Button>
    </div>
  );
}

/**
 * InfoBanner displays contextual information about the app's current configuration.
 * 
 * Shows different banners based on:
 * - Auth disabled: Warning about development mode
 * - Persistence disabled: Warning about chat storage
 * - Normal mode: Info about the MCP demo
 * 
 * This pattern allows developers to understand the current app state and
 * provides helpful links to documentation.
 */
export function InfoBanner({ isAuthDisabled: isAuthDisabledMode, isPersistenceDisabled = false, className = "" }: InfoBannerProps) {
  const { dismissBanner, isBannerDismissed } = useDismissibleBanners();

  const showMainBanner = !isBannerDismissed('main');
  const showPersistenceWarning = isPersistenceDisabled && !isBannerDismissed('persistence');

  // Don't render anything if both banners are dismissed
  if (!showMainBanner && !showPersistenceWarning) {
    return null;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {showMainBanner && (
        <Banner 
          theme={isAuthDisabledMode ? 'warning' : 'info'} 
          onDismiss={() => dismissBanner('main')}
        >
          {isAuthDisabledMode ? (
            <span>User sign-in is currently disabled, make sure to enable before shipping to production.</span>
          ) : (
            <span>
              This demo app showcases how you can integrate Pipedream&apos;s MCP server into your AI app.{' '}
              <a 
                href="https://pipedream.com/docs/connect/mcp/developers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline hover:text-blue-600 dark:hover:text-blue-400 font-semibold"
              >
                Check out our docs
              </a>
              {' '} to get started.
            </span>
          )}
        </Banner>
      )}

      {showPersistenceWarning && (
        <Banner 
          theme="warning" 
          onDismiss={() => dismissBanner('persistence')}
        >
          <span>Chat storage is currently disabled. Your conversations will not be saved.</span>
        </Banner>
      )}
    </div>
  );
}