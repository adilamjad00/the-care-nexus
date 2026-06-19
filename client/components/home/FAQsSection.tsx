'use client';

import { useState } from 'react';
import { Plus, Minus, Heart, Users, ShieldAlert, Award } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const FAQS_EN = [
  {
    q: 'What is The Care Nexus?',
    a: 'The Care Nexus is a digital healthcare platform for doctors, clinics, and patients. It centralizes records, prescriptions, communication, and operational insights.',
  },
  {
    q: 'Who can use The Care Nexus?',
    a: 'Doctors, clinic admins, and patients can each use dedicated modules. Doctors manage consultations and prescriptions, clinics monitor operations, and patients track records and appointments.',
  },
  {
    q: 'Does The Care Nexus support voice-based workflows?',
    a: 'Yes. The Care Nexus is designed around voice-assisted workflows, including voice-to-prescription drafting to reduce manual writing time for healthcare providers.',
  },
  {
    q: 'Does The Care Nexus support Urdu and English?',
    a: 'Yes. The Care Nexus provides multilingual interaction with Urdu and English support to improve accessibility for diverse users.',
  },
  {
    q: 'What analytics does The Care Nexus provide for clinics?',
    a: 'Clinic admins can monitor patient flow, scheduling activity, and revenue-related trends to improve operations and decision-making.',
  },
  {
    q: 'How does The Care Nexus improve continuity of care?',
    a: 'By keeping appointments, prescriptions, notes, and records connected in one system, The Care Nexus helps teams and patients avoid fragmented or missing information.',
  },
];

const FAQS_UR = [
  {
    q: 'دی کیئر نیکسس کیا ہے؟',
    a: 'دی کیئر نیکسس ایک ڈیجیٹل ہیلتھ کیئر پلیٹ فارم ہے جو ڈاکٹروں، کلینکس اور مریضوں کے لیے ریکارڈز، پریسکرپشنز، کمیونیکیشن اور آپریشنل انسائٹس کو ایک جگہ لاتا ہے۔',
  },
  {
    q: 'دی کیئر نیکسس کون استعمال کر سکتا ہے؟',
    a: 'ڈاکٹرز، کلینک ایڈمنز اور مریض سب اپنے متعلقہ ماڈیولز استعمال کر سکتے ہیں۔ ڈاکٹرز کنسلٹیشن اور پریسکرپشنز سنبھالتے ہیں، کلینکس آپریشنز دیکھتے ہیں، اور مریض ریکارڈز اور اپائنٹمنٹس ٹریک کرتے ہیں۔',
  },
  {
    q: 'کیا دی کیئر نیکسس وائس بیسڈ ورک فلو سپورٹ کرتا ہے؟',
    a: 'جی ہاں، دی کیئر نیکسس وائس اسسٹڈ ورک فلوز کے لیے ڈیزائن کیا گیا ہے، جن میں وائس ٹو پریسکرپشن ڈرافٹنگ شامل ہے تاکہ دستی لکھائی کا وقت کم ہو۔',
  },
  {
    q: 'کیا دی کیئر نیکسس اردو اور انگلش سپورٹ کرتا ہے؟',
    a: 'جی ہاں، دی کیئر نیکسس متنوع صارفین کے لیے اردو اور انگلش میں ملٹی لنگول انٹریکشن فراہم کرتا ہے۔',
  },
  {
    q: 'کلینکس کے لیے دی کیئر نیکسس کون سی اینالیٹکس دیتا ہے؟',
    a: 'کلینک ایڈمنز پیشنٹ فلو، شیڈولنگ ایکٹیویٹی، اور ریونیو سے متعلق ٹرینڈز مانیٹر کر سکتے ہیں تاکہ آپریشنز اور فیصلے بہتر ہوں۔',
  },
  {
    q: 'دی کیئر نیکسس فلو کیسے بہتر بناتا ہے؟',
    a: 'اپائنٹمنٹس، پریسکرپشنز، نوٹس اور ریکارڈز کو ایک سسٹم میں جوڑ کر دی کیئر نیکسس بکھری یا گم معلومات کے مسائل کو کم کرتا ہے۔',
  },
];

export function FAQsSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { language } = useLanguage();
  const isUrdu = language === 'ur';
  const faqs = isUrdu ? FAQS_UR : FAQS_EN;

  return (
    <section className='py-20 sm:py-28 bg-[#fdfdfd] border-b border-black/[0.02]'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        {/* TWO-COLUMN LARGE CARDS SECTION */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-24'>
          {/* Card 1: Smiley stats metrics */}
          <div className='bg-gradient-to-tr from-[#ffeef4] via-[#ffecd2]/80 to-[#e4f9b2]/30 rounded-3xl border border-black/[0.03] p-8 shadow-sm flex flex-col justify-between min-h-[360px] text-left'>
            <div>
              <h3 className='text-lg sm:text-xl font-black text-text-primary leading-tight'>
                {isUrdu
                  ? 'دیکھیں کہ مریض آپ کی دیکھ بھال کی درجہ بندی کیسے کرتے ہیں۔'
                  : 'See how patients rate their journey. Where are your care circles happiest?'}
              </h3>
              <p className='mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-semibold'>
                {isUrdu
                  ? 'مریضوں کی خوشی اور سروس ریٹنگز کے تفصیلی گراف اور تجزیے۔'
                  : 'Detailed feedback parameters reflecting real patient satisfaction indexes.'}
              </p>
            </div>

            {/* Visual stats dial */}
            <div className='mt-8 flex items-center justify-between bg-white/70 backdrop-blur border border-white/80 p-5 rounded-2xl gap-4'>
              <div className='flex items-center gap-3'>
                <span className='text-4xl'>😊</span>
                <div>
                  <h4 className='font-extrabold text-[#3b59ff] text-base leading-none'>
                    98%
                  </h4>
                  <span className='text-[10px] text-text-secondary font-bold uppercase tracking-wider'>
                    {isUrdu ? 'مریضوں کا اطمینان' : 'Patient Satisfaction'}
                  </span>
                </div>
              </div>
              <div className='h-8 w-px bg-black/5' />
              <div className='flex items-center gap-3'>
                <span className='text-4xl'>👍</span>
                <div>
                  <h4 className='font-extrabold text-emerald-600 text-base leading-none'>
                    95%
                  </h4>
                  <span className='text-[10px] text-text-secondary font-bold uppercase tracking-wider'>
                    {isUrdu ? 'علاج کی تعمیل' : 'Treatment Adherence'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Connected care team network */}
          <div className='bg-white rounded-3xl border border-black/5 p-8 shadow-sm flex flex-col justify-between min-h-[360px] text-left'>
            <div>
              <h3 className='text-lg sm:text-xl font-black text-text-primary leading-tight'>
                {isUrdu
                  ? 'دریافت کریں کہ آپ کی کیئر ٹیم کو کن خصوصیات کی ضرورت ہے۔'
                  : 'Discover the features your care team really needs. You will be surprised.'}
              </h3>
              <p className='mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium'>
                {isUrdu
                  ? 'ہماری ٹیم کنیکٹیویٹی گراف کے ذریعے ڈاکٹروں، نرسوں اور خاندان کو جوڑتی ہے۔'
                  : 'Connect clinicians, patient networks, and clinic operational coordinators in a single layout.'}
              </p>
            </div>

            {/* Network graphical layout */}
            <div className='mt-8 relative w-full h-[140px] bg-slate-50 border border-black/[0.02] rounded-2xl flex items-center justify-center overflow-hidden'>
              {/* Dotted lines connection illustration */}
              <svg
                className='absolute inset-0 w-full h-full text-slate-200'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <line
                  x1='30%'
                  y1='50%'
                  x2='50%'
                  y2='50%'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeDasharray='3,3'
                />
                <line
                  x1='50%'
                  y1='50%'
                  x2='70%'
                  y2='50%'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeDasharray='3,3'
                />
                <line
                  x1='50%'
                  y1='50%'
                  x2='50%'
                  y2='25%'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeDasharray='3,3'
                />
              </svg>

              {/* Central Node (Care Nexus Center) */}
              <div className='absolute z-10 h-10 w-10 bg-primary/20 border border-primary text-primary rounded-full flex items-center justify-center font-bold text-xs shadow-md'>
                Care
              </div>
              {/* Floating Node 1: Doctor (Top) */}
              <div className='absolute top-[10%] left-[45%] h-8 w-8 bg-blue-100 border border-blue-300 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-600 shadow'>
                MD
              </div>
              {/* Floating Node 2: Patient (Left) */}
              <div className='absolute top-[40%] left-[20%] h-8 w-8 bg-emerald-100 border border-emerald-300 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-600 shadow'>
                PT
              </div>
              {/* Floating Node 3: Family (Right) */}
              <div className='absolute top-[40%] right-[20%] h-8 w-8 bg-purple-100 border border-purple-300 rounded-full flex items-center justify-center text-[10px] font-bold text-purple-600 shadow'>
                FM
              </div>
            </div>
          </div>
        </div>

        {/* FAQ ACCORDION LIST */}
        <div className='max-w-[760px] mx-auto'>
          <div className='text-center mb-12'>
            <p className='text-[10px] sm:text-xs font-bold tracking-widest text-text-secondary/70 uppercase'>
              {isUrdu ? 'اکثر پوچھے جانے والے سوالات' : 'Questions & Answers'}
            </p>
            <h2 className='mt-3 font-sans text-2xl sm:text-3xl tracking-tight font-black text-text-primary'>
              {isUrdu
                ? 'صارفین کے اہم سوالات اور جوابات'
                : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className='space-y-3'>
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={item.q}
                  className='rounded-2xl bg-white border border-black/5 overflow-hidden transition-all duration-150 shadow-sm'
                >
                  <button
                    type='button'
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className='w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer hover:bg-slate-50/50 transition-colors'
                  >
                    <span className='text-[13px] sm:text-[14px] font-bold text-text-primary'>
                      {item.q}
                    </span>
                    <span className='flex-none inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-text-secondary'>
                      {isOpen ? (
                        <Minus className='h-3 w-3' strokeWidth={2.5} />
                      ) : (
                        <Plus className='h-3 w-3' strokeWidth={2.5} />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <div className='px-6 pb-5 -mt-1 text-left'>
                      <p className='text-[12px] sm:text-[13px] text-text-secondary leading-relaxed max-w-[62ch] font-medium'>
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
