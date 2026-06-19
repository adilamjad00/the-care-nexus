'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Upload, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateProfileMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

type FormData = z.infer<typeof schema>;

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [profileImage, setProfileImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name || '',
        email: user.email || '',
      });
      if (user.photo) {
        setProfileImage(
          user.photo.startsWith('http')
            ? user.photo
            : `${process.env.NEXT_PUBLIC_API_URL}${user.photo}`,
        );
      } else {
        setProfileImage('');
      }
      setImageFile(null);
    }
  }, [user, isOpen, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);

      if (imageFile) {
        formData.append('photo', imageFile);
      }

      const result = await updateProfile(formData).unwrap();

      const accessToken = localStorage.getItem('accessToken');
      dispatch(
        setCredentials({
          user: result.data,
          accessToken: accessToken || '',
        }),
      );

      localStorage.setItem('user', JSON.stringify(result.data));

      toast.success('Profile updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Profile Settings' size='md'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='flex flex-col items-center'>
          <div className='relative'>
            {profileImage ? (
              <img
                src={profileImage}
                alt='Profile'
                className='h-24 w-24 rounded-full object-cover border-4 border-slate-200 dark:border-slate-700'
              />
            ) : (
              <div className='h-24 w-24 rounded-full bg-primary flex items-center justify-center border-4 border-slate-200 dark:border-slate-700'>
                <span className='text-3xl font-bold text-black'>
                  {user?.name ? getInitials(user.name) : 'DR'}
                </span>
              </div>
            )}
            <label
              htmlFor='profile-image'
              className='absolute bottom-0 right-0 h-8 w-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-hover transition-all'
            >
              <Upload className='h-4 w-4 text-black' />
              <input
                id='profile-image'
                type='file'
                accept='image/*'
                onChange={handleImageChange}
                className='hidden'
              />
            </label>
          </div>
          <p className='mt-3 text-sm text-gray-500 dark:text-gray-400'>
            Click the upload icon to change profile picture
          </p>
        </div>

        <div className='space-y-4'>
          <Input
            label='Full Name'
            placeholder='Enter your name'
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label='Email Address'
            type='email'
            placeholder='Enter your email'
            error={errors.email?.message}
            {...register('email')}
            disabled
          />
        </div>

        <div className='flex gap-3 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onClose}
            className='flex-1'
          >
            Cancel
          </Button>
          <Button type='submit' className='flex-1' disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
