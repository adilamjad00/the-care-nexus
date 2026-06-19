'use client';

import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { useLocale } from 'next-intl';
import { Check, Star } from 'lucide-react';

export default function PricingPage() {
  const locale = useLocale();
  const isUrdu = locale === 'ur';

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1'>
        <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-28 mb-8'>
          {/* HERO SECTION */}
          <section className='text-center mb-28'>
            <div className='inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6'>
              <Star className='w-4 h-4' />
              {isUrdu ? 'سادہ اور شفاف قیمتیں' : 'Simple & Transparent Pricing'}
            </div>

            <h1 className='text-5xl md:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto'>
              {isUrdu
                ? 'اپنے لیے بہترین پلان منتخب کریں'
                : 'Choose the right plan for you'}
            </h1>

            <p className='mt-8 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed'>
              {isUrdu
                ? 'ہم ایسے پلانز پیش کرتے ہیں جو ہر سائز کے کلینک اور ڈاکٹرز کے لیے موزوں ہیں۔ یہ پلانز آپ کی ضروریات اور بجٹ کے مطابق آسانی سے منتخب کیے جا سکتے ہیں۔'
                : 'Flexible plans designed for doctors, clinics, and healthcare teams of all sizes. You can easily choose a plan that fits your needs and budget.'}
            </p>
          </section>

          {/* PRICING CARDS */}
          <section className='grid md:grid-cols-3 gap-8 mb-24 py-12'>
            {/* Basic */}
            <div className='bg-white border border-black/5 rounded-3xl p-8 flex flex-col justify-between'>
              <div>
                <h3 className='text-xl font-black text-text-primary'>
                  {isUrdu ? 'اسٹارٹر' : 'Starter'}
                </h3>

                <p className='text-3xl font-black text-primary mt-4'>
                  $0
                  <span className='text-sm text-text-secondary font-medium'>
                    / {isUrdu ? 'ماہانہ' : 'month'}
                  </span>
                </p>

                <ul className='mt-6 space-y-3 text-text-secondary text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu
                      ? 'بنیادی اپائنٹمنٹ سسٹم'
                      : 'Basic appointment system'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'مریض ریکارڈز' : 'Patient records'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'محدود سپورٹ' : 'Limited support'}
                  </li>
                </ul>
              </div>

              <button className='mt-8 w-full py-3 rounded-xl border border-primary text-primary font-semibold'>
                {isUrdu ? 'شروع کریں' : 'Get Started'}
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className='bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between relative'>
              <div className='absolute top-4 right-4 bg-primary text-white text-xs px-3 py-1 rounded-full font-semibold'>
                {isUrdu ? 'مشہور' : 'Most Popular'}
              </div>

              <div>
                <h3 className='text-xl font-black text-text-primary'>
                  {isUrdu ? 'پرو' : 'Pro'}
                </h3>

                <p className='text-3xl font-black text-primary mt-4'>
                  $29
                  <span className='text-sm text-text-secondary font-medium'>
                    / {isUrdu ? 'ماہانہ' : 'month'}
                  </span>
                </p>

                <ul className='mt-6 space-y-3 text-text-secondary text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'تمام اسٹارٹر فیچرز' : 'All Starter features'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'وائس پریسکرپشن' : 'Voice prescriptions'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'ایڈوانسڈ اینالیٹکس' : 'Advanced analytics'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'پریمیئم سپورٹ' : 'Priority support'}
                  </li>
                </ul>
              </div>

              <button className='mt-8 w-full py-3 rounded-xl bg-primary text-white font-semibold'>
                {isUrdu ? 'ابھی اپگریڈ کریں' : 'Upgrade Now'}
              </button>
            </div>

            {/* Enterprise */}
            <div className='bg-white border border-black/5 rounded-3xl p-8 flex flex-col justify-between'>
              <div>
                <h3 className='text-xl font-black text-text-primary'>
                  {isUrdu ? 'انٹرپرائز' : 'Enterprise'}
                </h3>

                <p className='text-3xl font-black text-primary mt-4'>
                  {isUrdu ? 'کسٹم' : 'Custom'}
                </p>

                <ul className='mt-6 space-y-3 text-text-secondary text-sm'>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'مکمل کلینک سسٹم' : 'Full clinic system'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'API انٹیگریشن' : 'API integrations'}
                  </li>
                  <li className='flex items-center gap-2'>
                    <Check className='w-4 h-4 text-primary' />
                    {isUrdu ? 'ڈیڈیکیٹڈ سپورٹ' : 'Dedicated support'}
                  </li>
                </ul>
              </div>

              <button className='mt-8 w-full py-3 rounded-xl border border-primary text-primary font-semibold'>
                {isUrdu ? 'رابطہ کریں' : 'Contact Sales'}
              </button>
            </div>
          </section>

          {/* VALUE SECTION */}
          <section className='text-center mb-12'>
            <h2 className='text-4xl font-black text-text-primary'>
              {isUrdu
                ? 'ہر پلان میں اعتماد شامل ہے'
                : 'Every plan includes trust built-in'}
            </h2>

            <p className='mt-6 text-text-secondary max-w-3xl mx-auto'>
              {isUrdu
                ? 'ہم آپ کو صرف سافٹ ویئر نہیں دیتے، بلکہ ایک مکمل ہیلتھ کیئر سسٹم فراہم کرتے ہیں۔'
                : 'We don’t just give software — we provide a complete healthcare operating system.'}
            </p>
          </section>

          {/* CTA SECTION */}
          <section className='text-center bg-primary/5 border border-primary/10 rounded-3xl py-16'>
            <h2 className='text-4xl font-black text-text-primary'>
              {isUrdu ? 'آج ہی شروع کریں' : 'Start today'}
            </h2>

            <p className='mt-4 text-text-secondary max-w-xl mx-auto'>
              {isUrdu
                ? 'اپنے کلینک کو ڈیجیٹل سسٹم میں تبدیل کریں۔'
                : 'Transform your clinic into a modern digital system.'}
            </p>

            <button className='mt-8 px-8 py-3 rounded-xl bg-primary text-white font-semibold'>
              {isUrdu ? 'مفت آغاز کریں' : 'Get Started Free'}
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
