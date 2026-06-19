'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import ClockIcon from '@/icons/clock-icon';
import ArrowBigUpIcon from '@/icons/arrow-big-up-icon';
import DescriptionIcon from '@/icons/file-description-icon';
import CurrencyDollarIcon from '@/icons/currency-dollar-icon';
import Link from 'next/link';

interface DashboardStatsProps {
  appointmentsThisWeek: number;
  appointmentsLastWeek: number;
  appointmentsThisMonth: number;
  appointmentsLastMonth: number;
  totalPrescriptions: number;
  totalSpent: number;
}

export default function DashboardStats({
  appointmentsThisWeek,
  appointmentsThisMonth,
  totalPrescriptions,
  totalSpent,
}: DashboardStatsProps) {
  const t = useTranslations();

  const stats = useMemo(
    () => [
      {
        label: t('patient.appointmentsThisWeek'),
        value: appointmentsThisWeek,
        icon: ClockIcon,
        color: 'text-primary',
        bg: 'bg-primary-light',
        blob: 'bg-primary/10',
        href: '/dashboard/patient/appointments',
        isAmount: false,
      },
      {
        label: t('patient.appointmentsThisMonth'),
        value: appointmentsThisMonth,
        icon: ArrowBigUpIcon,
        color: 'text-[#DCAE1D]',
        bg: 'bg-warning/15',
        blob: 'bg-warning/10',
        href: '/dashboard/patient/appointments',
        isAmount: false,
      },
      {
        label: t('nav.prescriptions'),
        value: totalPrescriptions,
        icon: DescriptionIcon,
        color: 'text-[#558B2F]',
        bg: 'bg-success/20',
        blob: 'bg-success/15',
        href: '/dashboard/patient/records',
        isAmount: false,
      },
      {
        label: t('patient.totalSpent'),
        value: totalSpent > 0 ? totalSpent.toLocaleString() : '0',
        icon: CurrencyDollarIcon,
        color: 'text-primary',
        bg: 'bg-sky/20',
        blob: 'bg-sky/15',
        href: '/dashboard/patient/spent',
        isAmount: true,
      },
    ],
    [
      appointmentsThisWeek,
      appointmentsThisMonth,
      totalPrescriptions,
      totalSpent,
      t,
    ],
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
