import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-background text-text-primary px-4'>
      <div className='text-center max-w-md'>
        <div className='flex justify-center'>
          <CareNexusLogo size={80} />
        </div>

        {/* BADGE */}
        <div className='mt-6 inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-1.5 text-xs font-semibold text-primary'>
          <AlertTriangle className='w-3.5 h-3.5' />
          404 Error
        </div>

        <h1 className='mt-6 text-4xl md:text-5xl font-black'>Page not found</h1>

        <p className='mt-4 text-text-secondary'>
          The page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className='mt-10'>
          <Link href='/'>
            <Button className='w-full' size='lg'>
              <Home className='w-4 h-4 mr-2' />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
