'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { InfoBanner } from '@/components/info-banner';
import { GitHubButton } from '@/components/github-button';
import { SignInModal } from './sign-in-modal';
import { useAuthContext } from './session-provider';

export function SignedOutHeader() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const { isAuthDisabled } = useAuthContext();

  const handleGetStarted = () => {
    setIsSignInModalOpen(true);
  };

  return (
    <header className="flex items-center w-full px-4 py-3 bg-background gap-4">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/pipedream.svg"
          alt="Pipedream"
          width={108}
          height={24}
          priority
          className="dark:invert"
        />
      </Link>
      
      <div className="flex items-center gap-3 ml-auto">
        <GitHubButton className="hidden md:flex" />
        <Button onClick={handleGetStarted} variant="blue">
          Get started
        </Button>
      </div>

      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)} 
      />
    </header>
  );
}