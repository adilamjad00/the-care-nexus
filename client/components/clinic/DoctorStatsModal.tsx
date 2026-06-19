'use client';

import { useGetDoctorStatsQuery } from '@/store/api/clinicApi';
import { Modal } from '../ui/Modal';
import { Calendar, Clock, Star, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DoctorStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
}

export default function DoctorStatsModal({
  isOpen,
  onClose,
  doctorId,
}: DoctorStatsModalProps) {
  const t = useTranslations();
  const { data, isLoading } = useGetDoctorStatsQuery(doctorId, {
    skip: !isOpen || !doctorId,
  });

  const stats = data?.data;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('clinic.doctorPortal.stats')}
    >
      {isLoading ? (
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-20 bg-surface rounded-lg animate-pulse'
            ></div>
          ))}
        </div>
      ) : (
        <div className='space-y-4'>
          <div className='bg-primary/5 p-4 rounded-2xl border border-primary/10'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
                <Calendar className='h-6 w-6 text-primary' />
              </div>
              <div>
                <p className='text-[10px] font-bold text-text-primary uppercase tracking-widest'>
                  {t('clinic.doctorPortal.appointmentsCompleted')}
                </p>
                <p className='text-2xl font-black text-text-primary'>
                  {stats?.appointmentsCompleted || 0}
                </p>
              </div>
            </div>
          </div>

          <div className='bg-primary/5 p-4 rounded-2xl border border-primary/10'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
                <Clock className='h-6 w-6 text-primary' />
              </div>
              <div>
                <p className='text-[10px] font-bold text-text-primary uppercase tracking-widest'>
                  {t('clinic.doctorPortal.avgVisitTime')}
                </p>
                <p className='text-2xl font-black text-text-primary'>
                  {stats?.avgVisitTime || 0} min
                </p>
              </div>
            </div>
          </div>

          <div className='bg-primary/5 p-4 rounded-2xl border border-primary/10'>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
                <DollarSign className='h-6 w-6 text-primary' />
              </div>
              <div>
                <p className='text-[10px] font-bold text-text-primary uppercase tracking-widest'>
                  {t('clinic.totalRevenue')}
                </p>
                <p className='text-2xl font-black text-text-primary'>
                  {t('common.pkr')}{' '}
                  {stats?.totalRevenue?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>

          {stats?.patientSatisfaction != null && (
            <div className='bg-primary/5 p-4 rounded-2xl border border-primary/10'>
              <div className='flex items-center gap-4'>
                <div className='h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center'>
                  <Star className='h-6 w-6 text-primary' />
                </div>
                <div>
                  <p className='text-[10px] font-bold text-text-primary uppercase tracking-widest'>
                    {t('clinic.doctorPortal.patientSatisfaction')}
                  </p>
                  <p className='text-2xl font-black text-text-primary'>
                    {stats?.patientSatisfaction}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
