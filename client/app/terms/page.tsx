'use client';

import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { FileText, ShieldCheck, AlertTriangle, Scale } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function TermsPage() {
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
              <FileText className='w-4 h-4' />
              {isUrdu ? 'قوانین اور شرائط' : 'Terms & Conditions'}
            </div>

            <h1 className='text-5xl md:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto'>
              {isUrdu ? 'استعمال کی شرائط' : 'Terms of Use'}
            </h1>

            <p className='mt-8 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed'>
              {isUrdu
                ? 'یہ شرائط وضاحت کرتی ہیں کہ آپ The Care Nexus کو کیسے استعمال کر سکتے ہیں۔ یہ آپ کے حقوق اور ذمہ داریوں کو بھی واضح کرتی ہیں۔'
                : 'These terms explain how you may use The Care Nexus platform and its services. They also define your rights and responsibilities while using the platform.'}
            </p>

            <p className='mt-4 text-sm font-semibold text-text-secondary'>
              {isUrdu ? 'موثر تاریخ' : 'Effective Date'}:{' '}
              {new Date().getFullYear()}
            </p>
          </section>

          {/* KEY PRINCIPLES SECTION */}
          <section className='grid md:grid-cols-3 gap-8 mb-24 pt-12'>
            <div className='bg-white border border-black/5 rounded-3xl p-8 text-center'>
              <ShieldCheck className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='text-xl font-black text-text-primary'>
                {isUrdu ? 'محفوظ استعمال' : 'Safe Usage'}
              </h3>
              <p className='text-text-secondary mt-2 text-sm'>
                {isUrdu
                  ? 'پلیٹ فارم کا محفوظ اور ذمہ دار استعمال ضروری ہے'
                  : 'You must use the platform safely and responsibly'}
              </p>
            </div>

            <div className='bg-primary/5 border border-primary/10 rounded-3xl p-8 text-center'>
              <Scale className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='text-xl font-black text-text-primary'>
                {isUrdu ? 'منصفانہ پالیسی' : 'Fair Policy'}
              </h3>
              <p className='text-text-secondary mt-2 text-sm'>
                {isUrdu
                  ? 'تمام صارفین کے لیے برابر قواعد لاگو ہوتے ہیں'
                  : 'Rules apply equally to all users of the platform'}
              </p>
            </div>

            <div className='bg-white border border-black/5 rounded-3xl p-8 text-center'>
              <AlertTriangle className='w-8 h-8 text-primary mx-auto mb-4' />
              <h3 className='text-xl font-black text-text-primary'>
                {isUrdu ? 'ذمہ داری' : 'Responsibility'}
              </h3>
              <p className='text-text-secondary mt-2 text-sm'>
                {isUrdu
                  ? 'صارف اپنے اکاؤنٹ اور عمل کا خود ذمہ دار ہے'
                  : 'Users are responsible for their accounts and activities'}
              </p>
            </div>
          </section>

          {/* TERMS CONTENT SECTION */}
          <section className='max-w-6xl mx-auto space-y-12'>
            {/* Section 1 */}
            <div>
              <h2 className='text-3xl font-black text-text-primary mb-4'>
                {isUrdu ? '1. سروس کا استعمال' : '1. Use of Service'}
              </h2>

              <p className='text-lg text-text-secondary leading-8'>
                {isUrdu
                  ? 'آپ The Care Nexus کو صرف قانونی، مجاز اور اخلاقی مقاصد کے لیے استعمال کر سکتے ہیں۔ کسی بھی غیر قانونی، نقصان دہ یا غیر مجاز سرگرمی کی سختی سے ممانعت ہے۔ پلیٹ فارم کا غلط استعمال یا سیکیورٹی کو نقصان پہنچانے کی کوشش قابلِ کارروائی ہوگی۔'
                  : 'You may use The Care Nexus only for lawful, authorized, and ethical purposes. Any illegal, harmful, or unauthorized activity is strictly prohibited. Misuse of the platform or attempts to compromise its security may result in action against your account.'}
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 className='text-3xl font-black text-text-primary mb-4'>
                {isUrdu ? '2. اکاؤنٹ ذمہ داری' : '2. Account Responsibility'}
              </h2>

              <p className='text-lg text-text-secondary leading-8'>
                {isUrdu
                  ? 'اپنے اکاؤنٹ کی سیکیورٹی، پاس ورڈ اور تمام سرگرمیوں کی مکمل ذمہ داری صارف پر عائد ہوتی ہے۔ کسی بھی غیر مجاز رسائی یا مشکوک سرگرمی کی صورت میں فوری طور پر پلیٹ فارم کو اطلاع دینا ضروری ہے۔ صارف کو اپنے اکاؤنٹ کی معلومات کسی تیسرے فرد کے ساتھ شیئر نہیں کرنی چاہییں۔'
                  : 'You are fully responsible for maintaining the security of your account, password, and all activities. In case of any unauthorized access or suspicious activity, you must immediately notify the platform. You should not share your account credentials with any third party.'}
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 className='text-3xl font-black text-text-primary mb-4'>
                {isUrdu ? '3. سروس تبدیلیاں' : '3. Service Changes'}
              </h2>

              <p className='text-lg text-text-secondary leading-8'>
                {isUrdu
                  ? 'ہم کسی بھی وقت اپنی سروسز میں تبدیلی، اپڈیٹ، بہتری یا عارضی معطلی کا حق محفوظ رکھتے ہیں۔ یہ تبدیلیاں سسٹم کی بہتری، سیکیورٹی یا تکنیکی ضروریات کی بنیاد پر کی جا سکتی ہیں۔ بعض صورتوں میں یہ تبدیلیاں بغیر پیشگی اطلاع کے بھی ہو سکتی ہیں۔'
                  : 'We reserve the right to modify, update, improve, or temporarily suspend our services at any time. These changes may be made for system improvements, security enhancements, or technical requirements. In some cases, changes may be applied without prior notice.'}
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 className='text-3xl font-black text-text-primary mb-4'>
                {isUrdu ? '4. حدودِ ذمہ داری' : '4. Limitation of Liability'}
              </h2>

              <p className='text-lg text-text-secondary leading-8'>
                {isUrdu
                  ? 'ہم پلیٹ فارم کے استعمال کے نتیجے میں ہونے والے کسی بھی براہ راست، بالواسطہ یا ضمنی نقصان کے ذمہ دار نہیں ہوں گے۔ صارف اس سروس کو اپنی مکمل ذمہ داری پر استعمال کرتا ہے۔ ہم کسی بھی ڈیٹا نقصان، سسٹم خرابی یا سروس میں تعطل کے لیے ذمہ دار نہیں ہیں۔'
                  : 'We are not liable for any direct, indirect, incidental, or consequential damages arising from the use of the platform. Users access and use the service at their own risk. We are also not responsible for any data loss, system errors, or service interruptions.'}
              </p>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className='mt-24 text-center bg-primary/5 border border-primary/10 rounded-3xl py-16'>
            <h2 className='text-4xl font-black text-text-primary'>
              {isUrdu ? 'شفاف اور منصفانہ استعمال' : 'Fair & Transparent Usage'}
            </h2>

            <p className='mt-4 text-text-secondary max-w-xl mx-auto'>
              {isUrdu
                ? 'ہم ایک محفوظ اور ذمہ دار پلیٹ فارم بنانے کے لیے پرعزم ہیں۔'
                : 'We are committed to maintaining a safe and responsible platform.'}
            </p>

            <button className='mt-8 px-8 py-3 rounded-xl bg-primary text-white font-semibold'>
              {isUrdu ? 'مزید جانیں' : 'Learn More'}
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
