'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function Overview({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'جائزہ' : 'Overview'}
        </h2>
        <p className='text-lg text-gray-700 leading-relaxed'>
          {isUrdu
            ? 'کیئر نیکسس ایک جدید، AI سے متحرک ڈیجیٹل ہیلتھ کیئر پلیٹ فارم ہے جو مریضوں، ڈاکٹروں، اور کلینکس کو بے جوڑ طریقے سے جوڑتا ہے۔'
            : 'The Care Nexus is a modern, AI-powered digital healthcare platform that seamlessly connects patients, doctors, and clinics in a unified ecosystem.'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {[
          {
            en: 'Three Dedicated Portals',
            ur: 'تین الگ الگ پورٹل',
            desc_en:
              'Doctor, Patient, and Clinic Admin interfaces optimized for each user role',
            desc_ur: 'ڈاکٹر، مریض، اور کلینک کے منتظم کے لیے بہتر شدہ انٹرفیسز',
          },
          {
            en: 'Voice-Powered Prescriptions',
            ur: 'آواز سے چلنے والی ہدایات',
            desc_en:
              'Convert doctor speech directly into structured prescription records',
            desc_ur: 'ڈاکٹر کی آواز کو براہ راست ہدایات میں تبدیل کریں',
          },
          {
            en: 'Real-Time Collaboration',
            ur: 'بروقت تعاون',
            desc_en:
              'Live chat, instant notifications, and real-time data synchronization',
            desc_ur: 'براہ راست چیٹ، فوری اطلاعات، اور ڈیٹا کی ہم وقتی تبدیلی',
          },
          {
            en: 'Bilingual Support',
            ur: 'دو زبان کی سپورٹ',
            desc_en: 'Full English & Urdu support with RTL text direction',
            desc_ur: 'مکمل انگریزی اور اردو کی سپورٹ اور دائیں سے بائیں ٹیکسٹ',
          },
        ].map((item, i) => (
          <div
            key={i}
            className='p-5 rounded-lg border border-blue-100 bg-white/50 hover:bg-white transition'
          >
            <h3 className='font-semibold text-gray-900 mb-2'>
              {isUrdu ? item.ur : item.en}
            </h3>
            <p className='text-sm text-gray-600'>
              {isUrdu ? item.desc_ur : item.desc_en}
            </p>
          </div>
        ))}
      </div>

      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='font-semibold text-blue-900 mb-2'>
          {isUrdu ? '🎯 اہم خصوصیات' : '🎯 Key Features'}
        </h3>
        <ul className='text-sm text-blue-800 space-y-2'>
          <li>✓ JWT-based secure authentication</li>
          <li>✓ MongoDB + Redis architecture</li>
          <li>✓ Socket.io for real-time features</li>
          <li>✓ Google Gemini AI integration</li>
        </ul>
      </div>
    </section>
  );
}
