'use client';

import PatientSearch from '@/components/clinic/PatientSearch';
import { useTranslations } from 'next-intl';

export default function PatientsSearchPage() {
  const t = useTranslations();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-text-primary'>
        {t('clinic.patientSearch.title')}
      </h1>
      <PatientSearch />
    </div>
  );
}
