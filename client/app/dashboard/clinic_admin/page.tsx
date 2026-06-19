'use client';

import OverviewCards from '@/components/clinic/OverviewCards';
import PatientFlowChart from '@/components/clinic/PatientFlowChart';
import RevenueChart from '@/components/clinic/RevenueChart';
import { useSelector } from 'react-redux';
import { useTranslations } from 'next-intl';
import { useGetOverviewQuery } from '@/store/api/clinicApi';

export default function ClinicDashboard() {
  const t = useTranslations();
  const user = useSelector((state: any) => state.auth.user);
  const { isLoading } = useGetOverviewQuery(undefined);

  if (isLoading) {
    return (
      <div className='space-y-5 animate-pulse'>
        {/* Header */}
        <div className='space-y-2'>
          <div className='h-8 w-36 rounded bg-surface' />
          <div className='h-5 w-52 rounded bg-surface' />
        </div>
        {/* Stat cards */}
        <div className='grid grid-cols-1 min-[406px]:grid-cols-2 xl:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='rounded-2xl bg-white shadow-sm border border-black/6 p-5 flex items-center justify-between'
            >
              <div className='space-y-2 flex-1'>
                <div className='h-3 w-24 rounded bg-surface' />
                <div className='h-7 w-16 rounded bg-surface' />
                <div className='h-3 w-20 rounded bg-surface' />
              </div>
              <div className='h-11 w-11 rounded-lg bg-surface ml-3 shrink-0' />
            </div>
          ))}
        </div>
        {/* Charts row */}
        <div className='grid grid-cols-1 min-[800px]:grid-cols-2 gap-4 lg:gap-6'>
          {[1, 2].map((i) => (
            <div
              key={i}
              className='rounded-2xl bg-white shadow-sm border border-black/6 p-6'
            >
              <div className='h-5 w-36 rounded bg-surface mb-1' />
              <div className='h-3 w-24 rounded bg-surface mb-6' />
              <div className='h-56 rounded-2xl bg-surface' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-5 animate-in'>
      <div>
        <h1 className='text-xl font-bold text-text-primary'>
          {t('nav.dashboard')}
        </h1>
        {user && (
          <p className='text-text-secondary mt-0.5 text-sm'>
            {t('clinic.dashboard.welcomeBack')}{' '}
            <span className='font-semibold text-text-primary'>
              {user.name?.split(' ')[0] || 'Member'}
            </span>
          </p>
        )}
      </div>

      <OverviewCards />

      <div className='grid grid-cols-1 min-[800px]:grid-cols-2 gap-4 lg:gap-6'>
        <PatientFlowChart />
        <RevenueChart />
      </div>
    </div>
  );
}
