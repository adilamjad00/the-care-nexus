'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AppointmentFilters from '@/components/clinic/AppointmentFilters';
import AppointmentTable from '@/components/clinic/AppointmentTable';
import { useGetPatientProfileQuery } from '@/store/api/clinicApi';
import { useTranslations } from 'next-intl';

function AppointmentsContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId') || '';
  const [filters, setFilters] = useState({});
  const { data: patientData } = useGetPatientProfileQuery(patientId, {
    skip: !patientId,
  });
  const tableFilters = patientId ? { ...filters, patientId } : filters;

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-text-primary'>
        {t('clinic.appointments.title')}
      </h1>

      {patientId && (
        <div className='rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3'>
          <p className='text-sm font-bold text-primary'>
            Showing appointments for the patient :{' '}
            {patientData?.data?.patient?.name || '...'}
          </p>
        </div>
      )}

      <AppointmentFilters onFilter={setFilters} />
      <AppointmentTable filters={tableFilters} />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <div className='p-8 text-center text-text-secondary'>
          Loading appointments...
        </div>
      }
    >
      <AppointmentsContent />
    </Suspense>
  );
}
