'use client';

import { Pill, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export function PrescriptionsSection() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  return (
    <section className='px-4 sm:px-6 lg:px-10 py-20 sm:py-28'>
      <div className='mx-auto max-w-[900px] text-center'>
        <h2 className='font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] tracking-[-0.02em] text-text-primary'>
          {isUrdu
            ? 'کم انتظامی بوجھ کے ساتھ وائس اینیبلڈ پریسکرپشنز'
            : 'Voice-enabled prescriptions with less admin work'}
        </h2>
        <p className='mt-5 text-[17px] text-text-secondary max-w-xl mx-auto leading-relaxed'>
          {isUrdu
            ? 'The Care Nexus ڈاکٹروں کو تیزی سے ڈیجیٹل پریسکرپشنز بنانے، میڈیکیشن ہسٹری منظم رکھنے، اور بار بار ہونے والے کاغذی کام کو کم کرنے میں مدد دیتا ہے۔'
            : 'The Care Nexus helps doctors generate digital prescriptions faster, keep medication history organized, and reduce repetitive paperwork.'}
        </p>
      </div>

      <div className='mx-auto max-w-[1100px] mt-14 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <PrescriptionCard
          icon={<Stethoscope className='h-3.5 w-3.5' strokeWidth={2.5} />}
          chip={isUrdu ? 'ڈاکٹر ورک فلو' : 'Doctor workflow'}
          title={
            isUrdu ? 'وائس ٹو پریسکرپشن ڈرافٹ' : 'Voice-to-prescription draft'
          }
          body={
            isUrdu
              ? 'نوٹس کیپچر کریں اور اسٹرکچرڈ پریسکرپشنز بنائیں جو ہر مریض کی ٹائم لائن سے منسلک ہوں۔'
              : "Capture notes and create structured prescriptions tied to each patient's timeline."
          }
          tone='lavender'
        />
        <PrescriptionCard
          icon={<Pill className='h-3.5 w-3.5' strokeWidth={2.5} />}
          chip={isUrdu ? 'پیشنٹ ریکارڈز · سنک' : 'Patient records · synced'}
          title={
            isUrdu
              ? 'پورٹلز میں ہمیشہ دستیاب'
              : 'Always available across portals'
          }
          body={
            isUrdu
              ? 'پریسکرپشنز اپائنٹمنٹس اور ریکارڈز کے ساتھ منسلک رہتی ہیں تاکہ ڈاکٹرز، کلینکس اور پیشنٹس کو یکساں رسائی ملے۔'
              : 'Prescriptions remain connected with appointments and records for doctors, clinics, and patients.'
          }
          tone='cream'
        />
      </div>
    </section>
  );
}

function PrescriptionCard({
  icon,
  chip,
  title,
  body,
  tone,
}: {
  icon: React.ReactNode;
  chip: string;
  title: string;
  body: string;
  tone: 'cream' | 'blue' | 'lavender';
}) {
  const bg =
    tone === 'cream'
      ? 'bg-surface-cream'
      : tone === 'blue'
        ? 'bg-surface'
        : 'bg-surface-lavender';

  return (
    <div className='rounded-[18px] border border-border-light overflow-hidden bg-white'>
      <div className={`relative ${bg} px-6 pt-8 pb-10`}>
        <div className='inline-flex items-center gap-1.5 rounded-md bg-white/80 backdrop-blur-sm px-2.5 py-1 text-[12px] font-medium text-primary'>
          {icon}
          {chip}
        </div>
        <div className='mt-3 inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-2 text-[13px] text-text-primary shadow-[0_2px_6px_-2px_rgba(0,0,0,0.05)]'>
          <span className='h-1.5 w-1.5 rounded-full bg-primary' />
          {title}
        </div>
      </div>
      <div className='px-6 py-5'>
        <p className='text-[14px] text-text-secondary leading-relaxed'>
          {body}
        </p>
      </div>
    </div>
  );
}
