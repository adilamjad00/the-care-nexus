'use client';

import { useLanguage } from '@/providers/LanguageProvider';
import {
  Heart,
  MessageSquare,
  Sparkles,
  Shield,
  User,
  FileText,
  CheckCircle2,
  ChevronRight,
  Calendar,
  AlertCircle,
} from 'lucide-react';

export function ResultsSection() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const features = [
    {
      icon: Heart,
      title: isUrdu
        ? 'ریئل ٹائم میں علامات ٹریک کریں'
        : 'Track vitals in real-time',
      desc: isUrdu
        ? 'مریضوں کی صحت کی رپورٹس اور علامات سیکنڈوں میں موصول کریں۔'
        : 'Receive patient health reports and vitals indicators in seconds.',
      color: 'text-red-400 bg-red-500/10',
    },
    {
      icon: MessageSquare,
      title: isUrdu ? 'محفوظ پیغام رسانی' : 'Secure messaging',
      desc: isUrdu
        ? 'ڈاکٹروں اور خاندان کے افراد کے درمیان انکرپٹڈ رابطہ۔'
        : 'Encrypted messaging between doctors, patients, and family care circles.',
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      icon: Sparkles,
      title: isUrdu ? 'بہتر طبی نتائج' : 'Improve patient outcomes',
      desc: isUrdu
        ? 'فالو اپ یاددہانیوں کے ذریعے علاج کے اثر کو بہتر بنائیں۔'
        : 'Optimize treatment adherence through automated notifications and alerts.',
      color: 'text-amber-400 bg-amber-500/10',
    },
    {
      icon: Shield,
      title: isUrdu ? 'انتظامی بوجھ میں کمی' : 'Reduce administrative burden',
      desc: isUrdu
        ? 'خودکار ریکارڈز اور فائلنگ کے ذریعے وقت اور اخراجات بچائیں۔'
        : 'Save clinic time and administrative overhead with automated record filing.',
      color: 'text-emerald-400 bg-emerald-500/10',
    },
  ];

  return (
    <section className='py-16 sm:py-24 bg-[#09101d] text-white relative overflow-hidden'>
      {/* Decorative gradient glowing mesh */}
      <div className='absolute top-0 left-0 w-full h-full pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-[#09101d]/0 to-[#09101d]/0' />

      <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 flex flex-col items-center'>
        {/* Section Header */}
        <div className='text-center max-w-3xl mb-16'>
          <h2 className='font-sans text-2xl sm:text-3xl md:text-4xl tracking-tight font-black text-white'>
            {isUrdu
              ? 'دیکھ بھال کا انتظام، ٹریک اور کوآرڈینیشن سب ایک ہی جگہ'
              : 'Manage, track and coordinate care all in one place'}
          </h2>
          <p className='mt-4 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto font-medium'>
            {isUrdu
              ? 'ایک مربوط ڈیش بورڈ کے ذریعے اپنے مریضوں کی صحت اور کلینک کے کاموں کی نگرانی کریں۔'
              : 'Monitor patient health parameters, medical timelines, and clinical operations through a unified dashboard.'}
          </p>
        </div>

        {/* Browser Mockup */}
        <div className='w-full max-w-[960px] bg-slate-900/60 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col mb-16'>
          {/* Browser Header Tab Bar */}
          <div className='flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800'>
            <div className='flex items-center gap-1.5'>
              <span className='h-2.5 w-2.5 rounded-full bg-red-500/60' />
              <span className='h-2.5 w-2.5 rounded-full bg-yellow-500/60' />
              <span className='h-2.5 w-2.5 rounded-full bg-green-500/60' />
            </div>
            <div className='flex items-center gap-4 text-[10px] sm:text-xs font-bold text-slate-400'>
              <span className='text-white border-b border-primary pb-1'>
                {isUrdu ? 'فیڈ بیک' : 'Feedbacks'}
              </span>
              <span>{isUrdu ? 'مریض' : 'Patients'}</span>
              <span>{isUrdu ? 'شیڈول' : 'Schedules'}</span>
              <span>{isUrdu ? 'ٹاسک' : 'Tasks'}</span>
            </div>
            <div className='w-12' /> {/* spacer */}
          </div>

          {/* Dashboard 3-Column Layout */}
          <div className='grid grid-cols-1 md:grid-cols-12 min-h-[360px] text-left text-slate-300 text-[11px] sm:text-xs'>
            {/* Column 1: Feedback Feed (span 3) */}
            <div className='md:col-span-3 border-r border-slate-800 p-4 flex flex-col gap-3'>
              <span className='font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-1'>
                {isUrdu ? 'مریض اپڈیٹس' : 'Patient Updates'}
              </span>
              <div className='space-y-2'>
                <div className='bg-slate-800/40 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1'>
                  <div className='flex justify-between font-bold text-white'>
                    <span>{isUrdu ? 'احمد علی' : 'Ahmed Ali'}</span>
                    <span className='text-red-400'>
                      {isUrdu ? 'ہائی بی پی' : 'High BP'}
                    </span>
                  </div>
                  <span className='text-[10px] text-slate-400'>
                    3 {isUrdu ? 'منٹ پہلے' : 'mins ago'}
                  </span>
                </div>

                <div className='bg-slate-800/20 p-2.5 rounded-lg border border-slate-800/50 flex flex-col gap-1'>
                  <div className='flex justify-between font-bold text-white'>
                    <span>{isUrdu ? 'ڈاکٹر جوہن' : 'Dr. John'}</span>
                    <span className='text-yellow-400'>
                      {isUrdu ? 'نیا ٹیسٹ' : 'New Report'}
                    </span>
                  </div>
                  <span className='text-[10px] text-slate-400'>
                    20 {isUrdu ? 'منٹ پہلے' : 'mins ago'}
                  </span>
                </div>

                <div className='bg-slate-800/20 p-2.5 rounded-lg border border-slate-800/50 flex flex-col gap-1'>
                  <div className='flex justify-between font-bold text-white'>
                    <span>{isUrdu ? 'ڈاکٹر سارہ' : 'Dr. Sarah'}</span>
                    <span className='text-blue-400'>
                      {isUrdu ? 'ری فل' : 'Refill'}
                    </span>
                  </div>
                  <span className='text-[10px] text-slate-400'>
                    12 {isUrdu ? 'منٹ پہلے' : 'mins ago'}
                  </span>
                </div>

                <div className='bg-slate-800/20 p-2.5 rounded-lg border border-slate-800/50 flex flex-col gap-1'>
                  <div className='flex justify-between font-bold text-white'>
                    <span>{isUrdu ? 'ڈاکٹر سارہ' : 'Dr. Robert'}</span>
                    <span className='text-green-400'>
                      {isUrdu ? 'کمیٹیڈ' : 'Completed'}
                    </span>
                  </div>
                  <span className='text-[10px] text-slate-400'>
                    23 {isUrdu ? 'منٹ پہلے' : 'mins ago'}
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Timeline & Care plan (span 6) */}
            <div className='md:col-span-6 border-r border-slate-800 p-4 flex flex-col justify-between gap-4'>
              <div>
                <span className='font-bold text-slate-400 uppercase tracking-wider text-[9px] block mb-5'>
                  {isUrdu
                    ? 'علاج کی تفصیلات اور ٹائم لائن'
                    : 'Care Timeline & Details'}
                </span>

                <div className='space-y-5'>
                  <div className='flex gap-3'>
                    <div className='h-6 w-6 rounded-full bg-[#3b59ff]/20 flex items-center justify-center shrink-0 text-[#3b59ff]'>
                      <FileText className='h-3 w-3' />
                    </div>
                    <div>
                      <h4 className='font-bold text-white'>
                        {isUrdu
                          ? 'نئی دوا کی تجویز تیار'
                          : 'New prescription prepared'}
                      </h4>
                      <p className='text-[10px] text-slate-400 mt-0.5'>
                        {isUrdu
                          ? 'ڈاکٹر کی ہدایت کے مطابق مریض کے لیے ادویات اپڈیٹ کر دی گئی ہیں۔'
                          : 'Medication plan updated based on doctor’s latest clinical notes.'}
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400'>
                      <CheckCircle2 className='h-3 w-3' />
                    </div>
                    <div>
                      <h4 className='font-bold text-white'>
                        {isUrdu ? 'کلینک وزٹ مکمل' : 'Clinic visit completed'}
                      </h4>
                      <p className='text-[10px] text-slate-400 mt-0.5'>
                        {isUrdu
                          ? 'مریض کا معائنہ مکمل ہوا اور رپورٹس اپڈیٹ کر دی گئیں۔'
                          : 'Patient examination completed and reports updated in system.'}
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='h-6 w-6 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 text-yellow-400'>
                      <AlertCircle className='h-3 w-3' />
                    </div>
                    <div>
                      <h4 className='font-bold text-white'>
                        {isUrdu ? 'لیب رپورٹ زیرِ التوا' : 'Lab report pending'}
                      </h4>
                      <p className='text-[10px] text-slate-400 mt-0.5'>
                        {isUrdu
                          ? 'خون کے ٹیسٹ کی رپورٹ ابھی موصول نہیں ہوئی۔'
                          : 'Blood test results are still awaiting confirmation.'}
                      </p>
                    </div>
                  </div>

                  <div className='flex gap-3'>
                    <div className='h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 text-blue-400'>
                      <Calendar className='h-3 w-3' />
                    </div>
                    <div>
                      <h4 className='font-bold text-white'>
                        {isUrdu
                          ? 'فالو اپ اپائنٹمنٹ طے'
                          : 'Follow-up scheduled'}
                      </h4>
                      <p className='text-[10px] text-slate-400 mt-0.5'>
                        {isUrdu
                          ? 'اگلا معائنہ اگلے ہفتے منگل کے دن مقرر کیا گیا ہے۔'
                          : 'Next review scheduled for Tuesday next week.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat action footer bar inside dashboard */}
              <div className='bg-slate-950/50 p-2 rounded-lg flex items-center justify-between border border-slate-800'>
                <span className='text-slate-400 text-[10px]'>
                  {isUrdu
                    ? 'کیئر سرکل کے لیے پیغام ٹائپ کریں...'
                    : 'Message care circle members...'}
                </span>
                <span className='h-6 px-3 bg-primary hover:bg-primary-hover text-white rounded text-[10px] font-bold flex items-center justify-center cursor-pointer'>
                  {isUrdu ? 'بھیجیں' : 'Send'}
                </span>
              </div>
            </div>

            {/* Column 3: Care Team panel (span 3) */}
            <div className='md:col-span-3 p-4 flex flex-col gap-3'>
              <span className='font-bold text-slate-400 uppercase tracking-wider text-[9px] mb-3'>
                {isUrdu ? 'فعال کیئر ٹیم' : 'Active Care Team'}
              </span>
              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center'>
                    <User className='h-3.5 w-3.5' />
                  </div>
                  <div>
                    <h5 className='font-bold text-white'>
                      {isUrdu ? 'ڈاکٹر سارہ' : 'Dr. Sarah Adams'}
                    </h5>
                    <p className='text-[9px] text-slate-400'>
                      {isUrdu ? 'پرائمری فزیشن' : 'Lead Doctor'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center'>
                    <User className='h-3.5 w-3.5' />
                  </div>
                  <div>
                    <h5 className='font-bold text-white'>
                      {isUrdu ? 'نرس ہاجرہ' : 'Nurse Hajra'}
                    </h5>
                    <p className='text-[9px] text-slate-400'>
                      {isUrdu ? 'کیئر ورکر' : 'Clinician'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center'>
                    <User className='h-3.5 w-3.5' />
                  </div>
                  <div>
                    <h5 className='font-bold text-white'>
                      {isUrdu ? 'ڈاکٹر علی رضا' : 'Dr. Ali Raza'}
                    </h5>
                    <p className='text-[9px] text-slate-400'>
                      {isUrdu ? 'کارڈیالوجسٹ' : 'Cardiologist'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center'>
                    <User className='h-3.5 w-3.5' />
                  </div>
                  <div>
                    <h5 className='font-bold text-white'>
                      {isUrdu ? 'فاطمہ خان' : 'Fatima Khan'}
                    </h5>
                    <p className='text-[9px] text-slate-400'>
                      {isUrdu ? 'میڈیکل اسسٹنٹ' : 'Medical Assistant'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Columns below */}
        <div className='grid mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mx-auto'>
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className='flex flex-col items-center sm:items-start text-center sm:text-left '
              >
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center mb-4 ${item.color}`}
                >
                  <Icon className='h-5 w-5' />
                </div>
                <h3 className='font-sans text-sm font-bold text-white mb-2'>
                  {item.title}
                </h3>
                <p className='text-xs text-slate-400 leading-relaxed font-medium'>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
