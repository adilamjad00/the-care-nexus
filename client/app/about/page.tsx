'use client';

import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { Info, Shield, Award } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const locale = useLocale();
  const isUrdu = locale === 'ur';
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className='flex-1'>
        <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-in mt-20 mb-20'>
          <section className='text-center mb-24'>
            <div className='inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6'>
              <Info className='w-4 h-4' />
              {isUrdu
                ? 'ہیلتھ کیئر کا مستقبل'
                : 'The Future of Healthcare Operations'}
            </div>

            <h1 className='text-5xl md:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto'>
              {isUrdu
                ? 'صحت کی دیکھ بھال کو زیادہ مربوط، ذہین اور قابلِ رسائی بنانا'
                : 'Making Healthcare More Connected, Intelligent, and Accessible'}
            </h1>

            <p className='mt-8 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed'>
              {isUrdu
                ? 'دی کیئر نیکسس مریضوں، ڈاکٹروں اور کلینکس کو ایک پلیٹ فارم پر لاتا ہے تاکہ بہتر تعاون، بہتر نتائج اور بہتر نگہداشت فراہم کی جا سکے۔'
                : 'The Care Nexus brings patients, healthcare providers, and clinics together on one platform to deliver better collaboration, better outcomes, and better care.'}
            </p>
          </section>

          {/* WHY WE EXIST */}
          <section className='max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8'>
            <div className='mb-4'>
              <h2 className='text-3xl sm:text-4xl font-black text-text-primary'>
                {isUrdu ? 'ہم کیوں موجود ہیں' : 'Why We Exist'}
              </h2>
            </div>

            <div className='max-w-6xl mx-auto'>
              <p className='text-base sm:text-lg leading-8 text-text-secondary'>
                {isUrdu
                  ? 'صحت کی دیکھ بھال کے شعبے میں اب بھی بہت سے کلینکس اور ڈاکٹر کاغذی ریکارڈز، بکھرے ہوئے ڈیٹا اور وقت طلب انتظامی کاموں پر انحصار کرتے ہیں۔ اس وجہ سے اہم معلومات ضائع ہو سکتی ہیں، مریضوں کے ساتھ رابطہ متاثر ہوتا ہے اور طبی ٹیموں کی کارکردگی کم ہو جاتی ہے۔ دی کیئر نیکسس اسی مسئلے کو حل کرنے کے لیے بنایا گیا ہے تاکہ مریض، ڈاکٹر اور کلینکس ایک ہی مربوط پلیٹ فارم پر کام کر سکیں، جہاں معلومات محفوظ، قابلِ رسائی اور ہر وقت دستیاب ہوں۔'
                  : 'Healthcare organizations still struggle with fragmented records, manual workflows, and disconnected communication channels. These challenges slow down care delivery, create operational inefficiencies, and make it harder for patients to stay engaged in their health journey. The Care Nexus exists to unify healthcare operations into one intelligent platform where patients, providers, and clinics can collaborate through secure records, real-time communication, AI-powered workflows, and streamlined care management.'}
              </p>
            </div>
          </section>

          <section className='py-12'>
            <div className='text-center mb-8'>
              <h2 className='text-4xl font-black text-text-primary'>
                {isUrdu
                  ? 'دی کیئر نیکسس کو منفرد کیا بناتا ہے'
                  : 'What Makes The Care Nexus Different'}
              </h2>
            </div>

            <div className='grid md:grid-cols-4 gap-8 text-center bg-primary/5 rounded-3xl p-12 '>
              <div>
                <h3 className='text-4xl font-black text-primary'>24/7</h3>
                <p>Platform Availability</p>
              </div>

              <div>
                <h3 className='text-4xl font-black text-primary'>100%</h3>
                <p>Digital Workflow</p>
              </div>

              <div>
                <h3 className='text-4xl font-black text-primary'>Real-Time</h3>
                <p>Patient Updates</p>
              </div>

              <div>
                <h3 className='text-4xl font-black text-primary'>Multi-Role</h3>
                <p>Care Collaboration</p>
              </div>
            </div>
          </section>

          {/* OUR VISION */}
          <section className='max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
            <div className='mb-4'>
              <h2 className='text-6xl sm:text-4xl font-black text-text-primary'>
                {isUrdu ? 'ہمارا وژن' : 'Our Vision'}
              </h2>
            </div>

            <div className='max-w-6xl mx-auto'>
              <p className='text-base sm:text-lg leading-8 text-text-secondary'>
                {isUrdu
                  ? 'ہم ایک ایسے مستقبل کا تصور کرتے ہیں جہاں صحت کی دیکھ بھال زیادہ ذہین، زیادہ مربوط اور ہر فرد کے لیے آسانی سے قابلِ رسائی ہو۔ ہمارا مقصد صرف ڈیجیٹل ریکارڈز فراہم کرنا نہیں بلکہ ایک ایسا مکمل ہیلتھ کیئر ایکو سسٹم بنانا ہے جو مصنوعی ذہانت، وائس ٹیکنالوجی اور جدید آٹومیشن کے ذریعے ڈاکٹروں کو بہتر فیصلے کرنے اور مریضوں کو بہتر تجربہ فراہم کرنے میں مدد دے۔'
                  : 'We envision a future where healthcare is intelligent, connected, and accessible to everyone. Our goal is to become the operating system for modern care delivery by combining AI, voice technology, patient engagement tools, and clinical workflow automation into a single platform. Through continuous innovation, The Care Nexus aims to help healthcare organizations deliver faster, safer, and more personalized care at scale.'}
              </p>
            </div>
          </section>

          <section className='text-center bg-primary/5 rounded-3xl py-12 text-white mt-6'>
            <h2 className='text-4xl font-black mb-4'>
              {isUrdu
                ? 'صحت کی دیکھ بھال کا مستقبل آج ہی شروع کریں'
                : 'Start Building Better Healthcare Today'}
            </h2>

            <p className='max-w-2xl mx-auto text-text-primary mb-8'>
              {isUrdu
                ? 'دی کیئر نیکسس کے ساتھ اپنے مریضوں، ڈاکٹروں اور کلینک کو ایک پلیٹ فارم پر لائیں۔'
                : 'Bring your patients, doctors, and clinic operations together on one connected platform.'}
            </p>

            <Button size='lg'>
              {isUrdu ? 'مفت آغاز کریں' : 'Get Started Free'}
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
