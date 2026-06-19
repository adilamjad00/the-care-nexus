'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import { useLoginMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  Eye,
  EyeOff,
  UserPlus,
  Stethoscope,
  Building2,
  Loader2,
} from 'lucide-react';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

const ROLES: {
  value: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    value: 'patient',
    label: 'Patient',
    description: 'Your health records & appointments',
    icon: UserPlus,
  },
  {
    value: 'doctor',
    label: 'Doctor',
    description: 'See patients, review labs, prescribe',
    icon: Stethoscope,
  },
  {
    value: 'clinic_admin',
    label: 'Clinic',
    description: 'Manage staff, schedules, and revenue',
    icon: Building2,
  },
];

function GoogleIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox='0 0 48 48' aria-hidden>
      <path
        fill='#EA4335'
        d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
      />
      <path
        fill='#4285F4'
        d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
      />
      <path
        fill='#FBBC05'
        d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
      />
      <path
        fill='#34A853'
        d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
      />
    </svg>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<string>('patient');

  const [login, { isLoading }] = useLoginMutation();
  const { handleGoogleAuth, isLoading: isGoogleLoading } = useGoogleAuth({
    mode: 'login',
    role,
  });
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    const toastId = toast.loading('Authenticating...');
    try {
      const res = await login({ email: email.trim(), password, role }).unwrap();
      dispatch(
        setCredentials({
          user: res.data,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
      );
      toast.success('Welcome back!', { id: toastId });
      router.push(`/dashboard/${role}`);
    } catch (err: any) {
      // Keep all form state — only show the error
      toast.error(
        err?.data?.message || 'Invalid credentials. Please try again.',
        { id: toastId },
      );
    }
  };

  return (
    <>
      <div className='rounded-2xl max-w-7xl mx-auto border border-border-light bg-white/80 p-5 sm:p-6 shadow-sm backdrop-blur-sm lens-card'>
        {/* Role selector */}
        <div className='mb-4 grid grid-cols-3 gap-2'>
          {ROLES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type='button'
              onClick={() => setRole(value)}
              className={cn(
                'inline-flex items-center justify-center gap-1.5 h-10 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer border',
                role === value
                  ? 'border-primary bg-primary text-white shadow-sm'
                  : 'border-border-light bg-white text-text-primary hover:border-primary/50 hover:text-primary',
              )}
            >
              <Icon className='h-3.5 w-3.5' />
              {label}
            </button>
          ))}
        </div>

        <button
          type='button'
          className='w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-border-light bg-white text-[15px] font-semibold text-text-primary transition-colors hover:border-primary/50 hover:text-primary cursor-pointer disabled:opacity-50'
          onClick={handleGoogleAuth}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className='h-5 w-5 animate-spin text-primary' />
          ) : (
            <GoogleIcon />
          )}
          Continue with Google
        </button>

        <div className='my-5 flex items-center gap-3 text-[13px] text-text-secondary'>
          <span className='h-px flex-1 bg-border-light' />
          Or
          <span className='h-px flex-1 bg-border-light' />
        </div>

        <form onSubmit={handleSubmit} className='space-y-3'>
          <input
            type='email'
            autoComplete='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
          />

          <div className='relative'>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete='current-password'
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='block h-12 w-full rounded-lg border border-border-light bg-white pl-4 pr-12 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
            />
            <button
              type='button'
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-secondary hover:text-text-primary cursor-pointer'
            >
              {showPassword ? (
                <EyeOff className='h-4.5 w-4.5' />
              ) : (
                <Eye className='h-4.5 w-4.5' />
              )}
            </button>
          </div>

          <div className='flex items-center justify-end'>
            <Link
              href='/forgot-password'
              className='text-[13px] font-medium text-text-secondary hover:text-primary'
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type='submit'
            size='lg'
            className='w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>

      <p className='mt-6 text-[14px] text-text-secondary'>
        New to Care Nexus?{' '}
        <Link
          href='/register'
          className='font-semibold text-text-primary hover:text-primary'
        >
          Sign up
        </Link>
      </p>
    </>
  );
}
