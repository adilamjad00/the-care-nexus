'use client';

import { useGetDashboardQuery } from '@/store/api/patientApi';
import { useSelector } from 'react-redux';
import DashboardStats from '@/components/patient/DashboardStats';
import DoctorsVisitedCard from '@/components/patient/DoctorsVisitedCard';
import RecentPrescriptions from '@/components/patient/RecentPrescriptions';
import UpcomingAppointmentsWidget from '@/components/patient/UpcomingAppointmentsWidget';
import UpcomingFollowUpsWidget from '@/components/patient/UpcomingFollowUpsWidget';
import SpentChart from '@/components/patient/SpentChart';
import ConnectionRequestsWidget from '@/components/patient/ConnectionRequestsWidget';
import { useTranslations } from 'next-intl';

export default function PatientDashboard() {
  const t = useTranslations();
  const { data, isLoading } = useGetDashboardQuery(undefined);
  const user = useSelector((state: any) => state.auth.user);

  return (
    <div className='space-y-5 animate-in'>
      <div>
        <h1 className='text-xl font-bold text-text-primary'>
          {t('nav.dashboard')}
        </h1>
        <p className='text-text-secondary mt-0.5 text-sm'>
          {t('patient.dashboard.welcomeBack')}{' '}
          <span className='font-semibold text-text-primary'>
            {user?.name?.split(' ')[0] || 'Member'}
          </span>
        </p>
      </div>

      {isLoading ? (
        <div className='space-y-6 animate-pulse'>
          {/* Stat cards */}
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='rounded-2xl bg-white shadow-sm border border-black/6 p-5 flex items-center justify-between'
              >
                <div className='h-10 w-10 rounded-xl bg-gray-100 mb-3' />
                <div className='h-8 w-16 rounded bg-gray-100 mb-2' />
                <div className='h-3 w-24 rounded bg-gray-100' />
              </div>
            ))}
          </div>
          {/* Charts row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
            <div className='rounded-2xl bg-white shadow-sm border border-black/6 p-6'>
              <div className='h-5 w-32 rounded bg-surface mb-4' />
              <div className='h-56 rounded-xl bg-surface' />
            </div>
            <div className='rounded-2xl bg-white shadow-sm border border-black/6 p-6'>
              <div className='h-5 w-36 rounded bg-surface mb-4' />
              <div className='space-y-3'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-lg bg-surface shrink-0' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-4 w-32 rounded bg-surface' />
                      <div className='h-3 w-24 rounded bg-surface' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Appointments + Prescriptions row */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='rounded-2xl bg-white shadow-sm border border-black/6 p-6'
              >
                <div className='flex items-center justify-between mb-4'>
                  <div className='h-5 w-40 rounded bg-surface' />
                  <div className='h-4 w-12 rounded bg-surface' />
                </div>
                <div className='space-y-3'>
                  {[1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className='rounded-2xl border border-border-light p-4 space-y-2'
                    >
                      <div className='h-4 w-36 rounded bg-surface' />
                      <div className='h-3 w-48 rounded bg-surface' />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Follow-ups */}
          <div className='rounded-2xl bg-white shadow-sm border border-black/6 p-6'>
            <div className='h-5 w-40 rounded bg-surface mb-4' />
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='rounded-2xl border border-border-light p-4 space-y-2'
                >
                  <div className='h-4 w-28 rounded bg-surface' />
                  <div className='h-3 w-36 rounded bg-surface' />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <ConnectionRequestsWidget />
          <DashboardStats
            appointmentsThisWeek={data?.data?.appointmentsThisWeek || 0}
            appointmentsLastWeek={data?.data?.appointmentsLastWeek || 0}
            appointmentsThisMonth={data?.data?.appointmentsThisMonth || 0}
            appointmentsLastMonth={data?.data?.appointmentsLastMonth || 0}
            totalPrescriptions={data?.data?.totalPrescriptions || 0}
            totalSpent={data?.data?.totalSpent || 0}
          />

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
            <SpentChart data={data?.data?.spendingTrend || []} />
            <DoctorsVisitedCard doctors={data?.data?.doctorsVisited || []} />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
            <UpcomingAppointmentsWidget
              appointments={data?.data?.upcomingAppointments || []}
            />
            <RecentPrescriptions
              prescriptions={data?.data?.recentPrescriptions || []}
            />
          </div>

          <div className='grid grid-cols-1 gap-6 lg:grid-cols-1'>
            <UpcomingFollowUpsWidget
              followUps={data?.data?.upcomingFollowUps || []}
            />
          </div>
        </>
      )}
    </div>
  );
}
