'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function EnvironmentVariables({ isUrdu }: SectionProps) {
  const frontendVars = [
    { key: 'NEXT_PUBLIC_API_URL', example: 'https://api.care-nexus.com' },
    { key: 'NEXT_PUBLIC_SOCKET_URL', example: 'https://api.care-nexus.com' },
    { key: 'NEXT_PUBLIC_LOCALE', example: 'en' },
  ];

  const backendVars = [
    { key: 'MONGO_URI', example: 'mongodb+srv://...' },
    { key: 'REDIS_URL', example: 'redis+srv://...' },
    { key: 'JWT_SECRET', example: 'your_secret_key' },
    { key: 'GEMINI_API_KEY', example: 'your_key_here' },
    { key: 'GROQ_API_KEY', example: 'your_key_here' },
  ];

  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'ماحول کی ترتیبات' : 'Environment Variables'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu ? '.env.local میں ترتیب دیں' : 'Configure in .env.local file'}
        </p>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Frontend (.env.local)
        </h3>
        <div className='bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono space-y-1'>
          {frontendVars.map((v, i) => (
            <p key={i}>
              {v.key}={v.example}
            </p>
          ))}
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-900'>Backend (.env)</h3>
        <div className='bg-gray-900 text-gray-100 p-4 rounded-lg text-xs font-mono space-y-1'>
          {backendVars.map((v, i) => (
            <p key={i}>
              {v.key}={v.example}
            </p>
          ))}
        </div>
      </div>

      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
        <p className='text-sm text-yellow-900'>
          ⚠️ Never commit .env files to version control. Use .env.example with
          placeholder values
        </p>
      </div>
    </section>
  );
}
