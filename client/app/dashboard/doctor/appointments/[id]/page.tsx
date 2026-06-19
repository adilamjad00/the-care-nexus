'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DoctorAppointmentDetailsView from '@/components/doctor/DoctorAppointmentDetailsView';
import { useTranslations } from 'next-intl';

export default function DoctorAppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const t = useTranslations();
  const appointmentId = params.id as string;

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      <div className='flex items-center gap-4 mb-6'>
        <button
          onClick={() => router.push('/dashboard/doctor/appointments')}
          className='h-10 w-10 bg-white rounded-lg flex items-center justify-center hover:bg-surface/80 transition-all border border-border-light group'
          title={t('common.back')}
        >
          <ArrowLeft className='h-5 w-5 text-text-secondary group-hover:-translate-x-0.5 transition-transform' />
        </button>
        <div>
          <h1 className='text-2xl font-bold text-text-primary'>
            {t('clinic.appointments.viewAppointment')}
          </h1>
          <p className='text-xs text-text-secondary font-medium uppercase tracking-wider mt-0.5'>
            ID: {appointmentId}
          </p>
        </div>
      </div>

      {appointmentId ? (
        <DoctorAppointmentDetailsView appointmentId={appointmentId} />
      ) : (
        <div className='p-8 text-center bg-white rounded-2xl border-2 border-dashed border-border-light'>
          <p className='text-text-secondary'>Invalid Appointment ID</p>
        </div>
      )}
    </div>
  );
}
