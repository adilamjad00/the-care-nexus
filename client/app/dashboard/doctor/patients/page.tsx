'use client';

import { useState, useEffect } from 'react';
import {
  useGetPatientsQuery,
  useDeletePatientMutation,
} from '@/store/api/doctorApi';
import Link from 'next/link';
import {
  Search,
  User,
  Calendar as CalendarIcon,
  Loader,
  Plus,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useStartConversationMutation } from '@/store/api/chatApi';
import TrashIcon from '@/icons/trash-icon';
import { toast } from 'react-hot-toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useTranslations } from 'next-intl';
import { showToast } from '@/lib/toast';

export default function PatientsPage() {
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    patientId: string;
    patientName: string;
  }>({
    isOpen: false,
    patientId: '',
    patientName: '',
  });

  const [deletePatient, { isLoading: deleting }] = useDeletePatientMutation();
  const [startConversation] = useStartConversationMutation();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isFetching } = useGetPatientsQuery({
    search: debouncedSearch,
    limit: 100,
  });

  const patients = data?.data?.patients || [];

  const handleDeleteClick = (
    e: React.MouseEvent,
    patientId: string,
    patientName: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteConfirm({ isOpen: true, patientId, patientName });
  };

  const handleDeleteConfirm = async () => {
    const toastId = toast.loading(t('common.loading'));
    setDeletingId(deleteConfirm.patientId);

    try {
      await deletePatient(deleteConfirm.patientId).unwrap();
      showToast.patientRemoved(t);
      toast.dismiss(toastId);
      setDeleteConfirm({ isOpen: false, patientId: '', patientName: '' });
    } catch (error: any) {
      showToast.error(t, error?.data?.message);
      toast.dismiss(toastId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMessageClick = async (e: React.MouseEvent, patientId: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await startConversation({ patientId }).unwrap();
      if (res.success) {
        const conversationId = res?.data?.conversationId;
        const patient = patients.find((p: any) => p._id === patientId);
        const patientName = patient?.name || 'Patient';
        const params = new URLSearchParams({
          patientId,
          patientName,
        });
        if (conversationId) {
          params.set('conversationId', conversationId);
        }
        router.push(`/dashboard/doctor/chat?${params.toString()}`);
      }
    } catch (err) {
      toast.error('Failed to start chat');
    }
  };

  return (
    <div className='space-y-6 animate-in fade-in duration-500'>
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() =>
          setDeleteConfirm({ isOpen: false, patientId: '', patientName: '' })
        }
        onConfirm={handleDeleteConfirm}
        title={t('modal.removePatientTitle')}
        message={t('doctor.patients.confirmDelete', {
          name: deleteConfirm.patientName,
        })}
        confirmText={t('doctor.patients.deletePatient')}
        cancelText={t('common.cancel')}
        variant='danger'
        isLoading={deleting}
      />

      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight'>
            {t('doctor.patients.title')}
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-base sm:text-lg'>
            {t('doctor.patients.subtitle')}
          </p>
        </div>
        <Link
          href='/dashboard/doctor/patients/new'
          className='flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all shadow-lg w-full sm:w-auto text-sm sm:text-base'
        >
          <Plus className='h-5 w-5 stroke-[2.5px]' />
          {t('doctor.patients.addPatient')}
        </Link>
      </div>

      <div className='bg-primary/5 rounded-2xl'>
        <div className='relative'>
          <Search className='absolute left-4 bg-primary/5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-500' />
          <input
            type='text'
            placeholder={t('common.search') + '...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='w-full pl-12 pr-4 py-3 border-2 border-transparent rounded-xl focus:outline-none focus:border-primary bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500'
          />
          {isFetching && (
            <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
              <Loader className='h-5 w-5 animate-spin text-primary' />
            </div>
          )}
        </div>
      </div>

      <div className='bg-white lens-card rounded-2xl border border-white overflow-hidden'>
        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <Loader className='h-12 w-12 animate-spin text-primary' />
          </div>
        ) : patients.length === 0 ? (
          <div className='text-center py-20'>
            <div className='h-20 w-20 bg-primary/20 dark:bg-primary-muted rounded-full flex items-center justify-center mx-auto mb-4'>
              <User className='h-10 w-10 text-gray-500 dark:text-gray-500' />
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-lg font-medium'>
              {t('doctor.patients.noPatients')}
            </p>
            <p className='text-gray-500 dark:text-gray-500 text-sm mt-1'>
              {search
                ? t('doctor.patients.adjustSearch')
                : t('doctor.patients.emptyList')}
            </p>
          </div>
        ) : (
          <div className='divide-y divide-border-light'>
            {patients.map((patient: any) => (
              <div key={patient._id} className='relative group'>
                <Link
                  href={`/dashboard/doctor/patients/${patient._id}`}
                  className='block p-6 transition-colors pr-28'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4 min-w-0 flex-1'>
                      <div className='h-16 w-16 bg-white rounded-full flex items-center justify-center text-primary border border-border-light shrink-0 overflow-hidden'>
                        {patient.photo ? (
                          <img
                            src={patient.photo}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        ) : patient.patientProfile?.profilePhoto ? (
                          <img
                            src={patient.patientProfile.profilePhoto}
                            alt=''
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl'>
                            {patient.name?.charAt(0).toUpperCase() || (
                              <User className='h-8 w-8' />
                            )}
                          </div>
                        )}
                      </div>
                      <div className='min-w-0'>
                        <div className='flex items-center gap-2'>
                          <h3 className='font-bold text-black text-xl truncate'>
                            {patient.name || 'Unnamed Patient'}
                          </h3>
                          {patient.isAdded ? (
                            <span className='bg-white border border-border-light text-text-primary text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap'>
                              {t('doctor.patients.myPatient')}
                            </span>
                          ) : (
                            <span className='bg-white border border-border-light text-text-secondary text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap'>
                              {t('doctor.patients.external')}
                            </span>
                          )}
                        </div>
                        <p className='text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2 mt-1'>
                          <User className='h-4 w-4' />
                          {patient.email || 'No email'}
                        </p>
                        {patient.phone && (
                          <p className='text-gray-500 dark:text-gray-500 text-xs mt-1'>
                            {patient.phone}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className='flex flex-col items-end gap-2 text-right pr-20'>
                      {patient.isAdded && patient.visitCount > 0 && (
                        <span className='bg-white border border-primary/20 text-primary font-bold rounded-full text-[10px] sm:text-[11px] px-2.5 py-1 uppercase tracking-wider whitespace-nowrap'>
                          {patient.visitCount}{' '}
                          {patient.visitCount !== 1
                            ? t('doctor.patients.visitsPlural')
                            : t('doctor.patients.visits')}
                        </span>
                      )}
                      {patient.lastVisit && (
                        <div className='flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider mb-2 whitespace-nowrap'>
                          <CalendarIcon className='h-3.5 w-3.5' />
                          <span>
                            {t('doctor.patients.lastVisit')}:{' '}
                            {new Date(patient.lastVisit).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <div className='absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all'>
                  <button
                    onClick={(e) => handleMessageClick(e, patient._id)}
                    className='p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all'
                    title={t('doctor.patients.messagePatient')}
                  >
                    <MessageSquare className='h-5 w-5' />
                  </button>
                  <button
                    onClick={(e) =>
                      handleDeleteClick(e, patient._id, patient.name)
                    }
                    disabled={deletingId === patient._id}
                    className='p-2 bg-white border border-border-light hover:bg-red-50 hover:border-red-100 text-red-600 rounded-lg transition-all disabled:opacity-50'
                    title={t('doctor.patients.deletePatient')}
                  >
                    {deletingId === patient._id ? (
                      <Loader className='h-5 w-5 animate-spin' />
                    ) : (
                      <TrashIcon className='h-5 w-5' />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
