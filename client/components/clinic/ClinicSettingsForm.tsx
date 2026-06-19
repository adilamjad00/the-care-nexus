'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  useGetSettingsQuery,
  useSaveSettingsMutation,
} from '@/store/api/clinicApi';
import { toast } from 'react-hot-toast';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTranslations } from 'next-intl';

const schema = z.object({
  name: z.string().min(2, 'Clinic name is required'),
  address: z.string().min(5, 'Address is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email address'),
  workingHours: z.object({
    monday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    tuesday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    wednesday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    thursday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    friday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    saturday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
    sunday: z.object({
      open: z.string(),
      close: z.string(),
      closed: z.boolean(),
    }),
  }),
});

type FormData = z.infer<typeof schema>;

export default function ClinicSettingsForm() {
  const t = useTranslations();
  const { data, isLoading } = useGetSettingsQuery(undefined);
  const [saveSettings, { isLoading: isSaving }] = useSaveSettingsMutation();
  const [photo, setPhoto] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(t('clinic.imageSizeError'));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      workingHours: {
        monday: { open: '09:00', close: '17:00', closed: false },
        tuesday: { open: '09:00', close: '17:00', closed: false },
        wednesday: { open: '09:00', close: '17:00', closed: false },
        thursday: { open: '09:00', close: '17:00', closed: false },
        friday: { open: '09:00', close: '17:00', closed: false },
        saturday: { open: '09:00', close: '17:00', closed: true },
        sunday: { open: '09:00', close: '17:00', closed: true },
      },
    },
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        name: data.data.name,
        address: data.data.address,
        phone: data.data.phone,
        email: data.data.email,
        workingHours: data.data.workingHours,
      });
      if (data.data.photo) {
        setPhoto(
          data.data.photo.startsWith('http') ||
            data.data.photo.startsWith('data:')
            ? data.data.photo
            : `${process.env.NEXT_PUBLIC_API_URL}${data.data.photo}`,
        );
      }
    }
  }, [data, reset]);

  const onSubmit = async (formData: FormData) => {
    toast.promise(saveSettings({ ...formData, photo }).unwrap(), {
      loading: t('common.loading'),
      success: 'Settings saved',
      error: t('common.error'),
    });
  };

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ] as const;

  if (isLoading) {
    return (
      <div className='bg-white p-6 rounded-2xl border border-border-light h-96 animate-pulse'></div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6 '>
      <div className='bg-white p-6 rounded-2xl border border-border-light lens-card'>
        <h2 className='text-lg font-bold text-text-primary mb-6'>
          {t('clinic.clinicName')}
        </h2>

        <div className='flex flex-col items-center mb-8 pb-8 border-b border-border-light'>
          <div className='relative group'>
            <div className='h-28 w-28 rounded-2xl overflow-hidden border-2 border-dashed border-border-light bg-background/50 flex items-center justify-center transition-all group-hover:border-primary/50'>
              {photo ? (
                <img
                  src={photo}
                  alt='Clinic Logo'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex flex-col items-center gap-1 text-text-secondary'>
                  <svg
                    className='w-8 h-8'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                    />
                  </svg>
                  <span className='text-[10px] font-black uppercase tracking-widest'>
                    {t('clinic.identityLogo')}
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
            {photo && (
              <button
                type='button'
                onClick={() => setPhoto(null)}
                className='absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10'
              >
                ×
              </button>
            )}
          </div>
          <p className='text-[10px] text-text-secondary mt-3 font-bold uppercase tracking-widest'>
            {t('clinic.visualIdentity')}
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label={t('settings.clinicName')}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label={t('form.email')}
            type='email'
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label={t('form.phone')}
            error={errors.phone?.message}
            {...register('phone')}
          />

          <Input
            label={t('settings.address')}
            error={errors.address?.message}
            {...register('address')}
          />
        </div>
      </div>

      <div className='bg-white p-6 rounded-2xl border border-border-light lens-card'>
        <h2 className='text-lg font-bold text-text-primary mb-6'>
          {t('settings.workingHours')}
        </h2>

        <div className='space-y-4'>
          {days.map((day) => (
            <div key={day} className='flex items-center gap-4'>
              <div className='w-32'>
                <p className='text-sm font-semibold text-text-primary capitalize'>
                  {t(`schedule.${day}`)}
                </p>
              </div>

              <Controller
                name={`workingHours.${day}.closed`}
                control={control}
                render={({ field }) => (
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={field.value}
                      onChange={field.onChange}
                      className='h-4 w-4 text-primary rounded focus:ring-primary'
                    />
                    <span className='text-sm text-text-secondary'>
                      {t('settings.closed')}
                    </span>
                  </label>
                )}
              />

              {!watch(`workingHours.${day}.closed`) && (
                <>
                  <input
                    type='time'
                    {...register(`workingHours.${day}.open`)}
                    className='h-12 px-3 rounded-lg border border-border-light bg-white text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
                  />
                  <span className='text-text-secondary' dir='ltr'>
                    —
                  </span>
                  <input
                    type='time'
                    {...register(`workingHours.${day}.close`)}
                    className='h-12 px-3 rounded-lg border border-border-light bg-white text-[15px] text-text-primary focus:outline-none focus:border-primary transition-colors'
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSaving}>
          {isSaving ? t('common.loading') : t('clinic.saveSettings')}
        </Button>
      </div>
    </form>
  );
}
