'use client';

import {
  useGetTodayQueueQuery,
  useGetDoctorProfileQuery,
  useGetAppointmentsQuery,
} from '@/store/api/doctorApi';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import DoctorRevenueChart from '@/components/doctor/DoctorRevenueChart';
import DoctorStats from '@/components/doctor/DoctorStats';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import AlarmClockPlusIcon from '@/icons/alarm-clock-plus-icon';
import RightChevronIcon from '@/icons/right-chevron';
import PenIcon from '@/icons/pen-icon';
import AccessibilityIcon from '@/icons/accessibility-icon';
import { useTranslations } from 'next-intl';

export default function DoctorDashboard() {
  const t = useTranslations();
  const { data, isLoading } = useGetTodayQueueQuery(undefined);
  const { data: profileData } = useGetDoctorProfileQuery(undefined);
  const { data: upcomingData } = useGetAppointmentsQuery({
    status: 'upcoming',
    limit: 5,
  });

  const statusPriority: Record<string, number> = {
    completed: 5,
    'in-progress': 4,
    confirmed: 3,
    pending: 2,
    reserved: 1,
    cancelled: 0,
  };

  const todayQueue = (data?.data?.appointments || []).reduce(
    (list: any[], appointment: any) => {
      const slotKey = `${appointment.patientId?._id || appointment.patientId}-${appointment.doctorId?._id || appointment.doctorId}-${String(appointment.dateTime || '')}`;
      const existingIndex = list.findIndex(
        (item) =>
          `${item.patientId?._id || item.patientId}-${item.doctorId?._id || item.doctorId}-${String(item.dateTime || '')}` ===
          slotKey,
      );

      if (existingIndex === -1) {
        list.push(appointment);
        return list;
      }

      const existing = list[existingIndex];
      const nextPriority =
        statusPriority[String(appointment.status || '').toLowerCase()] ?? -1;
      const currentPriority =
        statusPriority[String(existing.status || '').toLowerCase()] ?? -1;

      if (
        nextPriority > currentPriority ||
        (nextPriority === currentPriority &&
          new Date(appointment.updatedAt || 0).getTime() >
            new Date(existing.updatedAt || 0).getTime())
      ) {
        list[existingIndex] = appointment;
      }

      return list;
    },
    [],
  );
  const stats = {
    total: data?.data?.stats?.total || 0,
    pending: data?.data?.stats?.pending || 0,
    completed: data?.data?.stats?.completed || 0,
    inProgress: data?.data?.stats?.inProgress || 0,
  };

  const averageRating = profileData?.data?.averageRating || 4.8;
  const monthlyRevenue = data?.data?.stats?.thisMonthRevenue || 0;

  if (isLoading) {
    return (
      <div className='space-y-6 animate-pulse'>
        {/* Header */}
        <div className='space-y-2'>
          <div className='h-7 w-40 rounded-[10px] bg-[rgba(37,99,235,0.08)]' />
          <div className='h-4 w-56 rounded-[10px] bg-[rgba(37,99,235,0.06)]' />
        </div>
        {/* Stat cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='rounded-[18px] bg-white border border-[rgba(37,99,235,0.10)] p-5 shadow-[0_2px_12px_rgba(37,99,235,0.06)] flex items-start justify-between gap-3'
            >
              <div className='space-y-2.5 flex-1'>
                <div className='h-3 w-20 rounded-[8px] bg-[rgba(37,99,235,0.08)]' />
                <div className='h-8 w-14 rounded-[8px] bg-[rgba(37,99,235,0.08)]' />
                <div className='h-3 w-28 rounded-[8px] bg-[rgba(37,99,235,0.06)]' />
              </div>
              <div className='h-12 w-12 rounded-[12px] bg-[rgba(37,99,235,0.08)] shrink-0' />
            </div>
          ))}
        </div>
        {/* Queue + Tools row */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
          <div className='rounded-[18px] bg-white border border-[rgba(37,99,235,0.10)] shadow-[0_2px_12px_rgba(37,99,235,0.06)] p-6 space-y-4'>
            <div className='h-5 w-44 rounded-[8px] bg-[rgba(37,99,235,0.08)]' />
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className='flex items-center gap-3 rounded-[14px] border border-[rgba(37,99,235,0.07)] p-4'
              >
                <div className='h-11 w-11 rounded-full bg-[rgba(37,99,235,0.08)] shrink-0' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-28 rounded-[8px] bg-[rgba(37,99,235,0.08)]' />
                  <div className='h-3 w-20 rounded-[8px] bg-[rgba(37,99,235,0.06)]' />
                </div>
                <div className='h-8 w-8 rounded-full bg-[rgba(37,99,235,0.08)]' />
              </div>
            ))}
          </div>
          <div className='space-y-5'>
            <div className='rounded-[18px] bg-white border border-[rgba(37,99,235,0.10)] shadow-[0_2px_12px_rgba(37,99,235,0.06)] p-6'>
              <div className='h-5 w-32 rounded-[8px] bg-[rgba(37,99,235,0.08)] mb-4' />
              <div className='grid grid-cols-2 gap-4'>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className='rounded-[14px] border border-[rgba(37,99,235,0.07)] p-6 flex flex-col items-center gap-3'
                  >
                    <div className='h-12 w-12 rounded-[12px] bg-[rgba(37,99,235,0.08)]' />
                    <div className='h-4 w-20 rounded-[8px] bg-[rgba(37,99,235,0.08)]' />
                  </div>
                ))}
              </div>
            </div>
            <div className='rounded-[18px] bg-white border border-[rgba(37,99,235,0.10)] shadow-[0_2px_12px_rgba(37,99,235,0.06)] p-6'>
              <div className='h-5 w-28 rounded-[8px] bg-[rgba(37,99,235,0.08)] mb-4' />
              <div className='h-44 rounded-[14px] bg-[rgba(37,99,235,0.06)]' />
            </div>
          </div>
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
        <p className='text-text-secondary mt-0.5 text-sm'>
          {t('doctor.dashboard.welcomeBack')}{' '}
          <span className='font-semibold text-text-primary'>
            {profileData?.data?.fullName?.split(' ')[0] || 'Member'}
          </span>
        </p>
      </div>

      <DoctorStats
        totalSessions={stats.total}
        pendingQueue={stats.pending}
        averageRating={averageRating}
        monthlyRevenue={monthlyRevenue}
      />

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6'>
        <Card>
          <CardHeader className='flex flex-col sm:flex-row sm:items-center justify-between gap-2'>
            <CardTitle className='text-xl'>
              {t('doctor.dashboard.todaysAppointments')}
            </CardTitle>
            <Link
              href='/dashboard/doctor/appointments'
              className='text-sm font-bold text-primary hover:underline hover:underline-offset-4'
            >
              {t('doctor.dashboard.viewSchedule')}
            </Link>
          </CardHeader>
          <CardContent>
            {todayQueue.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-10 text-center'>
                <div className='w-12 h-12 bg-[rgba(37,99,235,0.07)] rounded-[14px] flex items-center justify-center mb-4'>
                  <AlarmClockPlusIcon className='w-6 h-6 text-primary/50' />
                </div>
                <p className='text-sm font-bold text-text-primary tracking-wide'>
                  {t('doctor.dashboard.queueClear')}
                </p>
                <p className='text-[11px] font-medium text-text-muted mt-1'>
                  {t('doctor.dashboard.checkBackLater')}
                </p>
              </div>
            ) : (
              <div className='space-y-2.5'>
                {todayQueue.slice(0, 5).map((appointment: any) => (
                  <div
                    key={appointment._id}
                    className='group rounded-[14px] bg-[rgba(37,99,235,0.04)] border border-[rgba(37,99,235,0.07)] p-4 hover:bg-[rgba(37,99,235,0.07)] transition-all flex items-center justify-between gap-3'
                  >
                    <div className='flex items-center gap-3 min-w-0'>
                      <div className='h-10 w-10 rounded-full overflow-hidden shrink-0 border border-[rgba(37,99,235,0.12)] bg-white flex items-center justify-center'>
                        {appointment.patientId?.photo ? (
                          <img
                            src={appointment.patientId.photo}
                            alt={appointment.patientId?.name || 'Patient'}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <AccessibilityIcon className='h-5 w-5 text-text-muted' />
                        )}
                      </div>
                      <div className='min-w-0'>
                        <p className='text-sm font-semibold text-text-primary truncate'>
                          {appointment.patientId?.name || 'Patient'}
                        </p>
                        <p className='text-xs text-text-secondary mt-0.5'>
                          {new Date(appointment.dateTime).toLocaleTimeString(
                            [],
                            { hour: '2-digit', minute: '2-digit' },
                          )}
                          {' · '}
                          <span className='capitalize'>
                            {appointment.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Link
                      href='/dashboard/doctor/appointments'
                      className='p-2 rounded-[8px] bg-white/80 text-text-muted group-hover:bg-primary group-hover:text-white transition-all shrink-0 border border-[rgba(37,99,235,0.08)]'
                    >
                      <RightChevronIcon className='h-3.5 w-3.5' />
                    </Link>
                  </div>
                ))}
              </div>
            )}
            {todayQueue.length > 5 && (
              <Link
                href='/dashboard/doctor/appointments'
                className='mt-3 block text-center py-3 rounded-[12px] bg-[rgba(37,99,235,0.04)] text-sm font-semibold text-text-secondary hover:bg-[rgba(37,99,235,0.08)] hover:text-primary transition-colors'
              >
                + {todayQueue.length - 5} {t('common.viewAll')}
              </Link>
            )}
          </CardContent>
        </Card>

        <div className='space-y-6'>
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader className='flex flex-row items-center justify-between'>
              <CardTitle>Upcoming Appointments</CardTitle>
              <Link
                href='/dashboard/doctor/appointments'
                className='text-sm font-semibold text-primary hover:underline hover:underline-offset-4'
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              {(() => {
                const upcoming = (
                  upcomingData?.data?.appointments ||
                  upcomingData?.data ||
                  []
                )
                  .filter(
                    (a: any) =>
                      new Date(a.dateTime) > new Date() &&
                      a.status !== 'cancelled',
                  )
                  .sort(
                    (a: any, b: any) =>
                      new Date(a.dateTime).getTime() -
                      new Date(b.dateTime).getTime(),
                  )
                  .slice(0, 4);

                if (upcoming.length === 0) {
                  return (
                    <div className='flex flex-col items-center justify-center py-8 text-center'>
                      <div className='h-10 w-10 rounded-xl bg-primary/8 flex items-center justify-center mb-2'>
                        <AlarmClockPlusIcon className='h-5 w-5 text-primary' />
                      </div>
                      <p className='text-sm text-text-secondary'>
                        No upcoming appointments
                      </p>
                    </div>
                  );
                }

                return (
                  <div className='space-y-2.5'>
                    {upcoming.map((a: any) => {
                      const dt = new Date(a.dateTime);
                      const dateStr = dt.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      });
                      const timeStr = dt.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      return (
                        <div
                          key={a._id}
                          className='flex items-center gap-3 rounded-[14px] bg-[rgba(37,99,235,0.04)] border border-[rgba(37,99,235,0.07)] p-3 hover:bg-[rgba(37,99,235,0.07)] transition-all'
                        >
                          <div className='h-10 w-10 rounded-full bg-white border border-[rgba(37,99,235,0.12)] flex items-center justify-center shrink-0 overflow-hidden'>
                            {a.patientId?.photo ? (
                              <img
                                src={a.patientId.photo}
                                className='h-full w-full object-cover'
                                alt=''
                              />
                            ) : (
                              <AccessibilityIcon className='h-5 w-5 text-text-muted' />
                            )}
                          </div>
                          <div className='flex-1 min-w-0'>
                            <p className='text-sm font-semibold text-text-primary truncate'>
                              {a.patientId?.name || 'Patient'}
                            </p>
                            <p className='text-xs text-text-secondary mt-0.5'>
                              {dateStr} · {timeStr}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize border ${
                              a.status === 'confirmed'
                                ? 'bg-[rgba(37,99,235,0.08)] text-primary border-[rgba(37,99,235,0.18)]'
                                : a.status === 'pending'
                                  ? 'bg-[rgba(238,226,96,0.18)] text-[#7A6610] border-[rgba(238,226,96,0.38)]'
                                  : 'bg-[rgba(37,99,235,0.04)] text-text-secondary border-[rgba(37,99,235,0.07)]'
                            }`}
                          >
                            {a.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>
                {t('doctor.dashboard.practiceTools')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                <Link
                  href='/dashboard/doctor/prescriptions/new'
                  className='p-5 bg-[rgba(37,99,235,0.04)] rounded-[14px] border border-[rgba(37,99,235,0.07)] hover:bg-[rgba(37,99,235,0.08)] transition-all flex flex-col items-center text-center'
                >
                  <div className='h-12 w-12 bg-[rgba(37,99,235,0.10)] text-primary rounded-[12px] flex items-center justify-center mb-3'>
                    <PenIcon className='h-5 w-5' />
                  </div>
                  <h3 className='text-sm font-semibold text-text-primary'>
                    {t('doctor.dashboard.newPrescription')}
                  </h3>
                </Link>
                <Link
                  href='/dashboard/doctor/appointments'
                  className='p-5 bg-[rgba(106,191,243,0.07)] rounded-[14px] border border-[rgba(106,191,243,0.15)] hover:bg-[rgba(106,191,243,0.12)] transition-all flex flex-col items-center text-center'
                >
                  <div className='h-12 w-12 bg-[rgba(106,191,243,0.18)] text-[#1E88BF] rounded-[12px] flex items-center justify-center mb-3'>
                    <AccessibilityIcon className='h-5 w-5' />
                  </div>
                  <h3 className='text-sm font-semibold text-text-primary'>
                    {t('nav.appointments')}
                  </h3>
                </Link>
              </div>
            </CardContent>
          </Card>

          <DoctorRevenueChart />
        </div>
      </div>
    </div>
  );
}
