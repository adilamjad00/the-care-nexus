'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface SpentChartProps {
  data: { label: string; spent: number }[];
}

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';

export default function SpentChart({ data }: SpentChartProps) {
  const t = useTranslations();
  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle>{t('patient.revenue.title')}</CardTitle>
        <p className='text-[11px] text-text-secondary mt-0.5'>
          {t('patient.revenue.subtitle')}
        </p>
      </CardHeader>

      <CardContent>
        <div className='h-64 w-full mt-2'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={[...data].reverse()}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id='colorSpent' x1='0' y1='0' x2='0' y2='1'>
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
                dataKey='label'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '500' }}
                interval='preserveStartEnd'
                tickFormatter={(value) => {
                  const parts = value.split(/[ -]/);
                  if (/^\d+$/.test(parts[0])) return value;
                  const monthPart = parts[0].substring(0, 3);
                  const monthKey =
                    monthPart.charAt(0).toUpperCase() +
                    monthPart.slice(1).toLowerCase();
                  return t(`common.months.${monthKey}`) || value;
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: '500' }}
                tickFormatter={(value) =>
                  `${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`
                }
                width={40}
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
                labelFormatter={(value: any) => {
                  const parts = value.split(/[ -]/);
                  if (/^\d+$/.test(parts[0])) return value;
                  const monthPart = parts[0].substring(0, 3);
                  const monthKey =
                    monthPart.charAt(0).toUpperCase() +
                    monthPart.slice(1).toLowerCase();
                  return t(`common.months.${monthKey}`) || value;
                }}
                formatter={(value: any) => [
                  `${value?.toLocaleString()} ${t('common.pkr')}`,
                  t('patient.revenue.totalRevenue'),
                ]}
              />
              <Area
                type='monotone'
                dataKey='spent'
                stroke='#6985FF'
                strokeWidth={3}
                fillOpacity={1}
                fill='url(#colorSpent)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
