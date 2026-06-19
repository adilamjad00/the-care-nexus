'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { useForgotPasswordMutation } from '@/store/api/authApi';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    try {
      await forgotPassword({ email }).unwrap();
      setIsSubmitted(true);
      toast.success('Reset link sent to your email!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className='flex flex-col items-center text-center'>
      <CareNexusLogo
        size={56}
        className='drop-shadow-[0_6px_16px_rgba(15,76,92,0.25)]'
      />
      <h1 className='mt-4 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-text-primary'>
        {isSubmitted ? 'Check your email' : 'Reset your password'}
      </h1>

      {isSubmitted ? (
        <div className='mt-8 w-full rounded-2xl border border-border-light bg-surface-cream/60 p-8 text-center'>
          <div className='mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
            <CheckCircle2 className='h-6 w-6 text-primary' />
          </div>
          <p className='text-[14px] text-text-secondary leading-relaxed'>
            We&apos;ve sent a password reset link to{' '}
            <span className='font-semibold text-text-primary'>{email}</span>.
          </p>
          <div className='mt-6'>
            <Link href='/login'>
              <Button variant='outline'>Back to login</Button>
            </Link>
          </div>
        </div>
      ) : (
        <>
          <p className='mt-3 max-w-sm text-[14px] text-text-secondary leading-relaxed'>
            Enter your email and we&apos;ll send you a link to set a new
            password across all your Care Nexus roles.
          </p>

          <form
            onSubmit={handleSubmit}
            className='mt-6 w-full rounded-2xl border border-border-light bg-surface-cream/60 p-5 sm:p-6 text-left space-y-3 lens-card'
          >
            <input
              type='email'
              autoComplete='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
            />
            <Button
              type='submit'
              size='lg'
              className='w-full'
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <p className='mt-6 text-[14px] text-text-secondary'>
            Remember your password?{' '}
            <Link
              href='/login'
              className='font-semibold text-text-primary hover:text-primary'
            >
              Log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}
