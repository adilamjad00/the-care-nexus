'use client';

import DoctorsList from '@/components/patient/DoctorsList';

export default function DoctorsPage() {
  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold text-text-primary'>
          Our Specialist Doctors
        </h1>
        <p className='text-text-secondary'>
          Find and book appointments with top-rated medical professionals.
        </p>
      </div>

      <DoctorsList />
    </div>
  );
}
