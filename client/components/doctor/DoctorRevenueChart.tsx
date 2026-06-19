'use client';

import { useState } from 'react';
import { useGetRevenueAnalyticsQuery } from '@/store/api/doctorApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useFormatter, useTranslations } from 'next-intl';

export default function DoctorRevenueChart() {
  const t = useTranslations();
  const format = useFormatter();
  const [period, setPeriod] = useState<'day' | 'month' | 'year'>('month');
  const { data, isLoading } = useGetRevenueAnalyticsQuery(period);

  const chartData = data?.data?.chartData || [];

  const getDayLabel = (value: unknown) => {
    const raw = String(value ?? '').trim();
    if (!raw) return '';

    if (/^\d+$/.test(raw)) {
      return format.number(Number(raw));
    }

    const shortDay = raw.slice(0, 3);
    const normalizedDay =
      shortDay.charAt(0).toUpperCase() + shortDay.slice(1).toLowerCase();
    const dayKey = `common.days.${normalizedDay}`;
    return t.has(dayKey) ? t(dayKey) : raw;
  };

  const getMonthLabel = (value: unknown) => {
    const raw = String(value ?? '').trim();
    if (!raw) return '';

    if (/^\d+$/.test(raw)) {
      return format.number(Number(raw));
    }

    const monthPart = raw.substring(0, 3);
    const monthKey =
      monthPart.charAt(0).toUpperCase() + monthPart.slice(1).toLowerCase();
    const translationKey = `common.months.${monthKey}`;
    return t.has(translationKey) ? t(translationKey) : raw;
  };

  const totalRevenueLabel = t.has('analytics.totalRevenue')
    ? t('analytics.totalRevenue')
    : 'Total Revenue';

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
        <div>
          <CardTitle className='text-xl'>{t('doctor.revenue.title')}</CardTitle>
        </div>

        <div className='flex w-full md:w-auto items-center justify-between gap-1 bg-[rgba(105,133,255,0.06)] p-1 rounded-xl border border-[rgba(105,133,255,0.08)]'>
          {[
            { id: 'day', label: t('analytics.week') },
            { id: 'month', label: t('analytics.month') },
            { id: 'year', label: t('analytics.year') },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as any)}
              className={`flex-1 md:flex-none px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                period === p.id
                  ? 'bg-white shadow-sm text-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className='h-64 bg-surface/30 rounded-2xl animate-pulse'></div>
        ) : (
          <div className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#e5e7eb'
                />
                <XAxis
                  dataKey='label'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '500' }}
                  interval={
                    period === 'month'
                      ? 4
                      : period === 'year'
                        ? 1
                        : 'preserveStartEnd'
                  }
                  tickFormatter={(val) => {
                    if (period === 'day') return getDayLabel(val);
                    if (period === 'month' || period === 'year')
                      return getMonthLabel(val);
                    return val;
                  }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  width={40}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '500' }}
                  tickFormatter={(value) =>
                    `${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`
                  }
                  domain={[
                    0,
                    (data: any) =>
                      Math.max(
                        data.max > 50000
                          ? data.max
                          : period === 'day'
                            ? 50000
                            : period === 'month'
                              ? 150000
                              : 500000,
                      ),
                  ]}
                />
                <Tooltip
                  cursor={{ fill: '#EFF4FB', opacity: 0.15 }}
                  contentStyle={{
                    backgroundColor: '#081C44',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
                  }}
                  itemStyle={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '12px',
                  }}
                  labelStyle={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    marginBottom: '4px',
                    fontSize: '10px',
                    fontWeight: 'bold',
                  }}
                  labelFormatter={(val: any) => {
                    if (period === 'day') return getDayLabel(val);
                    return getMonthLabel(val);
                  }}
                  formatter={(value: any) => [
                    `${value?.toLocaleString()} ${t('common.pkr')}`,
                    totalRevenueLabel,
                  ]}
                />
                <Bar
                  dataKey='revenue'
                  fill='url(#colorRev)'
                  radius={[8, 8, 8, 8]}
                  barSize={period === 'day' ? 40 : 20}
                />
                <defs>
                  <linearGradient id='colorRev' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#6ABFF3' stopOpacity={1} />
                    <stop offset='95%' stopColor='#6985FF' stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
