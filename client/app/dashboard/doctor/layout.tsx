'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DoctorSidebar from '@/components/doctor/DoctorSidebar';
import DoctorTopbar from '@/components/doctor/DoctorTopbar';
import OnboardingGate from '@/components/onboarding/OnboardingGate';
import { ChatSocketProvider } from '@/providers/ChatSocketProvider';
import { useTranslations } from 'next-intl';
import { AUTH_EXPIRED_EVENT } from '@/lib/authSession';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');

    if (!userStr || !accessToken) {
      router.replace('/login');
      setIsCheckingAuth(false);
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (!userData.roles || !userData.roles.includes('doctor')) {
        router.replace('/login');
        setIsCheckingAuth(false);
        return;
      }
      setIsAuthorized(true);
    } catch {
      router.replace('/login');
    } finally {
      setIsCheckingAuth(false);
    }
  }, [router]);

  useEffect(() => {
    const handleAuthExpired = () => router.replace('/login');
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [router]);

  if (isCheckingAuth || !isAuthorized) return null;

  return (
    <ChatSocketProvider>
      <div className='flex flex-col min-h-screen bg-background print:block'>
        <div className='flex flex-1 w-full print:block'>
          <div className='print:hidden'>
            <DoctorSidebar />
          </div>
          <div className='flex-1 flex flex-col min-w-0 print:block'>
            <div className='print:hidden'>
              <DoctorTopbar title={t('nav.doctorDashboard')} />
            </div>
            <OnboardingGate role='doctor'>
              <main className='flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 print:p-0 print:m-0 bg-background'>
                <div className='max-w-7xl mx-auto print:max-w-none'>
                  {children}
                </div>
              </main>
            </OnboardingGate>
          </div>
        </div>
      </div>
    </ChatSocketProvider>
  );
}
