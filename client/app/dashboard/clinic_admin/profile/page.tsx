'use client';

import { useSelector } from 'react-redux';
import { Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGetProfileQuery } from '@/store/api/authApi';
import { useGetSettingsQuery } from '@/store/api/clinicApi';
import { Skeleton } from '@/components/ui/Skeleton';
import ClinicSettingsForm from '@/components/clinic/ClinicSettingsForm';

export default function ClinicAdminProfilePage() {
  const t = useTranslations();
  const user = useSelector((state: any) => state.auth.user);
  const { data: profileData, isLoading: profileLoading } =
    useGetProfileQuery(undefined);
  const { data: settingsData, isLoading: settingsLoading } =
    useGetSettingsQuery(undefined);

  const isLoading = profileLoading || settingsLoading;
  const currentUser = profileData?.data || user;
  const clinic = settingsData?.data;

  // Prefer clinic photo, fall back to user photo
  const photo = clinic?.photo || null;
  const clinicName = clinic?.name || currentUser?.name || 'My Clinic';
  const clinicPhone = clinic?.phone;
  const clinicAddress = clinic?.address;
  const clinicEmail = clinic?.email || currentUser?.email;

  if (isLoading) {
    return (
      <div className='space-y-5'>
        <Skeleton className='h-7 w-40' />
        <div className='grid gap-5 md:grid-cols-3'>
          <div className='md:col-span-1'>
            <div className='rounded-2xl border border-black/6 bg-white p-5 space-y-4'>
              <div className='flex flex-col items-center gap-3'>
                <Skeleton className='h-24 w-24 rounded-2xl' />
                <Skeleton className='h-5 w-36' />
              </div>
              <div className='space-y-3'>
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className='h-9 w-full rounded-lg' />
                ))}
              </div>
            </div>
          </div>
          <div className='md:col-span-2'>
            <div className='rounded-2xl border border-black/6 bg-white p-5 space-y-3'>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className='h-10 w-full rounded-lg' />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) return null;

  return (
    <div className='space-y-5'>
      <h1 className='text-xl font-bold text-text-primary'>
        {t('clinic.profile.title')}
      </h1>

      <div className='grid gap-5 md:grid-cols-3'>
        {/* Clinic info card */}
        <div className='md:col-span-1 '>
          <div className='rounded-2xl border border-black/6 bg-white p-5 lens-card'>
            {/* Logo / avatar */}
            <div className='flex flex-col items-center text-center mb-5'>
              <div className='relative h-24 w-24 mb-3'>
                {photo ? (
                  <Image
                    src={photo}
                    alt={clinicName}
                    fill
                    className='rounded-2xl object-cover border border-black/6'
                  />
                ) : (
                  <div className='h-full w-full bg-primary/10 rounded-2xl flex items-center justify-center border border-black/6'>
                    <Building2 className='h-10 w-10 text-primary' />
                  </div>
                )}
              </div>
              <h2 className='text-base font-semibold text-text-primary leading-tight'>
                {clinicName}
              </h2>
            </div>

            {/* Info rows */}
            <div className='space-y-3'>
              <InfoRow
                icon={<Mail className='h-4 w-4' />}
                label={t('form.email')}
                value={clinicEmail}
              />
              <InfoRow
                icon={<Phone className='h-4 w-4' />}
                label={t('clinic.profile.phone')}
                value={clinicPhone || t('clinic.profile.notProvided')}
                muted={!clinicPhone}
              />
              <InfoRow
                icon={<MapPin className='h-4 w-4' />}
                label='Address'
                value={clinicAddress || t('clinic.profile.notProvided')}
                muted={!clinicAddress}
              />
              <InfoRow
                icon={<Calendar className='h-4 w-4' />}
                label={t('clinic.profile.memberSince')}
                value={
                  currentUser.createdAt
                    ? new Date(currentUser.createdAt).toLocaleDateString(
                        'en-US',
                        { month: 'long', year: 'numeric' },
                      )
                    : '—'
                }
              />
            </div>
          </div>
        </div>

        {/* Settings form */}
        <div className='md:col-span-2'>
          <ClinicSettingsForm />
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  muted = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className='flex items-start gap-3'>
      <div className='h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center text-text-secondary shrink-0'>
        {icon}
      </div>
      <div className='min-w-0'>
        <p className='text-[11px] text-text-secondary'>{label}</p>
        <p
          className={`text-sm font-medium break-all ${muted ? 'text-text-muted' : 'text-text-primary'}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
