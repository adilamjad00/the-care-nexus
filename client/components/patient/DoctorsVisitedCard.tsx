'use client';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  clinicName: string;
}

interface DoctorsVisitedCardProps {
  doctors: Doctor[];
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { User } from 'lucide-react';
import { useState } from 'react';
import DoctorDetailsModal from './DoctorDetailsModal';
import { useTranslations } from 'next-intl';

export default function DoctorsVisitedCard({
  doctors,
}: DoctorsVisitedCardProps) {
  const t = useTranslations();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className='text-xl'>
            {t('patient.doctorsVisited')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {doctors.length === 0 ? (
            <div className='flex flex-col items-center justify-center py-10 text-center'>
              <div className='h-12 w-12 rounded-2xl bg-primary/8 flex items-center justify-center mb-3'>
                <User className='h-5 w-5 text-primary' />
              </div>
              <p className='text-sm font-medium text-text-primary'>
                No doctors visited yet
              </p>
              <p className='text-xs text-text-secondary mt-1'>
                Doctors from your appointments will appear here
              </p>
            </div>
          ) : (
            <div className='space-y-3'>
              {doctors.map((doctor) => (
                <button
                  key={doctor._id}
                  onClick={() => setSelectedDoctorId(doctor._id)}
                  className='w-full text-start flex items-center gap-3 rounded-xl bg-gray-50 p-4 hover:bg-gray-100 transition-all group'
                >
                  <div className='h-10 w-10 rounded-lg overflow-hidden shrink-0 border border-black/6 bg-white flex items-center justify-center'>
                    <img
                      src={
                        (doctor as any).photo
                          ? (doctor as any).photo.startsWith('http') ||
                            (doctor as any).photo.startsWith('data:')
                            ? (doctor as any).photo
                            : `${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000'}${(doctor as any).photo.startsWith('/') ? '' : '/'}${(doctor as any).photo}`
                          : '/carenexus.jpeg'
                      }
                      alt={doctor.name || 'Doctor'}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/carenexus.jpeg';
                      }}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors'>
                      {t('patient.bookAppointmentPage.doctorPrefix')}{' '}
                      {doctor.name}
                    </p>
                    <p className='text-xs text-text-secondary mt-0.5'>
                      {doctor.specialization} · {doctor.clinicName}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedDoctorId && (
        <DoctorDetailsModal
          doctorId={selectedDoctorId}
          isOpen={!!selectedDoctorId}
          onClose={() => setSelectedDoctorId(null)}
        />
      )}
    </>
  );
}
