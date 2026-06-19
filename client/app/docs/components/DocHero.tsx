'use client';

type Props = {
  isUrdu?: boolean;
};

export default function DocHero({ isUrdu = false }: Props) {
  return (
    <div className='text-center mt-6 max-w-4xl mx-auto'>
      <h1 className='font-sans text-[30px] sm:text-[40px] md:text-[50px] leading-[1.1] tracking-tight font-black text-text-primary'>
        {isUrdu ? (
          <>
            آواز سے چلنے والا AI پر مبنی
            <br />
            جدید ہیلتھ کیئر مینجمنٹ پلیٹ فارم
          </>
        ) : (
          <>
            AI-Powered Voice-Enabled
            <br />
            Healthcare Management Platform
          </>
        )}
      </h1>

      <p className='mt-5 text-text-muted text-base sm:text-lg max-w-2xl mx-auto leading-7'>
        {isUrdu
          ? 'The Care Nexus ایک جدید SaaS پلیٹ فارم ہے جو مریضوں، ڈاکٹروں اور کلینکس کو ایک ہی جگہ پر جوڑتا ہے۔ یہ وائس AI، ریئل ٹائم چیٹ، اور مکمل ڈیجیٹل میڈیکل ورک فلو فراہم کرتا ہے۔'
          : 'The Care Nexus is a modern SaaS platform that connects patients, doctors, and clinics in one unified ecosystem with voice AI, real-time chat, and a complete digital medical workflow.'}
      </p>

      {/* Quick Stats */}
      <div className='mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4'>
        <div className='bg-white/70 border border-blue-100 rounded-xl p-4'>
          <p className='text-2xl font-bold text-blue-600'>3</p>
          <p className='text-xs text-gray-500 mt-1'>
            {isUrdu ? 'پورٹل' : 'Portals'}
          </p>
        </div>

        <div className='bg-white/70 border border-blue-100 rounded-xl p-4'>
          <p className='text-2xl font-bold text-blue-600'>AI</p>
          <p className='text-xs text-gray-500 mt-1'>
            {isUrdu ? 'وائس اسسٹنٹ' : 'Voice Assistant'}
          </p>
        </div>

        <div className='bg-white/70 border border-blue-100 rounded-xl p-4'>
          <p className='text-2xl font-bold text-blue-600'>24/7</p>
          <p className='text-xs text-gray-500 mt-1'>
            {isUrdu ? 'ریئل ٹائم سسٹم' : 'Realtime System'}
          </p>
        </div>

        <div className='bg-white/70 border border-blue-100 rounded-xl p-4'>
          <p className='text-2xl font-bold text-blue-600'>∞</p>
          <p className='text-xs text-gray-500 mt-1'>
            {isUrdu ? 'اسکیل ایبل' : 'Scalable'}
          </p>
        </div>
      </div>
    </div>
  );
}
