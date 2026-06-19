'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { Heart, Activity, Shield, Cross, Sparkles } from 'lucide-react';

export function PoweredBySection() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  // Muted clinical partner logo details
  const partners = [
    { name: 'Apex Health', icon: Activity },
    { name: 'Sina Clinic', icon: Heart },
    { name: 'OmniCare', icon: Shield },
    { name: 'Pulse Network', icon: Sparkles },
    { name: 'Al-Shifa Care', icon: Cross },
  ];

  return (
    <section className='py-12 bg-[#09101d] border-y border-black/[0.03]'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 text-center'>
        {/* Title */}
        <p className='text-[12px] sm:text-sm font-bold tracking-widest text-white uppercase'>
          {isUrdu
            ? 'دنیا بھر میں 200 سے زائد ہیلتھ کیئر کلینکس اور ہسپتالوں کا بھروسہ'
            : 'Trusted by over 200 healthcare clinics and hospitals worldwide'}
        </p>

        {/* Logos Row */}
        <div className='mt-14 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 md:gap-x-16'>
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className='flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors duration-150'
              >
                <Icon className='h-10 w-10 text-white' strokeWidth={2} />
                <span className='font-sans text-xl font-extrabold tracking-tight text-white'>
                  {partner.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
