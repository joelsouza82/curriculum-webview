'use client';

import { useRouter } from 'next/navigation';
import { clearSession } from '../services/authService';

export function useAppNavigation() {
  const router = useRouter();

  return {
    goToHome: () => router.push('/home'),
    goToPersonal: () => router.push('/personal'),
    goToSearch: () => router.push('/personal/search'),
    goToUpdate: (id: string) => router.push(`/personal/update?id=${id}`),
    goToCreate: () => router.push('/personal/create'),
    goBack: () => router.back(),
    logout: () => {
      clearSession();
      router.replace('/');
    },
  };
}
