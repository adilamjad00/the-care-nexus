'use client';

import { useEffect, useRef } from 'react';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

import { useVerifyEmailMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';

export default function VerifyPage() {
  const { token } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [verifyEmail, { isLoading, isSuccess, isError, error }] =
    useVerifyEmailMutation();
  const hasCalled = useRef(false);

  useEffect(() => {
    if (token && !hasCalled.current) {
      hasCalled.current = true;
      (async () => {
        try {
          const res: any = await verifyEmail(token).unwrap();
          dispatch(
            setCredentials({
              user: res.data,
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            }),
          );
          if (typeof window !== 'undefined' && res.data?.email) {
            localStorage.setItem('carenexus_new_signup', res.data.email);
          }
          const roles: string[] = Array.isArray(res.data?.roles)
            ? res.data.roles
            : [];
          const role =
            res.data?.verifiedRole || roles[roles.length - 1] || 'patient';
          toast.success('Email verified!');
          setTimeout(() => router.push(`/dashboard/${role}`), 1800);
        } catch (err: any) {
          toast.error(err?.data?.message || 'Verification failed');
        }
      })();
    }
  }, [token, verifyEmail, dispatch, router]);

  return (
    <div className='flex flex-col items-center text-center'>
      <CareNexusLogo
        size={56}
        className='mx-auto mb-6 drop-shadow-[0_6px_16px_rgba(15,76,92,0.25)]'
      />
      <div className='mt-8 w-full rounded-2xl border border-border-light bg-surface-cream/60 p-8'>
        {isLoading && (
          <div className='flex flex-col items-center'>
            <Loader2 className='h-8 w-8 text-primary animate-spin mb-5' />
            <h2 className='font-display text-2xl leading-tight tracking-[-0.02em] text-text-primary'>
              Verifying your email
            </h2>
            <p className='mt-2 text-[14px] text-text-secondary'>
              This should only take a moment.
            </p>
          </div>
        )}

        {isSuccess && (
          <div className='flex flex-col items-center'>
            <div className='mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
              <CheckCircle2 className='h-6 w-6 text-primary' />
            </div>
            <h2 className='font-display text-2xl leading-tight tracking-[-0.02em] text-text-primary'>
              Email verified
            </h2>
            <p className='mt-2 text-[14px] text-text-secondary'>
              Taking you to your dashboard…
            </p>
          </div>
        )}

        {isError && (
          <div className='flex flex-col items-center'>
            <div className='mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50'>
              <XCircle className='h-6 w-6 text-red-500' />
            </div>
            <h2 className='font-display text-2xl leading-tight tracking-[-0.02em] text-text-primary'>
              Verification failed
            </h2>
            <p className='mt-2 text-[14px] text-text-secondary'>
              {(error as any)?.data?.message ||
                'The link might be invalid or expired.'}
            </p>
            <div className='mt-6'>
              <Button
                variant='outline'
                onClick={() => router.push('/register')}
              >
                Back to sign up
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
