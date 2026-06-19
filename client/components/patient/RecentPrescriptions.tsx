'use client';

import Link from 'next/link';

interface Prescription {
  _id: string;
  diagnosis: string;
  createdAt: string;
  doctorId: {
    name: string;
    doctorProfile?: {
      fullName: string;
      specialization: string;
    };
  };
  clinicId: {
    name: string;
  };
}

interface RecentPrescriptionsProps {
  prescriptions: Prescription[];
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useFormatter, useLocale, useTranslations } from 'next-intl';

export default function RecentPrescriptions({
  prescriptions,
}: RecentPrescriptionsProps) {
  const t = useTranslations();
  const format = useFormatter();
  const locale = useLocale();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format.dateTime(date, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle className='text-xl'>
          {t('patient.recentPrescriptions')}
        </CardTitle>
        <Link
          href='/dashboard/patient/records'
          className='text-sm font-bold text-primary hover:underline hover:underline-offset-4'
        >
          {t('patient.dashboard.viewAll')}
        </Link>
      </CardHeader>
      <CardContent>
        {prescriptions.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-10 text-center'>
            <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
              <svg
                className='h-5 w-5 text-primary'
                fill='none'
                stroke='currentColor'
                strokeWidth={1.9}
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <p className='text-sm font-medium text-text-primary'>
              No prescriptions yet
            </p>
            <p className='text-xs text-text-secondary mt-1'>
              Your recent prescriptions will appear here
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
            {prescriptions.map((prescription) => (
              <Link
                key={prescription._id}
                href={`/dashboard/patient/records/${prescription._id}`}
                className='block rounded-xl bg-gray-50 p-4 transition-all hover:bg-gray-100'
              >
                <p className='text-sm font-semibold text-text-primary'>
                  {prescription.diagnosis}
                </p>
                <p className='mt-0.5 text-xs text-text-secondary'>
                  {t('patient.bookAppointmentPage.doctorPrefix')}{' '}
                  {prescription.doctorId?.doctorProfile?.fullName ||
                    prescription.doctorId?.name}
                  {prescription.doctorId?.doctorProfile?.specialization
                    ? ` · ${prescription.doctorId.doctorProfile.specialization}`
                    : ''}
                </p>
                <div className='mt-3 flex items-center justify-between border-t border-black/6 pt-2.5'>
                  <span className='text-[11px] font-semibold text-primary truncate max-w-30'>
                    {prescription.clinicId?.name}
                  </span>
                  <span className='text-[11px] text-text-secondary shrink-0'>
                    {formatDate(prescription.createdAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
