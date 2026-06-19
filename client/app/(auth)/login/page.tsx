import { LoginForm } from '@/components/auth/LoginForm';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';

export default function LoginPage() {
  return (
    <div className='flex flex-col items-center text-center w-full'>
      <CareNexusLogo
        size={56}
        className='drop-shadow-[0_6px_16px_rgba(15,76,92,0.25)]'
      />

      <h1 className='mt-3 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.1] tracking-[-0.02em] text-text-primary'>
        Welcome back
      </h1>
      <p className='mt-2 text-sm font-medium text-text-secondary'>
        Sign in to your Care Nexus account
      </p>
      <div className='w-full max-w-7xl mt-6'>
        <LoginForm />
      </div>
    </div>
  );
}
