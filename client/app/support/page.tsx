import { Footer } from '@/components/home/Footer';

import SupportContent from '@/components/ui/SupportContent';
import { Header } from '../../components/home/Header';

export default function SupportPage() {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1 mt-10'>
        <SupportContent />
      </main>
      <Footer />
    </div>
  );
}
