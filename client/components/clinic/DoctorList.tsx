'use client';

import { useState } from 'react';
import {
  useGetDoctorsQuery,
  useRemoveDoctorMutation,
} from '@/store/api/clinicApi';
import { BarChart2, Trash2, Plus, User } from 'lucide-react';
import TrashIcon from '@/icons/trash-icon';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '../ui/ConfirmModal';
import { TableSkeleton } from '../ui/Skeleton';
import AddDoctorModal from './AddDoctorModal';
import DoctorStatsModal from './DoctorStatsModal';
import { useTranslations } from 'next-intl';
import { resolveMediaUrl } from '@/lib/media';

export default function DoctorList() {
  const [page, setPage] = useState(1);
  const limit = 8;
  const { data, isLoading } = useGetDoctorsQuery({ page, limit });
  const [removeDoctor, { isLoading: isRemoving }] = useRemoveDoctorMutation();
  const t = useTranslations();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const handleRemove = async () => {
    if (!selectedDoctor) return;

    try {
      await removeDoctor(selectedDoctor._id).unwrap();
      toast.success(t('toast.doctorRemoved'));
      setShowConfirmModal(false);
      setSelectedDoctor(null);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };

  const doctors = data?.data?.doctors || [];
  const pagination = data?.data?.pagination;

  if (isLoading) {
    return <TableSkeleton rows={5} />;
  }

  return (
    <>
      <div className='bg-white p-6 rounded-2xl border border-border-light lens-card'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-lg font-bold text-text-primary'>
            {t('nav.doctors')}
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all font-bold text-sm'
          >
            <Plus className='h-4 w-4' />
            {t('clinic.addDoctor')}
          </button>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-border-light'>
                <th className='text-left py-3 px-4 text-sm font-semibold text-text-primary'>
                  {t('clinic.staff.name')}
                </th>
                <th className='text-left py-3 px-4 text-sm font-semibold text-text-primary'>
                  {t('form.specialization')}
                </th>
                <th className='text-left py-3 px-4 text-sm font-semibold text-text-primary'>
                  {t('form.email')}
                </th>
                <th className='text-center py-3 px-4 text-sm font-semibold text-text-primary'>
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor: any) => (
                <tr key={doctor._id} className='border-b border-border-light'>
                  <td className='py-4 px-4'>
                    <div className='flex items-center gap-3'>
                      <div className='h-10 w-10 rounded-lg overflow-hidden border border-black/5 shrink-0 bg-surface flex items-center justify-center'>
                        {doctor.userId?.photo ? (
                          <img
                            src={
                              resolveMediaUrl(doctor.userId.photo) ||
                              doctor.userId.photo
                            }
                            alt={doctor.userId?.name || 'Doctor'}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <User className='h-6 w-6 text-text-primary' />
                        )}
                      </div>
                      <span className='text-sm font-bold text-text-primary'>
                        {doctor.userId?.name || 'N/A'}
                      </span>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-sm text-text-primary'>
                    {doctor.specialization || 'General'}
                  </td>
                  <td className='py-4 px-4 text-sm text-text-primary'>
                    {doctor.userId?.email || 'N/A'}
                  </td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowStatsModal(true);
                        }}
                        className='p-2 hover:bg-surface :bg-text-secondary rounded-lg transition-all'
                      >
                        <BarChart2 className='h-4 w-4 text-text-primary' />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setShowConfirmModal(true);
                        }}
                        className='p-2 hover:bg-red-50 :bg-red-900/20 rounded-lg transition-all group'
                      >
                        <TrashIcon className='h-4 w-4 text-red-600' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {doctors.length === 0 && (
          <div className='flex flex-col items-center justify-center py-14 text-center rounded-2xl bg-gray-50 border border-black/6 mt-2'>
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
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0'
                />
              </svg>
            </div>
            <p className='text-sm font-medium text-text-primary'>
              {t('clinic.staff.noStaff')}
            </p>
            <p className='text-xs text-text-secondary mt-1'>
              Add doctors to your clinic to get started
            </p>
          </div>
        )}

        {pagination?.pages > 1 && (
          <div className='mt-6 flex items-center justify-between'>
            <p className='text-xs font-semibold text-text-primary'>
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                className='px-3 py-1.5 rounded-lg border border-border-light text-sm font-semibold disabled:opacity-50'
              >
                {t('common.back')}
              </button>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.pages))
                }
                disabled={page >= pagination.pages}
                className='px-3 py-1.5 rounded-lg border border-border-light text-sm font-semibold disabled:opacity-50'
              >
                {t('common.next')}
              </button>
            </div>
          </div>
        )}
      </div>

      <AddDoctorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {selectedDoctor && (
        <>
          <DoctorStatsModal
            isOpen={showStatsModal}
            onClose={() => {
              setShowStatsModal(false);
              setSelectedDoctor(null);
            }}
            doctorId={selectedDoctor._id}
          />

          <ConfirmModal
            isOpen={showConfirmModal}
            title={t('modal.removeDoctorTitle')}
            message={`${t('modal.removeDoctorMsg')} ${selectedDoctor.userId?.name}?`}
            confirmText={t('clinic.removeDoctor')}
            variant='danger'
            isLoading={isRemoving}
            onConfirm={handleRemove}
            onClose={() => {
              setShowConfirmModal(false);
              setSelectedDoctor(null);
            }}
          />
        </>
      )}
    </>
  );
}
