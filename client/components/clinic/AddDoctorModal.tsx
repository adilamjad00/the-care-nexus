'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useAddDoctorMutation,
  useSearchDoctorByEmailQuery,
} from '@/store/api/clinicApi';
import { toast } from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslations } from 'next-intl';
import { showToast } from '@/lib/toast';
import { Search, Plus } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  specialization: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDoctorModal({
  isOpen,
  onClose,
}: AddDoctorModalProps) {
  const t = useTranslations();
  const [addDoctor, { isLoading }] = useAddDoctorMutation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [mode, setMode] = useState<'options' | 'search' | 'manual'>('options');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { data: searchData } = useSearchDoctorByEmailQuery(searchEmail, {
    skip: !searchEmail || searchEmail.length < 3,
  });

  useEffect(() => {
    if (mode === 'search') {
      setSearchResults(searchData?.data || null);
    } else {
      setSearchResults(null);
    }
  }, [mode, searchData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('clinic.imageSizeError'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await addDoctor({ ...data, photo: profileImage }).unwrap();
      showToast.doctorAdded(t);
      reset();
      setProfileImage(null);
      onClose();
    } catch (error: any) {
      if (error?.status === 404) {
        toast.error(t('clinic.doctorNotFound'));
      } else {
        showToast.error(t, error?.data?.message);
      }
    }
  };

  const handleClose = () => {
    reset();
    setProfileImage(null);
    setMode('options');
    setSearchEmail('');
    setSearchResults(null);
    onClose();
  };

  const handleSelectSearchResult = async (doctor: any) => {
    try {
      await addDoctor({
        email: doctor.email,
        specialization: doctor.specialization || 'General',
      }).unwrap();
      showToast.doctorAdded(t);
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to add doctor');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('clinic.addDoctor')}>
      {mode === 'options' && (
        <div className='space-y-4'>
          <p className='text-sm text-text-secondary font-medium'>
            {t('clinic.chooseDoctorAddMethod') || 'Choose how to add a doctor:'}
          </p>

          <button
            onClick={() => setMode('search')}
            className='w-full p-4 rounded-2xl border-2 border-primary/20 hover:border-primary/50 bg-primary/5 hover:bg-primary/10 transition-all flex items-center gap-3 text-left'
          >
            <Search className='h-6 w-6 text-primary' />
            <div>
              <p className='font-bold text-text-primary'>
                {t('clinic.searchByEmail') || 'Search Doctor by Email'}
              </p>
              <p className='text-xs text-text-secondary'>
                {t('clinic.searchByEmailDesc') ||
                  'Find and add existing doctors'}
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode('manual')}
            className='w-full p-4 rounded-2xl border-2 border-border-light hover:border-primary/50 bg-background hover:bg-primary/5 transition-all flex items-center gap-3 text-left'
          >
            <Plus className='h-6 w-6 text-text-secondary' />
            <div>
              <p className='font-bold text-text-primary'>
                {t('clinic.manuallyAddDoctor') || 'Add Manually'}
              </p>
              <p className='text-xs text-text-secondary'>
                {t('clinic.manuallyAddDoctorDesc') ||
                  'Enter doctor details manually'}
              </p>
            </div>
          </button>

          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            className='w-full'
          >
            {t('common.cancel')}
          </Button>
        </div>
      )}

      {mode === 'search' && (
        <div className='space-y-4'>
          <div>
            <Input
              label={t('form.email')}
              type='email'
              placeholder='doctor@example.com'
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            <p className='text-[10px] text-text-secondary mt-2'>
              {t('clinic.typeEmailToSearch') ||
                "Type a doctor's email to search"}
            </p>
          </div>

          {searchEmail.length >= 3 && searchResults && (
            <div className='border border-border-light rounded-2xl overflow-hidden max-h-75 overflow-y-auto'>
              {Array.isArray(searchResults) && searchResults.length > 0 ? (
                <div className='space-y-2'>
                  {searchResults.slice(0, 5).map((doctor: any) => (
                    <button
                      key={doctor._id || doctor.email}
                      onClick={() => handleSelectSearchResult(doctor)}
                      className='w-full p-3 text-left hover:bg-background :bg-ink-soft/50 border-b border-border-light last:border-b-0 transition-colors'
                    >
                      <p className='font-semibold text-text-primary'>
                        {doctor.fullName || doctor.name || 'N/A'}
                      </p>
                      <p className='text-xs text-text-secondary'>
                        {doctor.email}
                      </p>
                      <p className='text-[10px] text-text-secondary'>
                        {doctor.specialization || 'General'}
                      </p>
                    </button>
                  ))}
                </div>
              ) : (
                <div className='p-4 text-center text-text-secondary'>
                  {t('clinic.noDoctorsFound') ||
                    'No doctors found with that email'}
                </div>
              )}
            </div>
          )}

          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setMode('options')}
              className='flex-1'
            >
              {t('common.back')}
            </Button>
            <Button
              type='button'
              variant='outline'
              onClick={handleClose}
              className='flex-1'
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}

      {mode === 'manual' && (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='p-3 rounded-2xl bg-primary/5 border border-primary/15'>
            <p className='text-xs font-semibold text-text-primary'>
              {t('clinic.patientSearch.searchPlaceholder')}
            </p>
          </div>

          {/* Photo Upload Section */}
          <div className='flex flex-col items-center pb-4'>
            <label className='text-sm font-bold text-text-primary mb-2 w-full'>
              {t('form.profilePhoto')} ({t('common.optional')})
            </label>
            <div className='relative group w-32 h-32'>
              <div className='w-full h-full rounded-2xl overflow-hidden border-2 border-dashed border-border-light bg-background flex items-center justify-center transition-all group-hover:border-primary/50'>
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt='Preview'
                    className='w-full h-full object-cover'
                  />
                ) : (
                  <div className='flex flex-col items-center gap-2 text-text-secondary'>
                    <div className='p-3 bg-white rounded-lg'>
                      <svg
                        className='w-6 h-6'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth='2'
                          d='M12 4v16m8-8H4'
                        />
                      </svg>
                    </div>
                    <span className='text-[10px] font-bold uppercase tracking-widest'>
                      {t('form.changePhoto')}
                    </span>
                  </div>
                )}
              </div>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='absolute inset-0 opacity-0 cursor-pointer z-10'
              />
              {profileImage && (
                <button
                  type='button'
                  onClick={() => setProfileImage(null)}
                  className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-20'
                >
                  ×
                </button>
              )}
            </div>
            <p className='text-[10px] text-text-secondary mt-2'>
              {t('common.optional')} — 2MB max
            </p>
          </div>

          <Input
            label={t('form.email')}
            type='email'
            placeholder={t('clinic.emailPlaceholder')}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label={t('form.specialization')}
            placeholder={t('clinic.specializationPlaceholder')}
            error={errors.specialization?.message}
            {...register('specialization')}
          />

          <div className='flex gap-3 justify-end pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setMode('options')}
              disabled={isLoading}
              className='flex-1'
            >
              {t('common.back')}
            </Button>
            <Button type='submit' disabled={isLoading} className='flex-1'>
              {isLoading ? t('common.loading') : t('clinic.addDoctor')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
