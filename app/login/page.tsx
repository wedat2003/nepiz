'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, LockKeyhole, Sparkles } from 'lucide-react';
import { loadValueFromStorage, saveValueToStorage } from '@/lib/storage';

const LOVE_CODE = 'nepiz';

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const session = loadValueFromStorage('loginSession', false);
    if (session) {
      router.replace('/');
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (code.trim().toLowerCase() !== LOVE_CODE.toLowerCase()) {
      setError('That password is not correct yet.');
      return;
    }

    setError('');
    setIsUnlocking(true);
    saveValueToStorage('loginSession', true);

    window.setTimeout(() => {
      router.replace('/');
    }, 1500);
  };

  return (
    <main className="login-page">
      <div className="login-page__glow login-page__glow--left" />
      <div className="login-page__glow login-page__glow--right" />

      <section className={`login-card ${isUnlocking ? 'login-card--unlocking' : ''}`}>
        {isUnlocking ? (
          <div className="unlock-screen">
            <div className="unlock-heart">
              <Heart className="h-16 w-16" fill="currentColor" />
            </div>
            <h1>Only for you</h1>
            <p>Opening the page...</p>
          </div>
        ) : (
          <>
            <div className="login-card__badge">
              <Sparkles className="h-4 w-4" />
              Private entry
            </div>

            <div className="login-card__intro">
              <div className="login-card__icon">
                <Heart className="h-8 w-8" fill="currentColor" />
              </div>
              <h1>Welcome, my love</h1>
              <p>One password and your little world opens again.</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <label>
                Password
                <div className="login-form__field">
                  <LockKeyhole className="h-4 w-4" />
                  <input
                    type="password"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    placeholder="Your little secret"
                  />
                </div>
              </label>

              {error ? <p className="login-form__error">{error}</p> : null}

              <button type="submit" className="btn btnPrimary login-form__submit">
                Open
              </button>
            </form>

            <p className="login-card__hint">Hint: Your nickname</p>
          </>
        )}
      </section>
    </main>
  );
}
