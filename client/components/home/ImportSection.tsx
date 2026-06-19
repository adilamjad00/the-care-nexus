'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import {
  Play,
  Check,
  ShieldCheck,
  Heart,
  Clock,
  MessageSquare,
  Plus,
} from 'lucide-react';
import { useRef, useState } from 'react';
import Video from '@/public/vid1.mp4';

export function ImportSection() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section
      id='features'
      className='py-20 bg-blue-50/60 border-b border-black/[0.02]'
    >
      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
        {/* Section Title */}
        <div className='text-center mb-16'>
          {/* <p className="text-[10px] sm:text-xs font-bold tracking-widest text-[#3b59ff] uppercase">
            {isUrdu ? "پلیٹ فارم کی خصوصیات" : "Platform Features"}
          </p> */}
          <h2 className='mt-3 font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight font-black text-text-primary'>
            {isUrdu
              ? 'صحت کی دیکھ بھال کو مربوط کرنے کی تمام خصوصیات'
              : 'Everything you need to coordinate patient care'}
          </h2>
        </div>

        {/* 4-Card Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10'>
          {/* CARD 1: Coordinate Care 10x Faster */}
          <div className='bg-white rounded-2xl border border-black/5 p-6 sm:p-8 flex flex-col justify-between shadow-sm min-h-[380px] hover:shadow-md transition-shadow'>
            <div className='text-left mb-6'>
              <h3 className='text-base sm:text-lg font-bold text-text-primary'>
                {isUrdu
                  ? 'دیکھ بھال کو 10 گنا تیزی سے مربوط کریں'
                  : 'Coordinate care 10x faster'}
              </h3>
              <p className='mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium'>
                {isUrdu
                  ? 'مریضوں اور ڈاکٹروں کو صحت کے مسائل کی فوری اور عین نشاندہی کرنے دیں۔ یہ نظام ریئل ٹائم میں بہتر فیصلہ سازی میں مدد دیتا ہے۔'
                  : 'Let patients and healthcare providers pinpoint health concerns exactly when they happen. Improve real-time decision-making with instant, structured health data.'}
              </p>
            </div>

            {/* Illustration Mockup */}
            <div className='mt-auto relative w-full h-[210px] bg-slate-50 rounded-xl border border-black/[0.03] overflow-hidden p-3 flex gap-3'>
              {/* Left Side: Patient Mobile Mock */}
              <div className='w-[40%] bg-white rounded-lg border border-black/5 shadow-md p-2.5 flex flex-col shrink-0'>
                <div className='pb-2 border-b border-black/[0.04]'>
                  <div className='flex items-center gap-1'>
                    <div className='w-3.5 h-3.5 rounded-full bg-red-100 flex items-center justify-center'>
                      <Heart className='w-2.5 h-2.5 text-red-500' />
                    </div>
                    <span className='text-[8px] font-bold text-text-primary'>
                      {isUrdu ? 'رپورٹ' : 'Report Vitals'}
                    </span>
                  </div>

                  <p className='mt-1 text-[6px] text-text-secondary'>
                    {isUrdu
                      ? 'روزانہ صحت کی معلومات شیئر کریں'
                      : 'Track and share health updates'}
                  </p>
                </div>

                <div className='mt-2 space-y-2 flex-1'>
                  <div>
                    <div className='flex justify-between text-[6px] font-medium'>
                      <span>BP</span>
                      <span>120/80</span>
                    </div>
                    <div className='h-1 bg-green-100 rounded-full mt-1'>
                      <div className='h-full w-[80%] bg-green-500 rounded-full' />
                    </div>
                  </div>

                  <div>
                    <div className='flex justify-between text-[6px] font-medium'>
                      <span>Heart</span>
                      <span>78 bpm</span>
                    </div>
                    <div className='h-1 bg-red-100 rounded-full mt-1'>
                      <div className='h-full w-[70%] bg-red-500 rounded-full' />
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-1'>
                    <div className='rounded bg-slate-50 px-1 py-0.5 flex items-center justify-between'>
                      <span className='text-[7px] font-bold'>98%</span>
                      <span className='text-[5px] text-text-secondary'>
                        SpO₂
                      </span>
                    </div>

                    <div className='rounded bg-slate-50 px-1 py-0.5 flex items-center justify-between'>
                      <span className='text-[7px] font-bold'>36.8°</span>
                      <span className='text-[5px] text-text-secondary'>
                        Temp
                      </span>
                    </div>
                  </div>
                </div>

                <button className='mt-2 h-5 w-full bg-primary rounded text-[7px] font-bold text-white'>
                  {isUrdu ? 'بھیجیں' : 'Send Report'}
                </button>
              </div>

              {/* Right Side: Doctor Desktop Mock */}
              <div className='flex-1 bg-white rounded-lg border border-black/5 shadow-md p-3 flex flex-col overflow-hidden'>
                <div className='pb-2 border-b border-black/[0.04]'>
                  <div className='flex items-center justify-between'>
                    <span className='text-[8px] font-bold text-text-primary'>
                      {isUrdu ? 'ڈاکٹر پورٹل' : 'Doctor Portal'}
                    </span>

                    <span className='text-[7px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold'>
                      {isUrdu ? 'فوری' : 'Urgent'}
                    </span>
                  </div>

                  <p className='mt-1 text-[6px] text-text-secondary'>
                    {isUrdu
                      ? 'مریضوں کی رپورٹس اور الرٹس دیکھیں'
                      : 'Monitor reports and critical alerts'}
                  </p>
                </div>

                <div className='mt-2 grid grid-cols-4 gap-1.5'>
                  <div className='bg-slate-50 rounded p-1'>
                    <p className='text-[8px] font-bold text-primary'>24</p>
                    <p className='text-[5px] text-text-secondary'>Patients</p>
                  </div>

                  <div className='bg-slate-50 rounded p-1'>
                    <p className='text-[8px] font-bold text-green-600'>18</p>
                    <p className='text-[5px] text-text-secondary'>Reviewed</p>
                  </div>

                  <div className='bg-slate-50 rounded p-1'>
                    <p className='text-[8px] font-bold text-red-500'>3</p>
                    <p className='text-[5px] text-text-secondary'>Alerts</p>
                  </div>

                  <div className='bg-slate-50 rounded p-1'>
                    <p className='text-[8px] font-bold text-primary'>12</p>
                    <p className='text-[5px] text-text-secondary'>
                      Appointments
                    </p>
                  </div>
                </div>

                <div className='mt-3 flex-1 space-y-1'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-red-500' />
                    <div className='flex-1 h-1.5 bg-slate-100 rounded' />
                  </div>

                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 rounded-full bg-green-500' />
                    <div className='flex-1 h-1.5 bg-slate-100 rounded' />
                  </div>

                  <div className='mt-2 h-10 bg-slate-50 rounded-lg flex items-end gap-1 p-1'>
                    <div className='w-2 bg-primary/50 rounded-t h-4' />
                    <div className='w-2 bg-primary rounded-t h-7' />
                    <div className='w-2 bg-primary/70 rounded-t h-5' />
                    <div className='w-2 bg-primary rounded-t h-3' />
                    <div className='w-2 bg-primary/60 rounded-t h-6' />
                    <div className='w-2 bg-primary/70 rounded-t h-5' />
                    <div className='w-2 bg-primary rounded-t h-3' />
                    <div className='w-2 bg-primary/60 rounded-t h-6' />
                    <div className='w-2 bg-primary/70 rounded-t h-5' />
                    <div className='w-2 bg-primary rounded-t h-3' />
                    <div className='w-2 bg-primary/60 rounded-t h-6' />
                    <div className='w-2 bg-primary/70 rounded-t h-5' />
                    <div className='w-2 bg-primary rounded-t h-7' />
                    <div className='w-2 bg-primary/60 rounded-t h-6' />
                    <div className='w-2 bg-primary/70 rounded-t h-5' />
                    <div className='w-2 bg-primary rounded-t h-3' />
                    <div className='w-2 bg-primary/60 rounded-t h-6' />
                    <div className='w-2 bg-primary/70 rounded-t h-6' />
                    <div className='w-2 bg-primary rounded-t h-3' />
                    <div className='w-2 bg-primary/60 rounded-t h-6' />
                    <div className='w-2 bg-primary/60 rounded-t h-6' />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Track Health History */}
          <div className='bg-white rounded-2xl border border-black/5 p-6 sm:p-8 flex flex-col justify-between shadow-sm min-h-[380px] hover:shadow-md transition-shadow'>
            <div className='text-left mb-6'>
              <h3 className='text-base sm:text-lg font-bold text-text-primary'>
                {isUrdu
                  ? 'صحت کی ہسٹری کو بالکل ٹھیک ٹریک کریں'
                  : 'Track health history exactly'}
              </h3>
              <p className='mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium'>
                {isUrdu
                  ? 'مریض کے نقطہ نظر سے تمام طبی اپڈیٹس، ٹیسٹ اور علامات کا تسلسل دیکھیں۔ یہ مکمل ہسٹری ڈاکٹر کو بہتر تشخیص میں مدد دیتی ہے۔'
                  : 'See clinical updates, test trends, and symptom timelines through the eyes of the patient. Build a complete medical history for faster, better diagnosis.'}
              </p>
            </div>

            {/* Video Mockup */}
            {/* Video Player Mockup */}
            <div className='mt-auto relative w-full h-[210px] bg-black rounded-xl overflow-hidden shadow-inner group'>
              {/* VIDEO */}
              <video
                ref={videoRef}
                className='w-full h-full object-cover opacity-85'
                src='/vid1.mp4'
                muted
                loop
                playsInline
              />

              {/* OVERLAY */}
              {!isPlaying && (
                <div className='absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/30'>
                  <button
                    onClick={handlePlay}
                    className='h-12 w-12 rounded-full bg-[#3b59ff] hover:bg-[#2546ff] hover:scale-105 transition-all text-white flex items-center justify-center shadow-lg'
                  >
                    <Play className='h-5 w-5 fill-white ml-0.5' />
                  </button>

                  <span className='text-[10px] sm:text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm'>
                    Click to play demo
                  </span>
                </div>
              )}

              {/* PAUSE BUTTON (optional but pro UX) */}
              {isPlaying && (
                <button
                  onClick={handlePause}
                  className='absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded'
                >
                  Pause
                </button>
              )}
            </div>
          </div>

          {/* CARD 3: Manage Appointments & Tasks */}
          <div className='bg-white rounded-2xl border border-black/5 p-6 sm:p-8 flex flex-col justify-between shadow-sm min-h-[380px] hover:shadow-md transition-shadow'>
            <div className='text-left mb-6'>
              <h3 className='text-base sm:text-lg font-bold text-text-primary'>
                {isUrdu
                  ? 'اپائنٹمنٹس اور کاموں کا انتظام کریں'
                  : 'Manage appointments & tasks'}
              </h3>
              <p className='mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium'>
                {isUrdu
                  ? 'اپائنٹمنٹس، ادویات کے فالو اپس اور کیئر پلانز کو ٹریک کرنے کے لیے ایک مربوط مرکز۔ یہ ڈاکٹروں اور کیئر ٹیم کے درمیان بہتر ہم آہنگی پیدا کرتا ہے۔'
                  : 'One place to assign and track clinical tasks, appointment schedules, and daily caregiver checklists. Streamline coordination between doctors and care teams.'}
              </p>
            </div>

            {/* Task list mockup */}
            <div className='mt-auto w-full h-[210px] bg-slate-50 rounded-xl border border-black/[0.03] p-4 flex flex-col gap-3 overflow-hidden'>
              {/* Header */}
              <div className='flex items-center justify-between border-b border-black/[0.04] pb-2'>
                <span className='text-[9px] font-bold text-text-muted uppercase tracking-wider'>
                  {isUrdu ? 'آج کے کام' : 'Care Checklist'}
                </span>

                <span className='text-[8px] px-2 py-0.5 bg-bltext-[#3b59ff] font-bold rounded-full'>
                  {isUrdu ? '3 باقی ہیں' : '3 pending'}
                </span>
              </div>

              {/* Task Items */}
              <div className='space-y-2'>
                {/* Task 1 - Completed */}
                <div className='flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg shadow-xs'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounde4 border border-green-300 bg-green-50 flex items-center justify-center'>
                      <div className='w-2 h-2 bg-green-500 rounded-sm' />
                    </div>

                    <div className='flex flex-col'>
                      <span className='text-[10px] font-bold text-text-primary'>
                        {isUrdu ? 'فزیو تھراپی سیشن' : 'Physiotherapy Session'}
                      </span>
                      <span className='text-[8px] text-text-secondary'>
                        {isUrdu ? 'مکمل ہو چکا' : 'Completed'}
                      </span>
                    </div>
                  </div>

                  <span className='text-[9px] text-text-secondary'>
                    {isUrdu ? '10:00 AM' : '10:00 AM'}
                  </span>
                </div>

                {/* Task 2 - Due Now */}
                <div className='flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg shadow-xs'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded border border-red-300 bg-red-50 flex items-center justify-center'>
                      <div className='w-2 h-2 bg-red-500 rounded-sm animate-pulse' />
                    </div>

                    <div className='flex flex-col'>
                      <span className='text-[10px] font-bold text-text-primary'>
                        {isUrdu ? 'ادویات کا ری فل' : 'Prescription Refill'}
                      </span>
                      <span className='text-[8px] text-red-500 font-semibold'>
                        {isUrdu ? 'فوری توجہ درکار' : 'Requires attention'}
                      </span>
                    </div>
                  </div>

                  <span className='text-[9px] text-[#3b59ff] font-semibold'>
                    {isUrdu ? 'ابھی' : 'Now'}
                  </span>
                </div>

                {/* Task 3 - Upcoming */}
                <div className='flex items-center justify-between bg-yellow-50 px-3 py-2 rounded-lg shadow-xs'>
                  <div className='flex items-center gap-2'>
                    <div className='h-4 w-4 rounded border border-slate-300 bg-slate-50 flex items-center justify-center'>
                      <div className='w-2 h-2 bg-slate-400 rounded-sm' />
                    </div>

                    <div className='flex flex-col'>
                      <span className='text-[10px] font-bold text-text-primary'>
                        {isUrdu ? 'ڈاکٹر فالو اپ' : 'Doctor Follow-up'}
                      </span>
                      <span className='text-[8px] text-text-secondary'>
                        {isUrdu ? 'شیڈول شدہ' : 'Scheduled'}
                      </span>
                    </div>
                  </div>

                  <span className='text-[9px] text-text-secondary'>
                    {isUrdu ? 'کل' : 'Tomorrow'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-2xl border border-black/5 p-6 sm:p-8 flex flex-col justify-between shadow-sm min-h-[380px] hover:shadow-md transition-shadow'>
            <div className='text-left mb-6'>
              <h3 className='text-base sm:text-lg font-bold text-text-primary'>
                {isUrdu
                  ? 'اپائنٹمنٹس اور کاموں کا انتظام کریں'
                  : 'Manage appointments & tasks'}
              </h3>
              <p className='mt-2 text-xs sm:text-sm text-text-secondary leading-relaxed font-medium'>
                {isUrdu
                  ? 'محفوظ، لائیو چیٹ اور اپڈیٹس کے ذریعے مریضوں کے ساتھ پائیدار تعلقات اور اعتماد بنائیں۔ ہر پیغام ریکارڈ اور ٹریک کیا جاتا ہے۔'
                  : 'Build trust and long-term relationships with patients through secure live updates and direct messaging. Every conversation is recorded and trackable.'}
              </p>
            </div>

            {/* Live communication system mockup */}
            <div className='mt-auto w-full h-[210px] bg-slate-50 rounded-xl border border-black/[0.03] p-3 flex flex-col overflow-hidden'>
              {/* Top Status Bar */}
              <div className='flex items-center justify-between pb-2 border-b border-black/[0.04] mb-2'>
                <div className='flex flex-col'>
                  <span className='text-[9px] font-bold text-text-primary'>
                    {isUrdu ? 'مریض کمیونیکیشن' : 'Patient Communication Hub'}
                  </span>
                  <span className='text-[7px] text-text-muted'>
                    {isUrdu ? 'آخری اپڈیٹ: ابھی' : 'Last update: just now'}
                  </span>
                </div>

                <div className='flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full text-[7px] font-bold'>
                  ● {isUrdu ? 'لائیو' : 'LIVE'}
                </div>
              </div>

              {/* Conversation (structured medical style) */}
              <div className='space-y-2 flex-1 overflow-hidden'>
                {/* Doctor */}
                <div className='flex items-start gap-2'>
                  <div className='w-5 h-5 rounded-full bg-red-100 flex items-center justify-center text-[7px] font-bold text-red-500 shrink-0'>
                    D
                  </div>

                  <div className='bg-white px-2.5 py-1.5 rounded-lg border border-black/5 shadow-sm max-w-[80%]'>
                    <p className='text-[9px] text-text-primary leading-snug font-medium'>
                      {isUrdu
                        ? 'مریض کی صبح کی رپورٹ نارمل ہے، دوا جاری رکھیں۔'
                        : 'Patient morning vitals are stable. Continue current medication.'}
                    </p>
                    <span className='text-[7px] text-text-muted block text-right mt-1'>
                      10:15 AM • Doctor
                    </span>
                  </div>
                </div>

                {/* System Alert */}
                <div className='flex items-start gap-2'>
                  <div className='w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center text-[7px] font-bold text-yellow-600 shrink-0'>
                    !
                  </div>

                  <div className='bg-yellow-50 px-2.5 py-1.5 rounded-lg border border-yellow-100 max-w-[80%]'>
                    <p className='text-[9px] text-yellow-700 leading-snug font-medium'>
                      {isUrdu
                        ? 'یاد دہانی: اگلا فالو اپ 24 گھنٹے میں ہے۔'
                        : 'Reminder: Next follow-up scheduled in 24 hours.'}
                    </p>
                    <span className='text-[7px] text-yellow-600 block text-right mt-1'>
                      System
                    </span>
                  </div>
                </div>

                {/* Patient */}
                <div className='flex items-start gap-2 justify-end'>
                  <div className='bg-[#3b59ff] text-white px-2.5 py-1.5 rounded-lg max-w-[80%]'>
                    <p className='text-[9px] leading-snug font-medium'>
                      {isUrdu
                        ? 'میں بہتر محسوس کر رہا ہوں، شکریہ ڈاکٹر۔'
                        : 'I’m feeling much better today, thank you doctor.'}
                    </p>
                    <span className='text-[7px] text-white/70 block text-right mt-1'>
                      10:18 AM • Patient
                    </span>
                  </div>

                  <div className='w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[7px] font-bold text-primary shrink-0'>
                    P
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
