'use client';

import { useRouter } from 'next/navigation';
import { clearSession } from '../services/authService';

export function useAppNavigation() {
  const router = useRouter();

  return {
    goToHome: () => router.push('/home'),
    goToSearch: () => router.push('/search'),
    goToUpdate: (id: string) => router.push(`/update?id=${id}`),
    goToCreate: () => router.push('/create'),
    goBack: () => router.back(),
    logout: () => {
      clearSession();
      router.replace('/');
    },
  };
}
