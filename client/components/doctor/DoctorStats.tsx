'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import LayoutDashboardIcon from '@/icons/layout-dashboard-icon';
import UsersIcon from '@/icons/users-icon';
import StarIcon from '@/icons/star-icon';
import CurrencyDollarIcon from '@/icons/currency-dollar-icon';
import Link from 'next/link';

interface DoctorStatsProps {
  totalSessions: number;
  pendingQueue: number;
  averageRating: number;
  monthlyRevenue: number;
}

export default function DoctorStats({
  totalSessions,
  pendingQueue,
  averageRating,
  monthlyRevenue,
}: DoctorStatsProps) {
  const t = useTranslations();

  const stats = useMemo(
    () => [
      {
        label: t('doctor.dashboard.todaysSessions'),
        value: totalSessions,
        icon: LayoutDashboardIcon,
        color: 'text-primary',
        bg: 'bg-primary-light',
        blob: 'bg-primary/10',
        href: '/dashboard/doctor/appointments',
        isAmount: false,
      },
      {
        label: t('doctor.dashboard.activeQueue'),
        value: pendingQueue,
        icon: UsersIcon,
        color: 'text-[#DCAE1D]',
        bg: 'bg-warning/15',
        blob: 'bg-warning/10',
        href: '/dashboard/doctor/appointments',
        isAmount: false,
      },
      {
        label: t('doctor.dashboard.patientRating'),
        value: averageRating.toFixed(1),
        icon: StarIcon,
        color: 'text-[#DCAE1D]',
        bg: 'bg-warning/15',
        blob: 'bg-warning/10',
        href: '/dashboard/doctor/patients',
        isAmount: false,
      },
      {
        label: t('doctor.dashboard.monthlyRevenue'),
        value: monthlyRevenue.toLocaleString(),
        icon: CurrencyDollarIcon,
        color: 'text-[#558B2F]',
        bg: 'bg-success/20',
        blob: 'bg-success/15',
        href: '/dashboard/doctor/revenue',
        isAmount: true,
      },
    ],
    [totalSessions, pendingQueue, averageRating, monthlyRevenue, t],
  );

  return (
    <div className='grid grid-cols-1 min-[406px]:grid-cols-2 xl:grid-cols-4 gap-4 animate-in'>
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Link key={stat.label} href={stat.href} className='block group'>
            <div className='stat-card relative overflow-hidden min-h-30'>
              {/* Decorative blob */}
              <div
                className={`absolute -top-6 -right-6 h-20 w-20 ${stat.blob} rounded-full blur-2xl opacity-60 group-hover:opacity-85 transition-opacity`}
              />

              <div className='relative'>
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${stat.bg} mb-3`}
                >
                  <Icon className={`h-5 w-5 ${stat.color} stroke-[2.5px]`} />
                </div>

                {/* Value */}
                <div className='flex items-baseline gap-1 min-w-0'>
                  {stat.isAmount && (
                    <span className='text-sm font-bold text-text-secondary'>
                      {t('common.pkr')}
                    </span>
                  )}
                  <p className='text-3xl font-black text-text-primary tracking-tight truncate'>
                    {stat.value}
                  </p>
                </div>

                {/* Label */}
                <p className='mt-1.5 text-[11px] font-semibold text-text-secondary tracking-widest uppercase leading-tight'>
                  {stat.label}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
