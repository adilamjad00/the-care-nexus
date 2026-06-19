'use client';

import { useMemo } from 'react';
import { useGetSpentHistoryQuery } from '@/store/api/patientApi';
import { useTranslations } from 'next-intl';

export default function PatientSpentHistoryPage() {
  const t = useTranslations();
  const { data, isLoading } = useGetSpentHistoryQuery({ page: 1, limit: 200 });

  const entries = data?.data?.entries || [];
  const total = useMemo(
    () => entries.reduce((sum: number, e: any) => sum + (e.totalCost || 0), 0),
    [entries],
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-text-primary'>
            {t('patient.spentHistory.title', {
              fallback: 'Total Spent History',
            })}
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            {t('patient.spentHistory.subtitle', {
              fallback:
                'View your historical spending on appointments and prescriptions.',
            })}
          </p>
        </div>
      </div>

      <div className='rounded-2xl border border-border-light bg-white p-5 lens-card'>
        <p className='text-sm font-bold text-text-secondary'>
          {t('patient.spentHistory.totalSpent', { fallback: 'Total Spent' })}
        </p>
        <p className='mt-1 text-3xl font-black text-primary'>
          {total.toLocaleString()} {t('common.pkr')}
        </p>
      </div>

      <div className='overflow-x-auto rounded-2xl border border-border-light bg-white lens-card'>
        <table className='w-full text-left text-sm text-text-secondary'>
          <thead className='bg-primary/5 text-xs font-bold uppercase text-text-secondary'>
            <tr>
              <th className='px-6 py-4'>
                {t('patient.spentHistory.table.date')}
              </th>
              <th className='px-6 py-4'>
                {t('patient.spentHistory.table.doctor')}
              </th>
              <th className='px-6 py-4'>
                {t('patient.spentHistory.table.clinic')}
              </th>
              <th className='px-6 py-4'>
                {t('patient.spentHistory.table.type')}
              </th>
              <th className='px-6 py-4'>
                {t('patient.spentHistory.table.amount')}
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border-light'>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className='animate-pulse'>
                  <td className='px-6 py-4'>
                    <div className='h-4 w-24 rounded bg-surface' />
                  </td>
                  <td className='px-6 py-4'>
                    <div className='h-4 w-32 rounded bg-surface' />
                  </td>
                  <td className='px-6 py-4'>
                    <div className='h-4 w-28 rounded bg-surface' />
                  </td>
                  <td className='px-6 py-4'>
                    <div className='h-4 w-20 rounded bg-surface' />
                  </td>
                  <td className='px-6 py-4'>
                    <div className='h-4 w-16 rounded bg-surface' />
                  </td>
                </tr>
              ))
            ) : entries.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className='py-8 text-center text-text-secondary'
                >
                  {t('patient.spentHistory.table.noData')}
                </td>
              </tr>
            ) : (
              entries.map((entry: any) => (
                <tr key={entry._id} className='hover:bg-background/50'>
                  <td className='whitespace-nowrap px-6 py-4 font-medium text-text-primary'>
                    {new Date(entry.occurredAt).toLocaleDateString()}
                  </td>
                  <td className='px-6 py-4'>
                    {t('common.doctorPrefix')}{' '}
                    {entry.doctorUserId?.name ||
                      t('patient.spentHistory.table.unknownDoctor')}
                  </td>
                  <td className='px-6 py-4'>
                    {entry.clinicId?.name ||
                      t('patient.spentHistory.table.privateClinic')}
                  </td>
                  <td className='px-6 py-4 capitalize'>
                    {entry.sourceType?.replace('_', ' ')}
                  </td>
                  <td className='px-6 py-4 font-bold text-primary'>
                    {entry.totalCost} {t('common.pkr')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
