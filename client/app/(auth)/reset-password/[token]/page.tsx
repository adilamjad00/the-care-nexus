'use client';

import { useState } from 'react';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';

import { useResetPasswordMutation } from '@/store/api/authApi';
import { Button } from '@/components/ui/Button';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return toast.error('Passwords do not match');
    if (password.length < 6)
      return toast.error('Password must be at least 6 characters');

    try {
      await resetPassword({ token: token as string, password }).unwrap();
      setIsSuccess(true);
      toast.success('Password updated!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to reset password');
    }
  };

  return (
    <div className='flex flex-col items-center text-center'>
      <CareNexusLogo
        size={56}
        className='mx-auto mb-6 drop-shadow-[0_6px_16px_rgba(15,76,92,0.25)]'
      />
      <h1 className='mt-6 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-text-primary'>
        {isSuccess ? 'Password updated' : 'Set a new password'}
      </h1>

      {isSuccess ? (
        <div className='mt-8 w-full rounded-2xl border border-border-light bg-surface-cream/60 p-8 text-center'>
          <div className='mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
            <CheckCircle2 className='h-6 w-6 text-primary' />
          </div>
          <p className='text-[14px] text-text-secondary leading-relaxed'>
            You can now log in with your new password.
          </p>
          <div className='mt-6'>
            <Button onClick={() => router.push('/login')}>Back to login</Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleReset}
          className='mt-8 w-full rounded-2xl border border-border-light bg-surface-cream/60 p-5 sm:p-6 text-left space-y-3 lens-card'
        >
          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='New password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='block h-12 w-full rounded-lg border border-border-light bg-white pl-4 pr-12 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
            />
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:text-text-primary cursor-pointer'
            >
              {showPassword ? (
                <EyeOff className='h-4.5 w-4.5' />
              ) : (
                <Eye className='h-4.5 w-4.5' />
              )}
            </button>
          </div>

          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
          />

          <Button
            type='submit'
            size='lg'
            className='w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      )}
    </div>
  );
}
