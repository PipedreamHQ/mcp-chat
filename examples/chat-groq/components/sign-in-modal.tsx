'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => {
      if (!open) onClose();
    }}>
      <AlertDialogContent className="h-[400px] md:h-[375px] flex flex-col items-center p-6 pt-12 sm:p-8 sm:pt-12 w-[calc(100%-32px)] max-w-lg sm:w-full rounded-lg">
        {/* Close button (X) at top right */}
        <Button
          variant="ghost"
          className="absolute right-4 top-4 p-2 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            onClose();
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
          </svg>
        </Button>

        <div className="flex flex-col items-center text-center justify-center flex-1 w-full">
          {/* Pipedream Logo */}
          <div className="mb-6">
            <Image
              src="/images/pipedream.svg"
              alt="Pipedream"
              width={180}
              height={40}
              priority
              className="dark:invert"
            />
          </div>

          <AlertDialogHeader className="text-center mb-6 w-full">
            <AlertDialogTitle className="text-xl"></AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-center text-md text">
              To use Pipedream Chat, sign up for free or sign in
            </AlertDialogDescription>
          </AlertDialogHeader>

          {/* Sign in with Google button */}
          <Button 
            className="w-full max-w-xs mb-6"
            variant="blue"
            onClick={handleSignIn}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign in with Google
          </Button>
          
          <p className="text-sm text-muted-foreground mt-auto text-center px-4">
            By signing in, you agree to Pipedream&apos;s{" "}
            <a href="https://pipedream.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="https://pipedream.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}