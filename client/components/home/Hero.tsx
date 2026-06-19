'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  Calendar,
  Heart,
  ArrowRight,
  Activity,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  return (
    <section className='relative pt-20 pb-24 md:pb-32 px-6 sm:px-8 lg:px-10 overflow-hidden flex flex-col items-center'>
      {/* Background radial gradient glow (soft arches) */}
      {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute bottom-[-150px] left-1/2 -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[70%] aspect-square rounded-full bg-gradient-to-t from-[#ff8ebb]/25 via-[#ffd6bd]/15 to-[#ffffff]/0 blur-3xl" />
      </div> */}

      {/* Background decorative layer */}
      <div className='absolute inset-0 -z-10 pointer-events-none overflow-hidden'>
        {/* Main soft AI glow */}
        <div className='absolute top-[85px] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-b from-[#3b59ff]/30 via-[#7c3aed]/10 to-transparent blur-3xl' />

        <div className='absolute bottom-[-260px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-t from-[#ff8ebb]/25 via-[#ffd6bd]/10 to-transparent blur-3xl' />

        {/* NETWORK NODES (this is the key change) */}
        <svg className='absolute inset-0 w-full h-full opacity-[0.12]'>
          {/* connections */}
          <line
            x1='20%'
            y1='30%'
            x2='50%'
            y2='45%'
            stroke='#3b59ff'
            strokeWidth='1'
          />
          <line
            x1='80%'
            y1='25%'
            x2='50%'
            y2='45%'
            stroke='#a855f7'
            strokeWidth='1'
          />
          <line
            x1='30%'
            y1='70%'
            x2='50%'
            y2='45%'
            stroke='#22c55e'
            strokeWidth='1'
          />
          <line
            x1='70%'
            y1='75%'
            x2='50%'
            y2='45%'
            stroke='#f59e0b'
            strokeWidth='1'
          />

          {/* nodes */}
          <circle cx='20%' cy='30%' r='5' fill='#3b59ff' />
          <circle cx='80%' cy='25%' r='5' fill='#a855f7' />
          <circle cx='30%' cy='70%' r='5' fill='#22c55e' />
          <circle cx='70%' cy='75%' r='5' fill='#f59e0b' />
          <circle cx='50%' cy='45%' r='7' fill='#ffffff' />
        </svg>

        {/* FLOATING DATA CARDS (adds real SaaS feel) */}
        {/* BIG FLOATING EMOJI BACKGROUND */}
        <div className='absolute inset-0 -z-10 pointer-events-none overflow-hidden'>
          {/* soft glow base */}
          <div className='absolute top-[110px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-[#5f7bff]/20 via-[#7a7dff]/10 to-transparent blur-3xl' />
          <div className='absolute bottom-[-250px] left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-t from-[#ff8ebb]/20 via-[#ffd6bd]/10 to-transparent blur-3xl' />

          {/* LEFT SIDE EMOJIS */}
          <div className='absolute left-[5%] top-[10%] text-4xl opacity-70'>
            💊
          </div>
          <div className='absolute left-[12%] top-[25%] text-3xl opacity-60'>
            🩺
          </div>
          <div className='absolute left-[6%] top-[45%] text-5xl opacity-50'>
            📊
          </div>
          {/* <div className="absolute left-[10%] top-[65%] text-3xl opacity-60">🧬</div> */}
          <div className='absolute left-[4%] top-[80%] text-4xl opacity-50'>
            ⚕️
          </div>

          {/* RIGHT SIDE EMOJIS */}
          <div className='absolute right-[6%] top-[12%] text-4xl opacity-70'>
            📅
          </div>
          {/* <div className="absolute right-[10%] top-[28%] text-3xl opacity-60">💬</div> */}
          <div className='absolute right-[6%] top-[48%] text-5xl opacity-50'>
            📡
          </div>
          <div className='absolute right-[12%] top-[68%] text-3xl opacity-60'>
            🧠
          </div>
          {/* <div className="absolute right-[48%] top-[2%] text-4xl opacity-50">⚡</div> */}

          {/* CENTER FLOATING CORE */}
          <div className='absolute left-[85%] top-[30%] -translate-x-1/2 text-6xl opacity-40'>
            ❤️‍🩹
          </div>
          <div className='absolute left-1/2 top-[60%] -translate-x-1/2 text-4xl opacity-40'>
            🏥
          </div>

          {/* EXTRA SCATTER LAYER (gives “alive” feel) */}
          <div className='absolute inset-0'>
            <div className='absolute top-[20%] left-[35%] text-2xl opacity-40'>
              💉
            </div>
            <div className='absolute top-[30%] left-[60%] text-3xl opacity-40'>
              🫀
            </div>
            <div className='absolute top-[55%] left-[45%] text-2xl opacity-40'>
              🧪
            </div>
            <div className='absolute top-[70%] left-[55%] text-3xl opacity-40'>
              🧠
            </div>
            <div className='absolute top-[40%] left-[65%] text-2xl opacity-30'>
              ⚡
            </div>
          </div>

          {/* subtle grid for depth */}
          <div className='absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] [background-size:22px_22px]' />
        </div>

        {/* subtle grid */}
        <div className='absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] [background-size:20px_20px]' />
      </div>

      {/* Top Stars Rating */}
      <div className='inline-flex items-center gap-1.5 rounded-full bg-blue-50/60 px-3.5 py-1.5 border border-blue-100 text-[10px] sm:text-xs font-semibold text-blue-600 shadow-sm animate-in fade-in duration-300'>
        <span className='text-blue-500'>★★★★★</span>
        <span>
          {isUrdu
            ? 'معروف ہیلتھ نیٹ ورکس کا بھروسہ'
            : 'Trusted by leading healthcare networks'}
        </span>
      </div>

      {/* Main Copy */}
      <div className='text-center mt-6 max-w-4xl'>
        <h1 className='font-sans text-[36px] sm:text-[48px] md:text-[60px] leading-[1.08] tracking-tight font-black text-text-primary'>
          {isUrdu ? (
            <>
              آواز سے چلنے والا AI پر مبنی
              <br />
              جدید ہیلتھ کیئر مینجمنٹ پلیٹ فارم
            </>
          ) : (
            <>
              AI-Powered Voice-Enabled
              <br />
              Healthcare Management Platform
            </>
          )}
        </h1>

        <p className='mt-6 text-sm sm:text-base text-text-secondary max-w-xl mx-auto leading-relaxed font-medium'>
          {isUrdu
            ? 'دی کیئر نیکسس مریضوں، ڈاکٹروں اور طبی ورک فلوز کو جوڑتا ہے۔ 14 دن کے لیے مفت آزمائیں، کسی کریڈٹ کارڈ کی ضرورت نہیں ہے۔'
            : 'The Care Nexus connects patients, healthcare providers, and medical workflows. Try free for 14 days, no credit card required.'}
        </p>
      </div>

      {/* Hero CTAs */}
      <div className='mt-8 flex flex-col items-center gap-2.5'>
        <Link href='/register'>
          <Button
            size='lg'
            className='px-8 font-extrabold bg-[#2944FF] hover:bg-[#2546ff] text-white rounded-full text-sm shadow-lg hover:shadow-xl transition-all'
          >
            {isUrdu
              ? 'کیئر نیکسس 14 دن کے لیے مفت آزمائیں'
              : 'Try Care Nexus free for 14 days'}
          </Button>
        </Link>
        <span className='text-[13px] font-bold text-text-muted'>
          {isUrdu ? 'کسی کریڈٹ کارڈ کی ضرورت نہیں' : 'No credit card required'}
        </span>
      </div>

      {/* Replicated Showcase Mockup Area */}
      <div className='relative mt-20 w-full max-w-[800px] aspect-[16/10] sm:aspect-[16/9] flex items-center justify-center'>
        {/* Soft Background Arch container decoration */}
        <div className='absolute inset-0  rounded-[32px] border border-black/[0.02] -z-10' />

        {/* Central Dashboard Update Mockup Card */}
        <div className='relative w-[85%] sm:w-[75%] bg-white rounded-2xl border border-black/5 shadow-2xl p-5 sm:p-6 animate-scale-in duration-300'>
          {/* Mockup Card Header */}
          <div className='flex items-center justify-between pb-4 border-b border-black/[0.04] mb-4'>
            <div className='flex items-center gap-2'>
              <div className='h-7 w-7 rounded-lg bg-[#5d3cff]/10 flex items-center justify-center'>
                <Heart className='h-4 w-4 text-[#5d3cff]' />
              </div>
              <span className='font-sans text-xs sm:text-sm font-bold text-text-primary'>
                {isUrdu ? 'طبی اپڈیٹس اور کیئر سرکل' : 'Care Circle Updates'}
              </span>
            </div>
            <div className='h-1.5 w-1.5 rounded-full bg-[#5d3cff]' />
          </div>

          {/* Mockup List Items */}
          <div className='space-y-6'>
            {/* Item 1 */}
            <div className='flex items-start gap-3 text-left'>
              <div className='mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0'>
                <span className='text-[9px] sm:text-[10px] font-bold text-emerald-600'>
                  ✓
                </span>
              </div>
              <div>
                <h4 className='text-[10px] sm:text-xs font-bold text-text-primary leading-tight'>
                  {isUrdu ? 'تھراپسٹ سیشن اپ ڈیٹ' : 'Therapist Session'}
                </h4>
                <p className='text-[9px] sm:text-[10px] text-text-secondary leading-snug'>
                  {isUrdu
                    ? 'ڈاکٹر سارہ ایڈمز نے مریض کے بحالی کے سنگ میل اپ ڈیٹ کیے۔'
                    : 'Dr. Sarah Adams updated rehabilitation milestones for patient.'}
                </p>
              </div>
            </div>

            {/* Item 2 */}
            <div className='flex items-start gap-3 text-left'>
              <div className='mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0'>
                <span className='text-[9px] sm:text-[10px] font-bold text-blue-600'>
                  i
                </span>
              </div>
              <div>
                <h4 className='text-[10px] sm:text-xs font-bold text-text-primary leading-tight'>
                  {isUrdu
                    ? 'فزیوتھراپی اپائنٹمنٹ'
                    : 'Physiotherapy Appointment'}
                </h4>
                <p className='text-[9px] sm:text-[10px] text-text-secondary leading-snug'>
                  {isUrdu
                    ? 'بدھ کو صبح 10:00 بجے کلینکل لیب ون میں شیڈول کیا گیا ہے۔'
                    : 'Scheduled for Wednesday at 10:00 AM in Clinical Lab 1.'}
                </p>
              </div>
            </div>

            {/* Item 3 */}
            <div className='flex items-start gap-3 text-left'>
              <div className='mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0'>
                <Activity className='h-2.5 w-2.5 sm:h-3 sm:w-3 text-purple-600' />
              </div>
              <div>
                <h4 className='text-[10px] sm:text-xs font-bold text-text-primary leading-tight'>
                  {isUrdu ? 'فزیولوجی لیب رپورٹ' : 'Physiology Lab Report'}
                </h4>
                <p className='text-[9px] sm:text-[10px] text-text-secondary leading-snug'>
                  {isUrdu
                    ? 'ڈاکٹر جیمز لی نے خون کے ٹیسٹ کے نتائج اپ لوڈ کر دیے۔'
                    : 'Dr. James Lee uploaded the blood analysis panel results.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Avatars & Badges (Positioned around the card to recreate the composition) */}

        {/* Floating Badge 1: Top Left */}
        <div className='absolute left-[3%] top-[3%] sm:left-[6%] sm:top-[17%] bg-white/90 backdrop-blur-sm border border-black/5 px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 transform -rotate-6 scale-90 sm:scale-100'>
          <img
            src='/placeholder.jpg'
            alt='Doctor'
            className='w-5 h-5 rounded-full object-cover'
          />
          <div className='text-[8px] sm:text-[9px] font-bold text-text-primary leading-none text-left'>
            <span>{isUrdu ? 'تفویض کردہ:' : 'Assigned:'}</span>
            <p className='text-primary mt-0.5'>
              {isUrdu ? 'ڈاکٹر سارہ ایڈمز' : 'Dr. Sarah Adams'}
            </p>
          </div>
        </div>

        {/* Floating Badge 2: Right Middle */}
        <div className='absolute right-[0%] top-[35%] sm:right-[8%] sm:top-[45%] bg-white/90 backdrop-blur-sm border border-black/5 px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 transform rotate-6 scale-90 sm:scale-100'>
          <div className='h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0'>
            <span className='text-[9px] font-bold text-emerald-600'>✓</span>
          </div>
          <div className='text-[8px] sm:text-[9px] font-bold text-text-primary leading-none text-left'>
            <span>{isUrdu ? 'کیئر سرکل' : 'Care Status:'}</span>
            <p className='text-emerald-600 mt-0.5'>
              {isUrdu ? 'فیملی اپ ڈیٹ' : 'Family Updated'}
            </p>
          </div>
        </div>

        {/* Floating Comment Bubble: Bottom Left */}
        <div className='absolute left-[2%] bottom-[-5%] sm:left-[8%] sm:bottom-[10%] bg-white/95 backdrop-blur-sm border border-black/5 px-3 py-2 rounded-2xl shadow-xl max-w-[140px] sm:max-w-[180px] transform -rotate-3 text-left scale-85 sm:scale-100'>
          <div className='flex items-center gap-1.5 mb-1'>
            <img
              src='/placeholder.jpg'
              alt='Doctor'
              className='w-4 h-4 rounded-full object-cover'
            />
            <span className='text-[8px] font-bold text-text-primary'>
              {isUrdu ? 'ڈاکٹر جیمز' : 'Dr. James'}
            </span>
          </div>
          <p className='text-[8px] sm:text-[9px] text-text-secondary leading-snug font-medium'>
            {isUrdu
              ? 'ٹیسٹ کے نتائج نارمل ہیں۔ احتیاطی تدابیر جاری رکھیں۔'
              : 'Labs look stable. Continue current dosage.'}
          </p>
        </div>

        {/* Curved Dotted Arrow and Annotation (Top Right) */}
        <div className='hidden sm:block absolute right-[2%] top-[5%] max-w-[180px] text-left'>
          <svg
            className='w-16 h-12 text-[#3b59ff] transform -scale-x-100 rotate-12'
            fill='none'
            viewBox='0 0 60 40'
          >
            <path
              d='M10,10 Q30,5 50,30'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeDasharray='3,3'
            />
            <polygon points='50,30 48,22 42,26' fill='currentColor' />
          </svg>
          <p className='font-serif italic font-light tracking-wide text-xs text-[#3b59ff] leading-relaxed mt-1'>
            {isUrdu
              ? 'خاندان اور ڈاکٹروں کے ساتھ حقیقی وقت میں طبی ہسٹری شیئر کریں۔'
              : 'Collaborate and share medical history with family and care circle in real-time.'}
          </p>
        </div>
      </div>
    </section>
  );
}
