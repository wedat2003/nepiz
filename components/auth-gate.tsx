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
  const ghBase = pathname.startsWith('/nepiz/') || pathname === '/nepiz' ? '/nepiz' : '';
  const loginPath = `${ghBase}/login`;
  const homePath = ghBase ? `${ghBase}/` : '/';
  const isLoginPath = /(^|\/)login\/?$/.test(pathname);
  const isPublicPath = isLoginPath;

  useEffect(() => {
    if (!authenticated && !isPublicPath) {
      router.replace(loginPath);
      return;
    }

    if (authenticated && isLoginPath) {
      router.replace(homePath);
    }
  }, [authenticated, isPublicPath, isLoginPath, router, loginPath, homePath]);

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
