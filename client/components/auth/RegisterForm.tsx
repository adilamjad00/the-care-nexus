'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';

import { useRegisterMutation } from '@/store/api/authApi';
import { setCredentials } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/Button';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  UserPlus,
  Stethoscope,
  Building2,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

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

type Role = 'patient' | 'doctor' | 'clinic_admin';

const ROLES: {
  value: Role;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { value: 'patient', label: 'Patient', icon: UserPlus },
  { value: 'doctor', label: 'Doctor', icon: Stethoscope },
  { value: 'clinic_admin', label: 'Clinic', icon: Building2 },
];

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>('patient');
  const { handleGoogleAuth, isLoading: isGoogleLoading } = useGoogleAuth({
    mode: 'register',
    role,
  });

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [address, setAddress] = useState('');

  const [agreedTos, setAgreedTos] = useState(false);
  const [agreedHie, setAgreedHie] = useState(false);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const validate = () => {
    if (!isEmailValid)
      return (toast.error('Please enter a valid email address.'), false);
    if (!password || password.length < 6)
      return (toast.error('Password must be at least 6 characters.'), false);
    if (!agreedTos || !agreedHie)
      return (toast.error('Please accept both agreements to continue.'), false);

    if (role === 'patient' && (!fullName.trim() || !phone.trim()))
      return (toast.error('Please fill in your full name and phone.'), false);
    if (
      role === 'doctor' &&
      (!fullName.trim() || !specialization.trim() || !licenseNo.trim())
    )
      return (toast.error('Please fill in your doctor details.'), false);
    if (
      role === 'clinic_admin' &&
      (!clinicName.trim() || !address.trim() || !phone.trim())
    )
      return (toast.error('Please fill in your clinic details.'), false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const profileData =
      role === 'patient'
        ? { fullName, phone }
        : role === 'doctor'
          ? { fullName, specialization, licenseNo }
          : { clinicName, address, phone };

    const toastId = toast.loading('Creating your account...');
    try {
      const res: any = await register({
        email,
        password,
        role,
        profileData,
      }).unwrap();
      if (typeof window !== 'undefined') {
        localStorage.setItem('carenexus_new_signup', email.trim());
      }
      if (res?.accessToken && res?.data) {
        dispatch(
          setCredentials({
            user: res.data,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          }),
        );
      }
      setIsSubmitted(true);
      toast.success('Verification email sent!', { id: toastId });
    } catch (err: any) {
      toast.error(err?.data?.message || 'Registration failed', { id: toastId });
    }
  };

  if (isSubmitted) {
    return (
      <div className='rounded-2xl mx-auto border border-border-light bg-surface-cream/60 p-8 text-center'>
        <div className='mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary/10'>
          <CheckCircle2 className='h-7 w-7 text-primary' />
        </div>
        <p className='text-[15px] text-text-primary'>
          We&apos;ve sent a verification link to{' '}
          <span className='font-semibold'>{email}</span>.
        </p>
        <div className='mt-6 flex justify-center'>
          <Link href='/login'>
            <Button variant='outline'>Back to login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='rounded-2xl border border-border-light bg-white/80 p-5 sm:p-6 text-left shadow-sm backdrop-blur-sm lens-card'>
        <div className='mb-4 grid grid-cols-3 gap-2'>
          {ROLES.map(({ value, label, icon: Icon }) => {
            const selected = role === value;
            return (
              <button
                key={value}
                type='button'
                onClick={() => setRole(value)}
                className={cn(
                  'inline-flex items-center justify-center gap-1.5 h-10 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer border',
                  selected
                    ? 'border-primary bg-primary text-white shadow-sm'
                    : 'border-border-light bg-white text-text-primary hover:border-primary/50 hover:text-primary',
                )}
              >
                <Icon className='h-3.5 w-3.5' strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </div>

        <button
          type='button'
          className='w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-border-light bg-white text-[15px] font-semibold text-text-primary transition-colors hover:border-primary/50 hover:text-primary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
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
          {(role === 'patient' || role === 'doctor') && (
            <input
              type='text'
              placeholder='Full name'
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
            />
          )}

          {role === 'clinic_admin' && (
            <input
              type='text'
              placeholder='Clinic name'
              value={clinicName}
              onChange={(e) => setClinicName(e.target.value)}
              required
              className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
            />
          )}

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
              autoComplete='new-password'
              placeholder='Create a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
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

          {role === 'doctor' && (
            <>
              <input
                type='text'
                placeholder='Specialization'
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                required
                className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
              />
              <input
                type='text'
                placeholder='Medical license number'
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                required
                className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
              />
            </>
          )}

          {role === 'clinic_admin' && (
            <input
              type='text'
              placeholder='Clinic address'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
            />
          )}

          {(role === 'patient' || role === 'clinic_admin') && (
            <input
              type='tel'
              placeholder='Contact number'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className='block h-12 w-full rounded-lg border border-border-light bg-white px-4 text-[15px] text-text-primary placeholder:text-text-secondary transition-colors focus:outline-none focus:border-primary'
            />
          )}

          <label className='flex items-start gap-3 pt-2 text-[13px] text-text-secondary leading-relaxed cursor-pointer'>
            <input
              type='checkbox'
              checked={agreedTos}
              onChange={(e) => setAgreedTos(e.target.checked)}
              className='mt-0.5 h-4 w-4 flex-none rounded border border-border cursor-pointer'
            />
            <span>
              I have read and acknowledge the{' '}
              <Link
                href='/cookie-policy'
                className='font-semibold text-text-primary hover:text-primary'
              >
                Terms of Service
              </Link>
              ,{' '}
              <span className='font-semibold text-text-primary'>
                Consent to Treatment
              </span>{' '}
              and{' '}
              <Link
                href='/privacy-policy'
                className='font-semibold text-text-primary hover:text-primary'
              >
                Privacy Policy
              </Link>
            </span>
          </label>

          <label className='flex items-start gap-3 text-[13px] text-text-secondary leading-relaxed cursor-pointer'>
            <input
              type='checkbox'
              checked={agreedHie}
              onChange={(e) => setAgreedHie(e.target.checked)}
              className='mt-0.5 h-4 w-4 flex-none rounded border border-border cursor-pointer'
            />
            <span>
              I have read and agree to the{' '}
              <span className='font-semibold text-text-primary'>
                Health Information Exchange
              </span>{' '}
              notice
            </span>
          </label>

          <Button
            type='submit'
            size='lg'
            className='mt-1 w-full'
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Continue with email'}
          </Button>
        </form>
      </div>

      <p className='mt-4 text-[14px] text-text-secondary'>
        Already have an account?{' '}
        <Link
          href='/login'
          className='font-semibold text-text-primary hover:text-primary'
        >
          Log in
        </Link>
      </p>
    </>
  );
}
