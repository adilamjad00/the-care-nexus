'use client';

import StaffList from '@/components/clinic/StaffList';
import { useTranslations } from 'next-intl';

export default function StaffPage() {
  const t = useTranslations();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-text-primary'>
        {t('clinic.staff.title')}
      </h1>
      <StaffList />
    </div>
  );
}
