'use client';

import { useLanguage } from '@/providers/LanguageProvider';

export function WhyCareNexus() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  return (
    <section className='py-16 bg-white border-b border-black/5'>
      <div className='mx-auto max-w-6xl px-6 sm:px-10'>
        {/* HEADER */}
        <div className='text-center max-w-3xl mx-auto mb-10'>
          <h2 className='mt-3 text-3xl sm:text-4xl font-black text-text-primary leading-tight'>
            {isUrdu
              ? 'جدید ہیلتھ کیئر کو زیادہ تیز، محفوظ اور مربوط بنائیں'
              : 'Make modern healthcare faster, safer, and fully connected'}
          </h2>
        </div>

        {/* VALUE GRID */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Card 1 */}
          <div className='p-4 border border-black/5 rounded-2xl hover:shadow-md transition-shadow'>
            <div className='h-10 w-10 rounded-xl bg-[#3b59ff]/10 flex items-center justify-center text-[#3b59ff] mb-4'>
              ⚡
            </div>
            <h3 className='text-lg font-bold text-text-primary'>
              {isUrdu ? 'تیز کلینیکل فیصلے' : 'Faster Clinical Decisions'}
            </h3>
            <p className='mt-2 text-sm text-text-secondary leading-relaxed'>
              {isUrdu
                ? 'ریئل ٹائم ڈیٹا اور اپڈیٹس کے ذریعے ڈاکٹر فوری اور درست فیصلے لے سکتے ہیں۔'
                : 'Real-time patient data enables doctors to make faster and more accurate decisions.'}
            </p>
          </div>

          {/* Card 2 */}
          <div className='p-4 border border-black/5 rounded-2xl hover:shadow-md transition-shadow'>
            <div className='h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4'>
              🔒
            </div>
            <h3 className='text-lg font-bold text-text-primary'>
              {isUrdu ? 'محفوظ اور قابل اعتماد' : 'Secure & Trusted'}
            </h3>
            <p className='mt-2 text-sm text-text-secondary leading-relaxed'>
              {isUrdu
                ? 'تمام مریض ڈیٹا انکرپٹڈ ہے اور محفوظ ماحول میں محفوظ کیا جاتا ہے۔'
                : 'All patient data is encrypted and stored in a highly secure clinical environment.'}
            </p>
          </div>

          {/* Card 3 */}
          <div className='p-4 border border-black/5 rounded-2xl hover:shadow-md transition-shadow'>
            <div className='h-10 w-10 rounded-xl bg-yellow-100 flex items-center justify-center text-yellow-600 mb-4'>
              🌐
            </div>
            <h3 className='text-lg font-bold text-text-primary'>
              {isUrdu ? 'مکمل کنیکٹڈ سسٹم' : 'Fully Connected System'}
            </h3>
            <p className='mt-2 text-sm text-text-secondary leading-relaxed'>
              {isUrdu
                ? 'ڈاکٹر، نرس اور مریض ایک ہی سسٹم میں ریئل ٹائم میں جڑے رہتے ہیں۔'
                : 'Doctors, nurses, and patients stay connected in real time through one system.'}
            </p>
          </div>
        </div>

        {/* BOTTOM IMPACT STRIP */}
        <div className='mt-10 bg-slate-50 border border-black/5 rounded-2xl p-6 text-center'>
          <h3 className='text-xl font-bold text-text-primary'>
            {isUrdu
              ? 'ایک بہتر ہیلتھ کیئر سسٹم کی طرف قدم'
              : 'A step toward better healthcare systems'}
          </h3>

          <p className='mt-2 text-sm text-text-secondary max-w-2xl mx-auto'>
            {isUrdu
              ? 'ہم کلینکس اور ہسپتالوں کو جدید، ڈیجیٹل اور زیادہ مؤثر بنانے میں مدد کرتے ہیں۔'
              : 'We help clinics and hospitals become more modern, digital, and efficient.'}
          </p>

          <button className='mt-6 px-6 py-2 rounded-xl bg-[#3b59ff] text-white text-sm font-bold hover:bg-[#2546ff] transition'>
            {isUrdu ? 'شروع کریں' : 'Get Started'}
          </button>
        </div>
      </div>
    </section>
  );
}
