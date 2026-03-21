'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { hydrateLocalStorageFromCloud } from '@/lib/storage';
import { useStoredValue } from '@/lib/storage-hooks';

const PUBLIC_PATHS = new Set(['/login']);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authenticated = useStoredValue('loginSession', false);
  const hydratedRef = useRef(false);
  const isLoginPath = pathname === '/login' || pathname.startsWith('/login/');
  const isPublicPath = isLoginPath || PUBLIC_PATHS.has(pathname);

  useEffect(() => {
    if (!authenticated && !isPublicPath) {
      router.replace('/login');
      return;
    }

    if (authenticated && isLoginPath) {
      router.replace('/');
    }
  }, [authenticated, isPublicPath, isLoginPath, router]);

  useEffect(() => {
    if (!authenticated || hydratedRef.current) return;
    hydratedRef.current = true;
    void hydrateLocalStorageFromCloud();
  }, [authenticated]);

  if ((!authenticated && !isPublicPath) || (authenticated && isLoginPath)) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__card">
          <Heart className="h-10 w-10 text-pink-300 animate-pulse" fill="currentColor" />
          <p>One moment...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
