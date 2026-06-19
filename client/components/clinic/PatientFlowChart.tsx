'use client';

import { useGetPatientFlowQuery } from '@/store/api/clinicApi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useFormatter, useTranslations } from 'next-intl';

export default function PatientFlowChart() {
  const t = useTranslations();
  const format = useFormatter();
  const { data, isLoading } = useGetPatientFlowQuery(undefined);

  if (isLoading) {
    return (
      <div className='rounded-2xl bg-white shadow-sm border border-black/6 p-5 animate-pulse'>
        <div className='h-4 w-40 rounded bg-gray-100 mb-1' />
        <div className='h-3 w-28 rounded bg-gray-100 mb-5' />
        <div className='h-64 rounded-xl bg-gray-100' />
      </div>
    );
  }

  const chartData = Array.isArray(data?.data) ? data.data : [];

  const formatAxisDate = (isoDate: string) => {
    if (!isoDate) return '';
    const d = new Date(`${isoDate}T00:00:00`);
    return format.dateTime(d, { month: 'short', day: 'numeric' });
  };

  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle>{t('clinic.dashboard.todaysOverview')}</CardTitle>
        <p className='text-[11px] text-text-secondary mt-0.5'>
          {t('analytics.patientFlow')}
        </p>
      </CardHeader>

      <CardContent>
        <div className='h-64 w-full mt-2'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id='colorFlow' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#6985FF' stopOpacity={0.25} />
                  <stop offset='95%' stopColor='#6985FF' stopOpacity={0} />
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
                tickFormatter={formatAxisDate}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                width={40}
                tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '500' }}
                allowDecimals={false}
              />
              <Tooltip
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
                labelFormatter={(value: any) => formatAxisDate(String(value))}
                formatter={(value: any) => [
                  value,
                  t('clinic.appointments.patient'),
                ]}
              />
              <Area
                type='monotone'
                dataKey='patients'
                stroke='#6985FF'
                strokeWidth={3}
                fillOpacity={1}
                fill='url(#colorFlow)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
