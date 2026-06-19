'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import AppointmentDetailsView from '@/components/clinic/AppointmentDetailsView';

export default function ClinicAppointmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-4 mb-6'>
        <button
          onClick={() => router.push('/dashboard/clinic_admin/appointments')}
          className='p-2 hover:bg-surface :bg-ink-soft rounded-full transition-colors'
        >
          <ArrowLeft className='h-6 w-6 text-text-secondary' />
        </button>
        <h1 className='text-2xl font-bold text-text-primary'>
          Appointment Details
        </h1>
      </div>

      <AppointmentDetailsView appointmentId={appointmentId} />
    </div>
  );
}
