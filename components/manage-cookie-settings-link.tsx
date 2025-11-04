'use client';

import { useCallback } from 'react';

import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    Cookiebot?: {
      show?: () => void;
      renew?: () => void;
    };
  }
}

export function ManageCookieSettingsLink() {
  const handleClick = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const cookiebot = window.Cookiebot;

    if (cookiebot?.show) {
      cookiebot.show();
      return;
    }

    if (cookiebot?.renew) {
      cookiebot.renew();
      return;
    }

    console.warn('Cookie consent banner is not available.');
  }, []);

  return (
    <Button
      type="button"
      variant="link"
      className="px-0 text-sm"
      onClick={handleClick}
    >
      Manage cookie settings
    </Button>
  );
}
