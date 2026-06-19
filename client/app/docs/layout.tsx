import DocsSidebar from './components/DocsSidebar';
import Link from 'next/link';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen flex flex-col w-full bg-[#EFF4FB]'>
      <Header />

      <main className='flex-1 max-w-7xl mx-auto w-full'>
        <div className='flex flex-col md:flex-row'>
          {/* Fixed sidebar */}
          <aside className='w-full md:w-72 shrink-0 sticky top-18 h-fit'>
            <div className='flex-1 overflow-y-auto'>
              <DocsSidebar />
            </div>
          </aside>

          {/* Main content area */}
          <div className='flex-1 flex flex-col min-w-0'>
            {/* Mobile topbar */}
            <header className='lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-[rgba(37,99,235,0.10)] sticky top-0 z-20'>
              <Link href='/' className='flex items-center gap-2'>
                <CareNexusLogo size={26} />
                <span className='font-bold text-[14px] text-text-primary'>
                  CareNexus Docs
                </span>
              </Link>
            </header>

            <main className='flex-1 px-6 sm:px-8 lg:px-10 xl:px-14 py-4 lg:py-6 max-w-4xl'>
              {children}
            </main>

            <footer className='px-6 sm:px-8 lg:px-10 xl:px-14 py-6 border-t border-[rgba(37,99,235,0.08)] text-[12px] text-text-muted'>
              © 2026 The Care Nexus. All rights reserved.
              <span className='mx-2'>·</span>
              <Link
                href='/privacy-policy'
                className='hover:text-primary transition-colors'
              >
                Privacy
              </Link>
              <span className='mx-2'>·</span>
              <Link
                href='/docs/support'
                className='hover:text-primary transition-colors'
              >
                Support
              </Link>
            </footer>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
