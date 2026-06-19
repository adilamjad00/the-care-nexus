'use client';

import { useParams } from 'next/navigation';
import PatientProfileView from '@/components/clinic/PatientProfileView';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PatientDetailPage() {
  const t = useTranslations();
  const params = useParams();
  const patientId = params?.patientId as string;

  const additionalActions = (
    <div className='flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-2 md:gap-3 w-full sm:w-auto'>
      <Link
        href={`/dashboard/doctor/appointments/new?patientId=${patientId}`}
        className='inline-flex w-full sm:w-auto items-center justify-center px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-white dark:bg-zinc-800 rounded-2xl border border-black/5 text-gray-600 dark:text-gray-300 text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:border-primary/30 transition-all shadow-sm whitespace-nowrap'
      >
        {t('doctor.appointments.newAppointment')}
      </Link>
      <Link
        href={`/dashboard/doctor/prescriptions/new?patientId=${patientId}`}
        className='inline-flex w-full sm:w-auto items-center justify-center px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-primary text-white rounded-2xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:bg-primary-hover transition-all shadow-lg shadow-primary/20 gap-1.5 whitespace-nowrap'
      >
        <Plus size={12} className='shrink-0' />
        {t('doctor.dashboard.newPrescription')}
      </Link>
    </div>
  );

  return (
    <div className='space-y-6'>
      <PatientProfileView
        patientId={patientId}
        hideDownload={true}
        additionalActions={additionalActions}
      />
    </div>
  );
}
