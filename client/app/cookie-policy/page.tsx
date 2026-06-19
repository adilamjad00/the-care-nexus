'use client';

import { Footer } from '@/components/home/Footer';
import { Header } from '@/components/home/Header';
import { Cookie, Shield, Settings, Database } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function CookiePolicyPage() {
  const locale = useLocale();
  const isUrdu = locale === 'ur';

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1'>
        <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20 mb-16'>
          {/* HERO SECTION */}
          <section className='text-center mb-28'>
            <div className='inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6'>
              <Cookie className='w-4 h-4' />
              {isUrdu ? 'ڈیٹا اور کوکیز' : 'Data & Cookies'}
            </div>

            <h1 className='text-5xl md:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto'>
              {isUrdu ? 'کوکی پالیسی' : 'Cookie Policy'}
            </h1>

            <p className='mt-8 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed'>
              {isUrdu
                ? 'ہماری پلیٹ فارم پر کوکیز سیکیورٹی، سیشن مینجمنٹ اور بہتر یوزر تجربے کے لیے استعمال ہوتی ہیں تاکہ آپ کا استعمال محفوظ اور ہموار رہے۔'
                : 'We use cookies for security, session management, and to enhance your overall user experience, ensuring a safe and smooth platform usage.'}
            </p>

            <p className='mt-4 text-sm font-semibold text-text-secondary'>
              {isUrdu ? 'موثر تاریخ' : 'Effective Date'}:{' '}
              {new Date().getFullYear()}
            </p>
          </section>

          {/* WHY WE USE COOKIES */}
          <section className=' py-16'>
            <h2 className='text-3xl sm:text-4xl font-black text-text-primary mb-10 text-center'>
              {isUrdu ? 'ہم کوکیز کیوں استعمال کرتے ہیں' : 'Why We Use Cookies'}
            </h2>

            <div className='grid md:grid-cols-3 gap-8'>
              <div className='p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center'>
                <Shield className='w-8 h-8 text-primary mx-auto mb-4' />
                <h3 className='text-xl font-bold text-text-primary mb-2'>
                  {isUrdu ? 'سیکیورٹی' : 'Security'}
                </h3>
                <p className='text-text-secondary'>
                  {isUrdu
                    ? 'لاگ ان سیشن اور یوزر ڈیٹا کو محفوظ رکھنے کے لیے۔'
                    : 'To secure login sessions and protect user data.'}
                </p>
              </div>

              <div className='p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center'>
                <Settings className='w-8 h-8 text-primary mx-auto mb-4' />
                <h3 className='text-xl font-bold text-text-primary mb-2'>
                  {isUrdu ? 'سیشن مینجمنٹ' : 'Session Management'}
                </h3>
                <p className='text-text-secondary'>
                  {isUrdu
                    ? 'یوزر سیشن کو برقرار رکھنے اور ہموار نیویگیشن کے لیے۔'
                    : 'To maintain user sessions and enable smooth navigation.'}
                </p>
              </div>

              <div className='p-8 rounded-2xl bg-primary/5 border border-primary/10 text-center'>
                <Database className='w-8 h-8 text-primary mx-auto mb-4' />
                <h3 className='text-xl font-bold text-text-primary mb-2'>
                  {isUrdu ? 'ترجیحات' : 'Preferences'}
                </h3>
                <p className='text-text-secondary'>
                  {isUrdu
                    ? 'زبان اور یوزر سیٹنگز کو محفوظ رکھنے کے لیے۔'
                    : 'To store language and user preferences.'}
                </p>
              </div>
            </div>
          </section>

          {/* HOW COOKIES WORK */}
          <section className='mb-16 py-12 max-w-5xl mx-auto'>
            <h2 className='text-3xl sm:text-4xl font-black text-text-primary mb-4'>
              {isUrdu ? 'کوکیز کیسے کام کرتی ہیں' : 'How Cookies Work'}
            </h2>

            <p className='text-lg leading-8 text-text-secondary'>
              {isUrdu
                ? 'کوکیز چھوٹی ٹیکسٹ فائلز ہوتی ہیں جو آپ کے براؤزر میں اس وقت محفوظ کی جاتی ہیں جب آپ ہماری ویب سائٹ استعمال کرتے ہیں۔ یہ فائلز آپ کی بنیادی معلومات اور سیشن ڈیٹا کو اسٹور کرنے میں مدد دیتی ہیں تاکہ سسٹم آپ کو پہچان سکے۔ اس کے ذریعے آپ کی لاگ ان حالت برقرار رہتی ہے اور آپ کو ہر بار دوبارہ لاگ ان نہیں کرنا پڑتا۔ اس کے علاوہ کوکیز آپ کی ترجیحات اور استعمال کے انداز کو یاد رکھتی ہیں تاکہ تجربہ مزید بہتر بنایا جا سکے۔'
                : 'Cookies are small text files stored in your browser when you use our website. These files help store your basic information and session data so the system can recognize you. This keeps you logged in and removes the need to sign in repeatedly. Cookies also remember your preferences and usage behavior to improve and personalize your overall experience.'}
            </p>
          </section>

          {/* CTA SECTION */}
          <section className='text-center bg-primary/5 rounded-3xl py-4'>
            <h2 className='text-4xl font-black text-text-primary mb-4'>
              {isUrdu
                ? 'محفوظ اور شفاف پلیٹ فارم'
                : 'A Secure & Transparent Platform'}
            </h2>

            <p className='text-text-secondary max-w-2xl mx-auto mb-8'>
              {isUrdu
                ? 'ہم آپ کے ڈیٹا کو محفوظ اور شفاف رکھنے کے لیے مسلسل بہتر بنا رہے ہیں۔'
                : 'We continuously improve our platform to keep your data secure and transparent.'}
            </p>

            <button className='px-8 py-3 rounded-xl bg-primary text-white font-semibold'>
              {isUrdu ? 'مزید جانیں' : 'Learn More'}
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
