'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function TechStack({ isUrdu }: SectionProps) {
  const techStack = [
    {
      layer: 'Frontend',
      tech: 'Next.js 16+, React 19, Tailwind CSS v4',
      purpose: 'SSR, routing, responsive UI',
    },
    {
      layer: 'State Mgmt',
      tech: 'Redux Toolkit, RTK Query',
      purpose: 'Global state, data fetching',
    },
    {
      layer: 'Backend',
      tech: 'Node.js, Express.js',
      purpose: 'REST API, business logic',
    },
    {
      layer: 'Database',
      tech: 'MongoDB Atlas, Mongoose',
      purpose: 'Primary data store',
    },
    {
      layer: 'Cache',
      tech: 'Redis (Upstash)',
      purpose: 'Sessions, rate limiting, caching',
    },
    {
      layer: 'AI/NLP',
      tech: 'Google Gemini, GROQ',
      purpose: 'Chat, transcription, parsing',
    },
    {
      layer: 'Real-time',
      tech: 'Socket.io',
      purpose: 'Live chat, notifications',
    },
    { layer: 'Auth', tech: 'JWT, bcrypt', purpose: 'Secure authentication' },
    { layer: 'Scheduling', tech: 'node-cron', purpose: 'Automated tasks' },
    { layer: 'i18n', tech: 'next-intl', purpose: 'Multilingual support' },
  ];

  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'ٹیکنولوجی کا اسٹیک' : 'Technology Stack'}
        </h2>
        <p className='text-lg text-gray-700 leading-relaxed'>
          {isUrdu
            ? 'جدید اور قابل توسیع تکنیکیوں کا مکمل سیٹ'
            : 'Complete set of modern and scalable technologies'}
        </p>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-blue-50 border-b border-blue-200'>
            <tr>
              <th className='px-4 py-3 text-left font-semibold text-gray-900'>
                Layer
              </th>
              <th className='px-4 py-3 text-left font-semibold text-gray-900'>
                Technology
              </th>
              <th className='px-4 py-3 text-left font-semibold text-gray-900'>
                Purpose
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-gray-200'>
            {techStack.map((item, i) => (
              <tr key={i} className='hover:bg-gray-50'>
                <td className='px-4 py-3 font-medium text-gray-900'>
                  {item.layer}
                </td>
                <td className='px-4 py-3 text-gray-700'>{item.tech}</td>
                <td className='px-4 py-3 text-gray-600'>{item.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-4 rounded-lg bg-amber-50 border border-amber-200'>
          <h3 className='font-semibold text-amber-900 mb-2'>Frontend Stack</h3>
          <p className='text-sm text-amber-800'>
            Modern React with Next.js App Router for optimal performance and SEO
          </p>
        </div>
        <div className='p-4 rounded-lg bg-purple-50 border border-purple-200'>
          <h3 className='font-semibold text-purple-900 mb-2'>Backend Stack</h3>
          <p className='text-sm text-purple-800'>
            Scalable Node.js APIs with MongoDB for flexible data storage
          </p>
        </div>
      </div>
    </section>
  );
}
