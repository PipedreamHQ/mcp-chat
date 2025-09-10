'use client';

import Image from 'next/image';
import Link from 'next/link';

export function SignedOutHeader() {
  return (
    <header className="flex items-center w-full px-4 py-3 bg-background gap-4 sticky top-0 z-10 border-b">
      <Link href="/" className="flex items-center">
        <Image
          src="/images/Logo-01.png"   // ✅ your Virgo logo file
          alt="Virgo Logo"
          width={108}
          height={32}
          priority
        />
      </Link>
    </header>
  );
}
