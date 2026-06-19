'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function MultilingualSupport({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'دو زبان کی سپورٹ' : 'Multilingual Support'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'next-intl کے ساتھ انگریزی اور اردو'
            : 'Full English & Urdu support powered by next-intl'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-6 rounded-lg border border-blue-200 bg-blue-50'>
          <h3 className='font-bold text-blue-900 mb-3'>🌐 Languages</h3>
          <ul className='text-sm text-blue-800 space-y-2'>
            <li>✓ English (LTR)</li>
            <li>✓ Urdu (RTL)</li>
            <li>✓ Dynamic switching</li>
          </ul>
        </div>
        <div className='p-6 rounded-lg border border-purple-200 bg-purple-50'>
          <h3 className='font-bold text-purple-900 mb-3'>⚙️ Implementation</h3>
          <ul className='text-sm text-purple-800 space-y-2'>
            <li>✓ URL-based routing</li>
            <li>✓ useLocale() hook</li>
            <li>✓ RTL CSS classes</li>
          </ul>
        </div>
      </div>

      <div className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono space-y-1'>
        <p>// Usage in components</p>
        <p>const locale = useLocale();</p>
        <p>const isUrdu = locale === 'ur';</p>
        <p>&lt;h1&gt;{isUrdu ? 'اردو' : 'English'}&lt;/h1&gt;</p>
      </div>
    </section>
  );
}
