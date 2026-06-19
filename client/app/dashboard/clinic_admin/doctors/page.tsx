'use client';

import DoctorList from '@/components/clinic/DoctorList';
import { useTranslations } from 'next-intl';

export default function DoctorsPage() {
  const t = useTranslations();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-text-primary'>
        {t('nav.doctors')}
      </h1>
      <DoctorList />
    </div>
  );
}
