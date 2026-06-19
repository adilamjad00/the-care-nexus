'use client';

import { useState } from 'react';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from '@/store/api/patientApi';
import {
  User,
  Lock,
  Calendar,
  Droplet,
  AlertCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/store/slices/authSlice';
import { useTranslations } from 'next-intl';

interface ProfileFormData {
  name: string;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  contact?: string;
  allergies?: string;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const t = useTranslations();
  const { data, isLoading } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isChangingPassword }] =
    useUpdatePasswordMutation();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  const profile = data?.data;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    values: profile
      ? {
          name: profile.name || '',
          dob: profile.dob ? profile.dob.split('T')[0] : '',
          gender: profile.gender || '',
          bloodGroup: profile.bloodGroup || '',
          contact: profile.contact || '',
          allergies: profile.allergies?.join(', ') || '',
        }
      : undefined,
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch,
  } = useForm<PasswordFormData>();

  const onUpdateProfile = async (data: ProfileFormData) => {
    try {
      const allergiesArray = data.allergies
        ? data.allergies.split(',').map((a) => a.trim())
        : [];

      const promise = updateProfile({
        ...data,
        allergies: allergiesArray,
      }).unwrap();

      const result = await toast.promise(promise, {
        loading: 'Saving profile...',
        success: 'Profile updated successfully',
        error: (err) => err?.data?.message || 'Failed to update profile',
      });

      // Update Redux state immediately
      const accessToken = localStorage.getItem('accessToken');
      if (result?.data) {
        dispatch(
          setCredentials({
            user: result.data,
            accessToken: accessToken || '',
          }),
        );
        localStorage.setItem('user', JSON.stringify(result.data));
      }
    } catch (error) {
      // Error already handled by toast.promise
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (data.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      toast.success('Password changed successfully');
      resetPassword();
    } catch (error: any) {
      if (error?.status === 401) {
        toast.error('Current password is incorrect');
      } else {
        toast.error(error?.data?.message || 'Failed to change password');
      }
    }
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='h-8 w-48 animate-pulse rounded bg-surface' />
        <div className='h-96 animate-pulse rounded-2xl border border-border-light bg-white' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold text-text-primary'>
        {t('patient.profile.title')}
      </h1>

      {/* Tabs */}
      <div className='flex border-b border-border-light'>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'profile'
              ? 'border-b-2 border-primary text-primary'
              : 'text-text-secondary hover:text-text-primary  :text-white/70'
          }`}
        >
          {t('patient.profile.profileSettings')}
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'password'
              ? 'border-b-2 border-primary text-primary'
              : 'text-text-secondary hover:text-text-primary  :text-white/70'
          }`}
        >
          {t('patient.profile.security')}
        </button>
      </div>

      {activeTab === 'profile' ? (
        <div className='rounded-2xl border border-border-light bg-white p-8 lens-card'>
          <div className='mb-8 flex items-center gap-6'>
            <div className='relative group overflow-hidden h-24 w-24 rounded-full border border-border-light bg-surface shrink-0'>
              {profile?.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt='Patient profile'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center text-text-secondary'>
                  <User size={48} strokeWidth={1.5} />
                </div>
              )}

              <label
                htmlFor='photo-upload'
                className='absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'
              >
                <span className='text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded border border-white/20 uppercase tracking-widest'>
                  Update
                </span>
              </label>
              <input
                id='photo-upload'
                type='file'
                accept='image/*'
                className='hidden'
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                      const base64Str = event.target?.result as string;
                      try {
                        const promise = updateProfile({
                          name: profile.name, // required fields
                          profilePhoto: base64Str,
                        }).unwrap();

                        const result = await toast.promise(promise, {
                          loading: 'Uploading avatar...',
                          success: 'Avatar updated perfectly!',
                          error: 'Failed to upload avatar',
                        });

                        // Update Redux state immediately
                        const accessToken = localStorage.getItem('accessToken');
                        if (result?.data) {
                          dispatch(
                            setCredentials({
                              user: result.data,
                              accessToken: accessToken || '',
                            }),
                          );
                          localStorage.setItem(
                            'user',
                            JSON.stringify(result.data),
                          );
                        }
                      } catch (err) {}
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            <div>
              <h2 className='text-xl font-bold text-text-primary'>
                {profile?.userId?.name || profile?.name}
              </h2>
              <p className='text-sm font-medium text-primary mt-1'>Patient</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onUpdateProfile)} className='space-y-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <Input
                label={t('form.fullName')}
                placeholder='Your full name'
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />

              <Input
                label={t('form.email')}
                type='email'
                value={profile?.userId?.email || ''}
                disabled
                className='opacity-60'
              />

              <Input
                label={t('form.phone')}
                type='tel'
                placeholder='+1 234 567 8900'
                {...register('contact')}
              />

              <Input
                label={t('patient.profile.dateOfBirth')}
                type='date'
                {...register('dob')}
              />

              <div className='flex flex-col space-y-1 w-full'>
                <label className='text-sm font-semibold text-text-primary'>
                  {t('patient.profile.gender')}
                </label>
                <select
                  {...register('gender')}
                  className='flex h-14 w-full rounded-xl border border-border-light bg-white px-4 py-2 text-base text-text-primary focus-visible:outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary'
                >
                  <option value=''>Select gender</option>
                  <option value='male'>Male</option>
                  <option value='female'>Female</option>
                  <option value='other'>Other</option>
                </select>
              </div>

              <Input
                label={t('patient.profile.bloodGroup')}
                placeholder='e.g., A+, B-, O+'
                {...register('bloodGroup')}
              />
            </div>

            <Input
              label={t('patient.profile.allergies')}
              placeholder='e.g., Peanuts, Penicillin, Latex'
              {...register('allergies')}
            />

            <div className='rounded-lg border border-border-light bg-surface-cream p-4'>
              <div className='flex gap-3'>
                <AlertCircle className='h-5 w-5 shrink-0 text-[#B45309]' />
                <div>
                  <p className='text-sm font-semibold text-[#B45309]'>
                    {t('patient.profile.importantInfo')}
                  </p>
                  <p className='mt-1 text-sm text-[#B45309]'>
                    {t('patient.profile.keepUpToDate')}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex justify-end'>
              <Button type='submit' disabled={isUpdating}>
                {isUpdating
                  ? t('common.loading')
                  : t('patient.profile.saveChanges')}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className='rounded-2xl border border-border-light bg-white p-8 lens-card'>
          <h2 className='text-xl font-bold text-text-primary mb-6'>
            {t('patient.profile.changePassword')}
          </h2>
          <form
            onSubmit={handleSubmitPassword(onChangePassword)}
            className='space-y-6 max-w-lg'
          >
            <Input
              label={t('patient.profile.currentPassword')}
              type='password'
              placeholder='••••••••'
              error={passwordErrors.currentPassword?.message}
              {...registerPassword('currentPassword', {
                required: 'Current password is required',
              })}
            />

            <Input
              label={t('patient.profile.newPassword')}
              type='password'
              placeholder='••••••••'
              error={passwordErrors.newPassword?.message}
              {...registerPassword('newPassword', {
                required: 'New password is required',
              })}
            />

            <Input
              label={t('patient.profile.confirmPassword')}
              type='password'
              placeholder='••••••••'
              error={passwordErrors.confirmPassword?.message}
              {...registerPassword('confirmPassword', {
                required: 'Please confirm your new password',
              })}
            />

            <div className='pt-2'>
              <Button type='submit' disabled={isChangingPassword}>
                {isChangingPassword
                  ? t('common.loading')
                  : t('patient.profile.updatePassword')}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
