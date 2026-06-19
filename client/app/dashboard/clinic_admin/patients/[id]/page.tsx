'use client';

import { useParams } from 'next/navigation';
import PatientProfileView from '@/components/clinic/PatientProfileView';

export default function PatientProfilePage() {
  const params = useParams();
  const patientId = params.id as string;

  return (
    <div className='space-y-6'>
      <PatientProfileView patientId={patientId} hideDownload={true} />
    </div>
  );
}
