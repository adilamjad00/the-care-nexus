'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ClinicSidebar from '@/components/clinic/ClinicSidebar';
import ClinicTopbar from '@/components/clinic/ClinicTopbar';
import { AUTH_EXPIRED_EVENT } from '@/lib/authSession';

export default function ClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const handleAuthExpired = () => router.replace('/login');
    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    return () =>
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
  }, [router]);

  return (
    <div className='flex flex-col min-h-screen bg-background print:block'>
      <div className='flex flex-1 w-full print:block'>
        <div className='print:hidden'>
          <ClinicSidebar />
        </div>
        <div className='flex-1 flex flex-col min-w-0 print:block'>
          <div className='print:hidden'>
            <ClinicTopbar />
          </div>
          <main className='flex-1 p-4 md:p-8 overflow-y-auto print:p-0 print:m-0 print:overflow-visible'>
            <div className='max-w-7xl mx-auto print:max-w-none'>{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
