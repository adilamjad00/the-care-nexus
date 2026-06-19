'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import {
  Heart,
  Activity,
  Code,
  Server,
  Flame,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export function InsightsSection() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  // Integration details (mocking FHIR, HL7, and SaaS standards)
  const integrations = [
    { name: 'HL7 Standard', icon: Server, color: 'text-blue-500 bg-blue-50' },
    { name: 'FHIR API', icon: Flame, color: 'text-orange-500 bg-orange-50' },
    { name: 'React Health', icon: Code, color: 'text-sky-500 bg-sky-50' },
    { name: 'Apple Health', icon: Heart, color: 'text-red-500 bg-red-50' },
    {
      name: 'Google Fit',
      icon: Activity,
      color: 'text-emerald-500 bg-emerald-50',
    },
    {
      name: 'Flutter SDK',
      icon: Smartphone,
      color: 'text-cyan-500 bg-cyan-50',
    },
  ];

  return (
    <section className='py-20 bg-white border-b border-black/[0.02] flex flex-col items-center'>
      <div className='mx-auto max-w-4xl px-6 sm:px-8 text-center'>
        {/* Title */}
        <h2 className='font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight font-black text-text-primary max-w-2xl mx-auto leading-tight'>
          {isUrdu
            ? 'موجودہ EMR/EHR اور ہیلتھ سسٹمز کے ساتھ منٹوں میں مربوط کریں'
            : 'Integrate with existing EMR/EHR systems in minutes'}
        </h2>

        <p className='mt-4 text-xs sm:text-sm text-text-secondary max-w-lg mx-auto font-medium'>
          {isUrdu
            ? 'کیئر نیکسس تمام بڑے طبی پروٹوکولز، ڈیٹا اسٹینڈرڈز اور موبائل فریم ورکس کو سپورٹ کرتا ہے۔'
            : 'Care Nexus supports industry-standard medical protocols, API frameworks, and client SDKs out of the box.'}
        </p>

        {/* Icons Grid/Row */}
        <div className='mt-10 flex flex-wrap items-center justify-center grid grid-cols-3  gap-4 sm:gap-6'>
          {integrations.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className='flex items-center gap-2 bg-slate-50 border border-black/5 hover:border-black/10 rounded-xl px-4 py-3 shadow-sm transition-all hover:-translate-y-0.5 duration-150'
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.color}`}
                >
                  <Icon className='h-4.5 w-4.5' strokeWidth={2.2} />
                </div>
                <span className='font-sans text-[11px] sm:text-xs font-bold text-text-primary'>
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Rating Stars footer */}
        <div className='mt-6 flex flex-col items-center gap-1 mt-8'>
          <div className='text-orange-500 text-ms tracking-wider'>★★★★★</div>
          <p className='text-[12px] font-bold text-text-muted'>
            {isUrdu
              ? 'طبی معیارات اور HIPAA سیکیورٹی گائیڈ لائنز کے مطابق تصدیق شدہ'
              : 'HIPAA compliant and certified by leading digital health registries'}
          </p>
        </div>

        {/* CTA Button */}
        <div className='mt-6'>
          <Link href='/docs'>
            <Button
              size='lg'
              className='px-8 font-extrabold bg-[#3b59ff] hover:bg-[#2546ff] text-white rounded-full text-xs shadow-md transition-all'
            >
              <span className='flex items-center gap-1.5'>
                {isUrdu
                  ? 'ہمارے انٹیگریشنز دریافت کریں'
                  : 'Explore our integrations'}
                <ArrowRight className='w-3.5 h-3.5' />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
