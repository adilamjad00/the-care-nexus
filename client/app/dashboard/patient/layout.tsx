'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PatientSidebar from '@/components/patient/PatientSidebar';
import PatientTopbar from '@/components/patient/PatientTopbar';
import { ChatSocketProvider } from '@/providers/ChatSocketProvider';
import { useTranslations } from 'next-intl';
import OnboardingGate from '@/components/onboarding/OnboardingGate';
import { AUTH_EXPIRED_EVENT } from '@/lib/authSession';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!userStr || !accessToken) {
      router.push('/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (!userData.roles || !userData.roles.includes('patient')) {
        router.push('/login');
        return;
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const handleAuthExpired = () => router.replace('/login');
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [router]);

  if (!mounted) return null;

  return (
    <ChatSocketProvider>
      <div className='flex flex-col min-h-screen bg-background print:block'>
        <div className='flex flex-1 w-full print:block'>
          <div className='print:hidden'>
            <PatientSidebar />
          </div>
          <div className='flex-1 flex flex-col print:block'>
            <div className='print:hidden'>
              <PatientTopbar title={t('nav.patientDashboard')} />
            </div>
            <main className='flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 print:p-0 print:m-0'>
              <div className='max-w-7xl mx-auto print:max-w-none'>
                <OnboardingGate role='patient'>{children}</OnboardingGate>
              </div>
            </main>
          </div>
        </div>
      </div>
    </ChatSocketProvider>
  );
}
