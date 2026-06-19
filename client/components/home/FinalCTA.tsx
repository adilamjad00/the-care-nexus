'use client';

import { useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Button } from '@/components/ui/Button';
import { Heart, Send, Calendar, FileText, HelpCircle } from 'lucide-react';

export function FinalCTA() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  // State to support interactive theme preview switching!
  const [selectedColor, setSelectedColor] = useState('#3b59ff');

  const colors = [
    { value: '#3b59ff', name: 'Blue' },
    { value: '#f97316', name: 'Orange' },
    { value: '#10b981', name: 'Green' },
    { value: '#8b5cf6', name: 'Purple' },
    { value: '#ec4899', name: 'Pink' },
  ];

  return (
    <section className='py-20 bg-[#09101d] border-b border-black/[0.02]'>
      <div className='mx-auto max-w-6xl px-6 sm:px-8 lg:px-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-20 items-center'>
          {/* LEFT SIDE: INTELLIGENT CONTROL PANEL */}
          <div className='text-left flex flex-col gap-6'>
            <div>
              <p className='text-[10px] sm:text-xs font-bold tracking-widest text-white uppercase mb-2'>
                {isUrdu
                  ? 'سمارٹ کیئر کنٹرول سسٹم'
                  : 'Smart Care Control System'}
              </p>

              <h2 className='font-sans text-2xl sm:text-3xl font-black text-white leading-tight'>
                {isUrdu
                  ? 'اپنے مریضوں، ڈاکٹروں اور کیئر ورک فلو کو ایک جگہ سے کنٹرول کریں۔'
                  : 'Control patients, doctors, and care workflows from one intelligent system.'}
              </h2>

              <p className='mt-3 text-xs sm:text-sm text-white/80 leading-relaxed font-medium'>
                {isUrdu
                  ? 'ریئل ٹائم ڈیٹا، اپائنٹمنٹس، اور کلینیکل ایکٹیویٹی کو خودکار طریقے سے منظم کریں۔ یہ ایک مکمل ہیلتھ کمانڈ سینٹر ہے۔'
                  : 'Manage real-time patient data, appointments, and clinical activity automatically. A complete healthcare command center.'}
              </p>
            </div>

            {/* SYSTEM STATUS (instead of color picker) */}
            <div>
              <span className='text-[11px] font-bold text-white uppercase tracking-wider block mb-3'>
                {isUrdu ? 'سسٹم اسٹیٹس' : 'System Status'}
              </span>

              <div className='space-y-2'>
                <div className='flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2'>
                  <span className='text-[10px] text-white/80 font-medium'>
                    {isUrdu ? 'لائیو مریض مانیٹرنگ' : 'Live Patient Monitoring'}
                  </span>
                  <span className='text-[9px] text-emerald-400 font-bold'>
                    ACTIVE
                  </span>
                </div>

                <div className='flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2'>
                  <span className='text-[10px] text-white/80 font-medium'>
                    {isUrdu ? 'کلینیکل الرٹس' : 'Clinical Alerts'}
                  </span>
                  <span className='text-[9px] text-yellow-400 font-bold'>
                    3 NEW
                  </span>
                </div>

                <div className='flex items-center justify-between bg-white/5 border border-white/10 rounded-lg px-3 py-2'>
                  <span className='text-[10px] text-white/80 font-medium'>
                    {isUrdu ? 'اپائنٹمنٹ سسٹم' : 'Appointment System'}
                  </span>
                  <span className='text-[9px] text-emerald-400 font-bold'>
                    SYNCED
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Button
                size='default'
                className='px-6 font-extrabold bg-[#081c44] hover:bg-black text-white text-xs rounded-xl shadow-md transition-all'
              >
                {isUrdu ? 'سسٹم ڈیش بورڈ کھولیں' : 'Open Command Dashboard'}
              </Button>
            </div>
          </div>
          {/* CONTENT */}
          <div className='p-6 bg-slate-50 flex flex-col gap-4 rounded-2xl'>
            {/* KPI ROW */}
            <div className='grid grid-cols-3 gap-3'>
              <div className='bg-white border border-black/5 rounded-xl p-3 text-center shadow-sm'>
                <p className='text-sm font-black text-[#081c44]'>24</p>
                <p className='text-[8px] text-text-secondary'>Patients</p>
              </div>

              <div className='bg-white border border-black/5 rounded-xl p-3 text-center shadow-sm'>
                <p className='text-sm font-black text-emerald-500'>18</p>
                <p className='text-[8px] text-text-secondary'>Stable</p>
              </div>

              <div className='bg-white border border-black/5 rounded-xl p-3 text-center shadow-sm'>
                <p className='text-sm font-black text-yellow-500'>3</p>
                <p className='text-[8px] text-text-secondary'>Alerts</p>
              </div>
            </div>

            {/* MINI INSIGHTS STRIP */}
            <div className='bg-white border border-black/5 rounded-xl p-3 flex justify-between items-center shadow-sm'>
              <div>
                <p className='text-[10px] font-bold text-text-primary'>
                  {isUrdu ? 'آج کے وزٹس' : 'Today’s Visits'}
                </p>
                <p className='text-[8px] text-text-secondary'>
                  6 completed • 2 pending
                </p>
              </div>

              <div className='text-[9px] font-bold text-[#3b59ff]'>8 TOTAL</div>
            </div>

            {/* PATIENT QUEUE */}
            <div className='bg-white border border-black/5 rounded-xl p-3 shadow-sm space-y-2'>
              <p className='text-[9px] font-bold text-text-muted uppercase tracking-wider'>
                {isUrdu ? 'مریض کی قطار' : 'Patient Queue'}
              </p>

              <div className='flex items-center justify-between'>
                <span className='text-[10px] font-medium text-text-primary'>
                  Ahmed Khan
                </span>
                <span className='text-[8px] text-red-500 font-bold'>
                  URGENT
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-[10px] font-medium text-text-primary'>
                  Sara Ali
                </span>
                <span className='text-[8px] text-yellow-500 font-bold'>
                  WAITING
                </span>
              </div>

              <div className='flex items-center justify-between'>
                <span className='text-[10px] font-medium text-text-primary'>
                  John Smith
                </span>
                <span className='text-[8px] text-emerald-500 font-bold'>
                  STABLE
                </span>
              </div>
            </div>

            {/* ACTIVITY FEED (ENHANCED) */}
            <div className='bg-white border border-black/5 rounded-xl p-4 space-y-3 shadow-sm'>
              <p className='text-[9px] font-bold text-text-muted uppercase tracking-wider'>
                {isUrdu ? 'لائیو سرگرمی' : 'Live Activity'}
              </p>

              <div className='flex items-center gap-2'>
                <div className='w-2.5 h-2.5 rounded-full bg-emerald-500' />
                <p className='text-[10px] text-text-primary font-medium'>
                  {isUrdu
                    ? 'لیب رپورٹ اپڈیٹ ہو گئی'
                    : 'Lab report updated successfully'}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-2.5 h-2.5 rounded-full bg-blue-500' />
                <p className='text-[10px] text-text-primary font-medium'>
                  {isUrdu ? 'نیا اپائنٹمنٹ بک ہوا' : 'New appointment booked'}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-2.5 h-2.5 rounded-full bg-yellow-500' />
                <p className='text-[10px] text-text-primary font-medium'>
                  {isUrdu
                    ? 'ڈاکٹر کو الرٹ بھیجا گیا'
                    : 'Doctor alert triggered'}
                </p>
              </div>

              <div className='flex items-center gap-2'>
                <div className='w-2.5 h-2.5 rounded-full bg-red-500' />
                <p className='text-[10px] text-text-primary font-medium'>
                  {isUrdu
                    ? 'مریض کو فوری توجہ درکار'
                    : 'Patient needs immediate attention'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
