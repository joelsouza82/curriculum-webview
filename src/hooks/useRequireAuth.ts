'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '../services/authService';
import { AuthSession } from '../types/auth';

export function useRequireAuth(): AuthSession | null {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const currentSession = getSession();
    if (!currentSession) {
      router.replace('/');
      return;
    }
    setSession(currentSession);
  }, [router]);

  return session;
}
