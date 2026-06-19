'use client';

import { useState } from 'react';
import { useGetRevenueQuery } from '@/store/api/clinicApi';
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

export default function RevenueChart() {
  const t = useTranslations();
  const format = useFormatter();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const { data, isLoading } = useGetRevenueQuery(period);

  const chartData = Array.isArray(data?.data?.data) ? data.data.data : [];

  const formatDateTick = (isoDate: string) => {
    if (!isoDate) return '';
    const d = new Date(`${isoDate}T00:00:00`);
    if (period === 'week') {
      return format.dateTime(d, { weekday: 'short' });
    }
    return format.dateTime(d, { month: 'short', day: 'numeric' });
  };

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <CardTitle className='text-xl'>
            {t('analytics.revenueByPeriod')}
          </CardTitle>
        </div>
        <div className='flex w-full sm:w-auto items-center justify-between gap-1 bg-[rgba(105,133,255,0.06)] p-1 rounded-xl border border-[rgba(105,133,255,0.08)]'>
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                period === p
                  ? 'bg-white text-primary'
                  : 'text-text-secondary hover:text-primary'
              }`}
            >
              {t(`analytics.${p}`)}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className='h-72 bg-surface rounded-2xl animate-pulse'></div>
        ) : (
          <div className='h-64 w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#6ABFF3' stopOpacity={1} />
                    <stop offset='95%' stopColor='#6985FF' stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray='3 3'
                  vertical={false}
                  stroke='#e5e7eb'
                />
                <XAxis
                  dataKey='date'
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '500' }}
                  interval='preserveStartEnd'
                  tickFormatter={(val) => formatDateTick(String(val))}
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
                        data.max > 15000
                          ? data.max
                          : period === 'week'
                            ? 15000
                            : period === 'month'
                              ? 100000
                              : 300000,
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
                  labelFormatter={(val: any) => formatDateTick(String(val))}
                  formatter={(value: any) => [
                    `${value?.toLocaleString()} ${t('common.pkr')}`,
                    t('analytics.totalRevenue'),
                  ]}
                />
                <Bar
                  dataKey='revenue'
                  fill='url(#colorRevenue)'
                  radius={[8, 8, 8, 8]}
                  barSize={period === 'month' ? 12 : 30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
