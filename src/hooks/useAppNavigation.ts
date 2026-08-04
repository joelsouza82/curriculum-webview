'use client';

import { useRouter } from 'next/navigation';
import { clearSession } from '../services/authService';

export function useAppNavigation() {
  const router = useRouter();

  return {
    goToHome: (loginId: string) => router.push(`/home?loginId=${loginId}`),
    goToPersonal: (loginId: string) => router.push(`/personal?loginId=${loginId}`),
    goToSearch: (loginId: string) => router.push(`/personal/search?loginId=${loginId}`),
    goToUpdate: (loginId: string) => router.push(`/personal/update?loginId=${loginId}`),
    goToCreate: (loginId: string) => router.push(`/personal/create?loginId=${loginId}`),
    goBack: () => router.back(),
    logout: () => {
      clearSession();
      router.replace('/');
    },
  };
}
