'use client';

import ClinicSettingsForm from '@/components/clinic/ClinicSettingsForm';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations();
  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-text-primary'>
        {t('nav.settings')}
      </h1>
      <ClinicSettingsForm />
    </div>
  );
}
