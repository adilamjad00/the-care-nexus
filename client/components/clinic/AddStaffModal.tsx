import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAddStaffMutation } from '@/store/api/clinicApi';
import { toast } from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { showToast } from '@/lib/toast';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  role: z.enum(['receptionist', 'nurse', 'admin']),
});

type FormData = z.infer<typeof schema>;

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddStaffModal({ isOpen, onClose }: AddStaffModalProps) {
  const t = useTranslations();
  const [addStaff, { isLoading }] = useAddStaffMutation();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      await addStaff({ ...data, photo: profileImage }).unwrap();
      showToast.staffCreated(t);
      setProfileImage(null);
      reset();
      onClose();
    } catch (error: any) {
      showToast.error(t, error?.data?.message);
    }
  };

  const handleClose = () => {
    setProfileImage(null);
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('clinic.addStaff')}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex flex-col items-center mb-6'>
          <div className='relative group'>
            <div className='h-24 w-24 rounded-2xl overflow-hidden border-2 border-dashed border-border-light bg-background flex items-center justify-center transition-all group-hover:border-primary/50'>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt='Preview'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex flex-col items-center gap-1 text-text-secondary'>
                  <User size={32} />
                  <span className='text-[10px] font-bold uppercase tracking-widest'>
                    {t('clinic.staff.photo')}
                  </span>
                </div>
              )}
            </div>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
            {profileImage && (
              <button
                type='button'
                onClick={() => setProfileImage(null)}
                className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors'
              >
                ×
              </button>
            )}
          </div>
          <p className='text-[10px] text-text-secondary mt-2 font-medium'>
            {t('clinic.staff.uploadPhoto')}
          </p>
        </div>

        <Input
          label={t('form.name')}
          placeholder='John Doe'
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label={t('form.email')}
          type='email'
          placeholder='staff@example.com'
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label={t('form.phone')}
          placeholder='+1 234 567 8900'
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div>
          <label className='block text-sm font-semibold text-text-primary mb-2'>
            {t('clinic.staff.role')}
          </label>
          <select
            {...register('role')}
            className='h-12 w-full px-4 rounded-lg border border-border-light bg-white text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
          >
            <option value=''>{t('common.filter.all')}</option>
            <option value='receptionist'>Receptionist</option>
            <option value='nurse'>Nurse</option>
            <option value='admin'>Admin</option>
          </select>
          {errors.role && (
            <p className='mt-1 text-sm text-red-600'>{errors.role.message}</p>
          )}
        </div>

        <div className='flex gap-3 justify-end pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={handleClose}
            disabled={isLoading}
          >
            {t('common.cancel')}
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? t('common.loading') : t('clinic.addStaff')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
