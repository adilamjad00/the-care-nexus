'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, ShieldCheck, ArrowLeft } from 'lucide-react';
import {
  useGetConnectionRequestsQuery,
  useHandleConnectionRequestMutation,
} from '@/store/api/patientApi';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';

export default function PatientSettingsPage() {
  const t = useTranslations();
  const router = useRouter();
  const { data, isLoading, refetch } = useGetConnectionRequestsQuery(undefined);
  const [handleConnectionRequest, { isLoading: isSaving }] =
    useHandleConnectionRequestMutation();

  const requests = data?.data || [];

  const handleAction = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await handleConnectionRequest({ id, status }).unwrap();
      toast.success(
        status === 'approved'
          ? t('toast.connectionRequestApproved')
          : t('toast.connectionRequestRejected'),
      );
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || t('toast.connectionRequestFailed'));
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <button
          onClick={() => router.back()}
          className='h-10 w-10 rounded-lg border border-border-light bg-white text-text-secondary hover:text-text-primary :text-white flex items-center justify-center'
        >
          <ArrowLeft className='h-5 w-5 rtl:rotate-180' />
        </button>
        <div>
          <h1 className='text-3xl font-bold text-text-primary'>
            {t('patient.settings.title')}
          </h1>
          <p className='mt-1 text-sm text-text-secondary'>
            {t('patient.settings.subtitle')}
          </p>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='rounded-2xl border border-border-light bg-white p-6'>
          <div className='mb-5 flex items-center gap-3'>
            <ShieldCheck className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-bold text-text-primary'>
              {t('patient.settings.connectionRequests')}
            </h2>
          </div>

          {isLoading ? (
            <div className='space-y-3'>
              <div className='h-24 animate-pulse rounded-2xl bg-surface' />
              <div className='h-24 animate-pulse rounded-2xl bg-surface' />
            </div>
          ) : requests.length > 0 ? (
            <div className='space-y-4'>
              {requests.map((request: any) => (
                <div
                  key={request._id}
                  className='rounded-2xl border border-border-light p-4'
                >
                  <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm font-bold text-text-primary'>
                        {request.fromName ||
                          t('patient.settings.connectionFrom')}
                      </p>
                      <p className='text-xs text-text-secondary'>
                        {request.fromRole === 'doctor'
                          ? t('patient.settings.doctorRequest')
                          : t('patient.settings.clinicRequest')}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={() => handleAction(request._id, 'approved')}
                        disabled={isSaving}
                        className='inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50'
                      >
                        <CheckCircle2 className='h-4 w-4' />
                        {t('patient.settings.approve')}
                      </button>
                      <button
                        onClick={() => handleAction(request._id, 'rejected')}
                        disabled={isSaving}
                        className='inline-flex items-center gap-2 rounded-xl border border-border-light px-4 py-2 text-sm font-bold text-text-primary hover:bg-background :bg-ink-soft disabled:opacity-50'
                      >
                        <XCircle className='h-4 w-4' />
                        {t('patient.settings.reject')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed border-border-light p-8 text-center'>
              <p className='text-sm font-medium text-text-secondary'>
                {t('patient.settings.noRequests')}
              </p>
            </div>
          )}
        </div>

        <div className='rounded-2xl border border-border-light bg-white p-6'>
          <div className='mb-5 flex items-center gap-3'>
            <CheckCircle2 className='h-5 w-5 text-primary' />
            <h2 className='text-lg font-bold text-text-primary'>
              {t('patient.settings.profileShortcut')}
            </h2>
          </div>

          <p className='text-sm leading-6 text-text-secondary'>
            {t('patient.settings.profileShortcutDesc')}
          </p>

          <Link
            href='/dashboard/patient/profile'
            className='mt-5 inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-white'
          >
            {t('patient.settings.openProfile')}
          </Link>
        </div>
      </div>
    </div>
  );
}
