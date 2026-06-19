'use client';

import { useMemo } from 'react';
import {
  useDeleteRevenueHistoryRecordMutation,
  useGetRevenueHistoryQuery,
  useClearRevenueHistoryMutation,
} from '@/store/api/clinicApi';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClinicRevenuePage() {
  const t = useTranslations();
  const { data, isLoading, refetch } = useGetRevenueHistoryQuery({
    page: 1,
    limit: 200,
  });
  const [deleteRecord, { isLoading: deleting }] =
    useDeleteRevenueHistoryRecordMutation();
  const [clearAll, { isLoading: clearing }] = useClearRevenueHistoryMutation();

  const entries = data?.data?.entries || [];
  const total = useMemo(
    () =>
      entries.reduce((sum: number, e: any) => sum + (e.clinicShare || 0), 0),
    [entries],
  );

  const onDelete = async (id: string) => {
    try {
      await deleteRecord(id).unwrap();
      toast.success(t('clinic.revenueHistory.recordDeleted'));
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || t('common.error'));
    }
  };

  const onClear = async () => {
    try {
      await clearAll().unwrap();
      toast.success(t('clinic.revenueHistory.cleared'));
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || t('common.error'));
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-text-primary'>
            {t('clinic.revenueHistory.title')}
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            {t('clinic.revenueHistory.subtitle')}
          </p>
        </div>
        <button
          onClick={onClear}
          disabled={clearing || !entries.length}
          className='inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-50'
        >
          <Trash2 className='h-4 w-4' />
          {t('clinic.revenueHistory.deleteAll')}
        </button>
      </div>

      <div className='rounded-2xl border border-border-light bg-white p-5 lens-card'>
        <p className='text-sm font-bold text-text-secondary'>
          {t('clinic.revenueHistory.totalEarned')}
        </p>
        <p className='mt-1 text-3xl font-black text-primary'>
          {total.toLocaleString()} {t('common.pkr')}
        </p>
      </div>

      <div className='overflow-x-auto rounded-2xl border border-border-light bg-white lens-card'>
        <table className='min-w-full text-sm'>
          <thead className='bg-primary/5'>
            <tr>
              <th className='px-4 py-3 text-left'>
                {t('clinic.revenueHistory.date')}
              </th>
              <th className='px-4 py-3 text-left'>
                {t('clinic.revenueHistory.patient')}
              </th>
              <th className='px-4 py-3 text-left'>
                {t('clinic.revenueHistory.doctor')}
              </th>
              <th className='px-4 py-3 text-left'>
                {t('clinic.revenueHistory.consultationFee')}
              </th>
              <th className='px-4 py-3 text-left'>
                {t('clinic.revenueHistory.medicineCost')}
              </th>
              <th className='px-4 py-3 text-left'>
                {t('clinic.revenueHistory.total')}
              </th>
              <th className='px-4 py-3 text-left'>
                {t('clinic.revenueHistory.earned')}
              </th>
              <th className='px-4 py-3 text-left'>{t('common.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td className='px-4 py-6' colSpan={8}>
                  {t('common.loading')}
                </td>
              </tr>
            ) : entries.length ? (
              entries.map((entry: any) => (
                <tr key={entry._id} className='border-t border-border-light'>
                  <td className='px-4 py-3'>
                    {new Date(entry.occurredAt).toLocaleDateString()}
                  </td>
                  <td className='px-4 py-3'>
                    {entry.patientUserId?.name || t('common.noData')}
                  </td>
                  <td className='px-4 py-3'>
                    {entry.doctorUserId?.name || t('common.noData')}
                  </td>
                  <td className='px-4 py-3'>
                    {Number(entry.consultationFee || 0).toLocaleString()}{' '}
                    {t('common.pkr')}
                  </td>
                  <td className='px-4 py-3'>
                    {Number(entry.medicineCost || 0).toLocaleString()}{' '}
                    {t('common.pkr')}
                  </td>
                  <td className='px-4 py-3'>
                    {Number(entry.totalCost || 0).toLocaleString()}{' '}
                    {t('common.pkr')}
                  </td>
                  <td className='px-4 py-3 font-bold text-primary'>
                    {Number(entry.clinicShare || 0).toLocaleString()}{' '}
                    {t('common.pkr')}
                  </td>
                  <td className='px-4 py-3'>
                    <button
                      onClick={() => onDelete(entry._id)}
                      disabled={deleting}
                      className='inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50'
                    >
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className='px-4 py-6' colSpan={8}>
                  {'clinic.revenueHistory.empty'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
