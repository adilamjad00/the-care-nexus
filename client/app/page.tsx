import { Header } from '@/components/home/Header';
import { Hero } from '@/components/home/Hero';
import { ImportSection } from '@/components/home/ImportSection';
import { InsightsSection } from '@/components/home/InsightsSection';
import { ResultsSection } from '@/components/home/ResultsSection';
import { PrescriptionsSection } from '@/components/home/PrescriptionsSection';
import { PoweredBySection } from '@/components/home/PoweredBySection';
import { FAQsSection } from '@/components/home/FAQsSection';
import { FinalCTA } from '@/components/home/FinalCTA';
import { Footer } from '@/components/home/Footer';
import { WhyCareNexus } from '@/components/home/WhyCareNexus';

export default function Home() {
  return (
    <div className='min-h-screen font-sans text-text-primary overflow-x-hidden'>
      <div>
        <Header />
        <main>
          <Hero />
          <PoweredBySection />
          <ImportSection />
          <ResultsSection />
          <InsightsSection />
          <FinalCTA />
          <WhyCareNexus />
          {/* <FAQsSection /> */}
        </main>
        <Footer />
      </div>
    </div>
  );
}
