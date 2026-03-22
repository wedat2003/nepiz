'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { hydrateLocalStorageFromCloud, loadValueFromStorage } from '@/lib/storage';
import { useStoredValue } from '@/lib/storage-hooks';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const authenticated = useStoredValue('loginSession', false);
  const effectiveAuthenticated = authenticated || loadValueFromStorage('loginSession', false);
  const hydratedRef = useRef(false);
  const isLoginPath = /(^|\/)login\/?$/.test(pathname);
  const isPublicPath = isLoginPath;

  useEffect(() => {
    if (!effectiveAuthenticated && !isPublicPath) {
      router.replace('/login');
      const timer = window.setTimeout(() => {
        if (!/(^|\/)login\/?$/.test(window.location.pathname)) {
          window.location.assign('/login');
        }
      }, 180);
      return () => window.clearTimeout(timer);
    }

    if (effectiveAuthenticated && isLoginPath) {
      router.replace('/');
      const timer = window.setTimeout(() => {
        if (/(^|\/)login\/?$/.test(window.location.pathname)) {
          window.location.assign('/');
        }
      }, 180);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [effectiveAuthenticated, isPublicPath, isLoginPath, router]);

  useEffect(() => {
    if (!effectiveAuthenticated || hydratedRef.current) return;
    hydratedRef.current = true;
    void hydrateLocalStorageFromCloud();
  }, [effectiveAuthenticated]);

  const needsTransition = (!effectiveAuthenticated && !isPublicPath) || (effectiveAuthenticated && isLoginPath);

  if (needsTransition) {
    const fallbackHref = effectiveAuthenticated ? '/' : '/login';
    const fallbackLabel = effectiveAuthenticated ? 'Continue to home' : 'Continue to login';
    return (
      <div className="auth-loading">
        <div className="auth-loading__card">
          <Heart className="h-10 w-10 text-pink-300 animate-pulse" fill="currentColor" />
          <p>One moment...</p>
          <Link href={fallbackHref} className="btn mt-2">
            {fallbackLabel}
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
