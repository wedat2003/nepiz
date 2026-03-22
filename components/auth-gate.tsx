'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { hydrateLocalStorageFromCloud } from '@/lib/storage';
import { useStoredValue } from '@/lib/storage-hooks';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authenticated = useStoredValue('loginSession', false);
  const hydratedRef = useRef(false);
  const isLoginPath = /(^|\/)login\/?$/.test(pathname);
  const isPublicPath = isLoginPath;

  useEffect(() => {
    if (!authenticated && !isPublicPath) {
      router.replace('/login');
      const timer = window.setTimeout(() => {
        if (!/(^|\/)login\/?$/.test(window.location.pathname)) {
          window.location.assign('/login');
        }
      }, 180);
      return () => window.clearTimeout(timer);
    }

    if (authenticated && isLoginPath) {
      router.replace('/');
      const timer = window.setTimeout(() => {
        if (/(^|\/)login\/?$/.test(window.location.pathname)) {
          window.location.assign('/');
        }
      }, 180);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [authenticated, isPublicPath, isLoginPath, router]);

  useEffect(() => {
    if (!authenticated || hydratedRef.current) return;
    hydratedRef.current = true;
    void hydrateLocalStorageFromCloud();
  }, [authenticated]);

  const needsTransition = (!authenticated && !isPublicPath) || (authenticated && isLoginPath);

  if (needsTransition) {
    const fallbackHref = authenticated ? '/' : '/login';
    const fallbackLabel = authenticated ? 'Continue to home' : 'Continue to login';
    return (
      <div className="auth-loading">
        <div className="auth-loading__card">
          <Heart className="h-10 w-10 text-pink-300 animate-pulse" fill="currentColor" />
          <p>One moment...</p>
          <a href={fallbackHref} className="btn mt-2">
            {fallbackLabel}
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
