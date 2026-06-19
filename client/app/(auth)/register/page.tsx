import { RegisterForm } from '@/components/auth/RegisterForm';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';

export default function RegisterPage() {
  return (
    <div className='flex flex-col items-center text-center w-full mx-auto'>
      <CareNexusLogo
        size={56}
        className='drop-shadow-[0_6px_16px_rgba(15,76,92,0.25)]'
      />
      <h1 className='mt-3 font-display text-[clamp(1.6rem,3.5vw,2.2rem)] leading-[1.1] tracking-[-0.02em] text-text-primary'>
        Create your account
      </h1>
      <p className='mt-2 text-sm font-medium text-text-secondary'>
        Join Care Nexus — your smart health platform
      </p>
      <div className='mt-6 w-full'>
        <RegisterForm />
      </div>
    </div>
  );
}
