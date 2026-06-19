'use client';

import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { Lock, Shield, Database, Eye } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const isUrdu = locale === 'ur';

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1'>
        <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-24 mb-8'>
          {/* HERO SECTION */}
          <section className='text-center mb-24'>
            <div className='inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6'>
              <Lock className='w-4 h-4' />
              {isUrdu ? 'رازداری اور سیکیورٹی' : 'Privacy & Security'}
            </div>

            <h1 className='text-5xl md:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto'>
              {isUrdu ? 'رازداری پالیسی' : 'Privacy Policy'}
            </h1>

            <p className='mt-8 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed'>
              {isUrdu
                ? 'ہم آپ کے ڈیٹا کو محفوظ، شفاف اور ذمہ داری کے ساتھ استعمال کرتے ہیں۔'
                : 'We handle your data with security, transparency, and responsibility.'}
            </p>

            <p className='mt-4 text-sm font-semibold text-text-secondary'>
              {isUrdu ? 'موثر تاریخ' : 'Effective Date'}:{' '}
              {new Date().getFullYear()}
            </p>
          </section>

          {/* TRUST CARDS SECTION */}
          <section className='grid md:grid-cols-3 gap-8 mb-24 pt-16'>
            <div className='bg-white border border-black/5 rounded-3xl p-8 text-center'>
              <Shield className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='text-xl font-black text-text-primary'>
                {isUrdu ? 'محفوظ رسائی' : 'Secure Access'}
              </h3>
              <p className='text-text-secondary mt-2 text-sm'>
                {isUrdu
                  ? 'رول بیسڈ سیکیورٹی کے ذریعے محدود رسائی'
                  : 'Role-based access ensures controlled data visibility'}
              </p>
            </div>

            <div className='bg-primary/5 border border-primary/10 rounded-3xl p-8 text-center'>
              <Database className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='text-xl font-black text-text-primary'>
                {isUrdu ? 'ڈیٹا کنٹرول' : 'Data Control'}
              </h3>
              <p className='text-text-secondary mt-2 text-sm'>
                {isUrdu
                  ? 'آپ کے ڈیٹا کا مکمل کنٹرول سسٹم میں محفوظ'
                  : 'You remain in control of your data at all times'}
              </p>
            </div>

            <div className='bg-white border border-black/5 rounded-3xl p-8 text-center'>
              <Eye className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='text-xl font-black text-text-primary'>
                {isUrdu ? 'شفاف استعمال' : 'Transparency'}
              </h3>
              <p className='text-text-secondary mt-2 text-sm'>
                {isUrdu
                  ? 'ڈیٹا کا استعمال واضح اور محدود مقاصد کے لیے'
                  : 'Data is used only for clearly defined purposes'}
              </p>
            </div>
          </section>

          {/* POLICY CONTENT SECTION */}
          <section className='max-w-6xl mx-auto space-y-16'>
            {/* Section 1 */}
            <div>
              <h2 className='text-3xl font-black text-text-primary mb-4'>
                {isUrdu ? 'ہم کیا معلومات جمع کرتے ہیں' : 'What We Collect'}
              </h2>

              <p className='text-lg text-text-secondary leading-8'>
                {isUrdu
                  ? 'ہم آپ کی اکاؤنٹ معلومات، طبی ریکارڈز، اپائنٹمنٹس اور سسٹم لاگز کو محفوظ طریقے سے جمع کرتے ہیں۔ یہ معلومات پلیٹ فارم کو مؤثر طریقے سے چلانے اور بہتر خدمات فراہم کرنے میں مدد دیتی ہیں۔ تمام ڈیٹا صرف ضروری آپریشنز اور صارف تجربے کو بہتر بنانے کے لیے استعمال کیا جاتا ہے۔'
                  : 'We securely collect your account information, medical records, appointments, and system logs. This data helps us operate the platform efficiently and deliver better services. All information is used strictly for essential operations and improving user experience.'}
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className='text-3xl font-black text-text-primary mb-4'>
                {isUrdu ? 'ڈیٹا کا استعمال' : 'How We Use Data'}
              </h2>

              <p className='text-lg text-text-secondary leading-8'>
                {isUrdu
                  ? 'ہم ڈیٹا کو مریضوں کی بہتر دیکھ بھال، اپائنٹمنٹ مینجمنٹ اور مؤثر کمیونیکیشن کے لیے استعمال کرتے ہیں۔ اس کے ذریعے نوٹیفکیشنز، سسٹم آپٹیمائزیشن اور یوزر ایکسپیرینس کو بہتر بنایا جاتا ہے۔ ہمارا مقصد خدمات کو زیادہ مؤثر، تیز اور قابل اعتماد بنانا ہے۔'
                  : 'We use data to improve patient care, manage appointments, and ensure effective communication. It also helps in notifications, system optimization, and enhancing user experience. Our goal is to make services more efficient, fast, and reliable.'}
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className='text-3xl font-black text-text-primary mb-4'>
                {isUrdu ? 'ڈیٹا سیکیورٹی' : 'Data Security'}
              </h2>

              <p className='text-lg text-text-secondary leading-8'>
                {isUrdu
                  ? 'ہم آپ کے ڈیٹا کی حفاظت کے لیے جدید انکرپشن ٹیکنالوجی، محفوظ سرورز اور رول بیسڈ ایکسس کنٹرول استعمال کرتے ہیں۔ اس سے صرف مجاز افراد ہی معلومات تک رسائی حاصل کر سکتے ہیں۔ ہمارا مقصد آپ کی پرائیویسی اور ڈیٹا کی مکمل حفاظت کو یقینی بنانا ہے۔'
                  : 'We protect your data using advanced encryption technology, secure servers, and role-based access control. This ensures that only authorized users can access sensitive information. Our goal is to guarantee complete privacy and data protection at all times.'}
              </p>
            </div>

            {/* CTA SECTION */}
            <section className='mt-12 text-center bg-primary/5 border border-primary/10 rounded-3xl py-12'>
              <h2 className='text-4xl font-black text-text-primary'>
                {isUrdu
                  ? 'آپ کی رازداری ہماری ترجیح ہے'
                  : 'Your Privacy is Our Priority'}
              </h2>

              <p className='mt-4 text-text-secondary max-w-xl mx-auto'>
                {isUrdu
                  ? 'ہم مسلسل اپنے سیکیورٹی سسٹمز کو بہتر بنا رہے ہیں۔'
                  : 'We continuously improve our security and privacy systems.'}
              </p>

              <button className='mt-8 px-8 py-3 rounded-xl bg-primary text-white font-semibold'>
                {isUrdu ? 'مزید جانیں' : 'Learn More'}
              </button>
            </section>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
