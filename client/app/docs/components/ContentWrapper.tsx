'use client';

type Props = {
  isUrdu?: boolean;
};

export default function ContentWrapper({ isUrdu = false }: Props) {
  return (
    <div className='mt-14 max-w-5xl mx-auto space-y-10'>
      {/* INTRO CARD */}
      <div className='bg-white/70 border border-blue-100 rounded-2xl p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-gray-800'>
          {isUrdu ? '📌 پلیٹ فارم کا تعارف' : '📌 Platform Overview'}
        </h2>

        <p className='mt-3 text-gray-600 leading-7'>
          {isUrdu
            ? 'The Care Nexus ایک مکمل ہیلتھ کیئر SaaS سسٹم ہے جو ڈاکٹروں، مریضوں اور کلینکس کے درمیان ڈیجیٹل پل کا کام کرتا ہے۔ اس میں AI، وائس پروسیسنگ، اور ریئل ٹائم کمیونیکیشن شامل ہے۔'
            : 'The Care Nexus is a full-scale healthcare SaaS system acting as a digital bridge between doctors, patients, and clinics with AI, voice processing, and real-time communication.'}
        </p>
      </div>

      {/* CALL OUT */}
      <div className='bg-blue-50 border border-blue-200 rounded-2xl p-5'>
        <p className='text-sm text-blue-700 font-medium'>
          {isUrdu
            ? '⚡ یہ پلیٹ فارم Gemini AI اور GROQ پر مبنی وائس پریسکرپشن سسٹم استعمال کرتا ہے'
            : '⚡ This platform uses Gemini AI & GROQ-powered voice prescription system'}
        </p>
      </div>

      {/* TECH STACK SECTION */}
      <div className='bg-white/70 border border-blue-100 rounded-2xl p-6'>
        <h3 className='text-lg font-bold text-gray-800'>
          {isUrdu ? '🧠 ٹیک اسٹیک' : '🧠 Tech Stack'}
        </h3>

        <div className='mt-4 grid sm:grid-cols-2 gap-4 text-sm'>
          <div className='p-4 rounded-xl border bg-white'>
            <p className='font-semibold'>Frontend</p>
            <p className='text-gray-600 mt-1'>
              Next.js 16 + Tailwind CSS + RTK Query
            </p>
          </div>

          <div className='p-4 rounded-xl border bg-white'>
            <p className='font-semibold'>Backend</p>
            <p className='text-gray-600 mt-1'>Node.js + Express + MongoDB</p>
          </div>

          <div className='p-4 rounded-xl border bg-white'>
            <p className='font-semibold'>AI</p>
            <p className='text-gray-600 mt-1'>
              Gemini API + GROQ (Voice + NLP)
            </p>
          </div>

          <div className='p-4 rounded-xl border bg-white'>
            <p className='font-semibold'>Realtime</p>
            <p className='text-gray-600 mt-1'>Socket.IO + Redis</p>
          </div>
        </div>
      </div>

      {/* CODE BLOCK */}
      <div className='bg-gray-900 text-green-300 rounded-2xl p-5 overflow-x-auto'>
        <p className='text-xs text-gray-400 mb-3'>
          {isUrdu ? 'مثال API کال' : 'Example API Call'}
        </p>

        <pre className='text-xs leading-6'>
          {`POST /api/auth/login

{
  "email": "doctor@care.com",
  "password": "********"
}

Response:
{
  "token": "jwt_token_here",
  "role": "doctor"
}`}
        </pre>
      </div>

      {/* MODULE PREVIEW CARD */}
      <div className='bg-white/70 border border-blue-100 rounded-2xl p-6'>
        <h3 className='text-lg font-bold'>
          {isUrdu ? '🔐 ماڈیولز کا جائزہ' : '🔐 Modules Overview'}
        </h3>

        <ul className='mt-4 space-y-2 text-gray-600 text-sm'>
          <li>
            •{' '}
            {isUrdu
              ? 'Authentication & Authorization'
              : 'Authentication & Authorization'}
          </li>
          <li>
            •{' '}
            {isUrdu
              ? 'Doctor / Patient / Clinic Portals'
              : 'Doctor / Patient / Clinic Portals'}
          </li>
          <li>
            •{' '}
            {isUrdu
              ? 'AI Voice Prescription System'
              : 'AI Voice Prescription System'}
          </li>
          <li>
            •{' '}
            {isUrdu
              ? 'Realtime Chat & Notifications'
              : 'Realtime Chat & Notifications'}
          </li>
          <li>
            •{' '}
            {isUrdu
              ? 'Analytics & Automation Engine'
              : 'Analytics & Automation Engine'}
          </li>
        </ul>
      </div>
    </div>
  );
}
