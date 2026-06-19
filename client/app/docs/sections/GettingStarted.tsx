'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function GettingStarted({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'شروعات' : 'Getting Started'}
        </h2>
        <p className='text-lg text-gray-700 leading-relaxed mb-6'>
          {isUrdu
            ? 'کیئر نیکسس کو سیٹ اپ اور چلانے کے لیے مرحلہ بہ مرحلہ رہنمائی'
            : 'Step-by-step guide to set up and run The Care Nexus platform'}
        </p>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>
          {isUrdu ? 'ضروری چیزیں' : 'Prerequisites'}
        </h3>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700'>
          <p>• Node.js 18+ اور npm/yarn</p>
          <p>• MongoDB Atlas اکاؤنٹ</p>
          <p>• Redis (Upstash) اکاؤنٹ</p>
          <p>• Google Gemini API key</p>
          <p>• Git اور VS Code</p>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>
          {isUrdu ? 'ترتیب اور انسٹلیشن' : 'Installation Steps'}
        </h3>
        <div className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono space-y-2 overflow-x-auto'>
          <p>$ git clone https://github.com/yourusername/care-nexus.git</p>
          <p>$ cd care-nexus</p>
          <p>$ npm install # Install dependencies</p>
          <p>$ cp .env.example .env.local # Setup env vars</p>
          <p>$ npm run dev # Start development server</p>
        </div>
      </div>

      <div className='bg-green-50 border border-green-200 rounded-lg p-6'>
        <h3 className='font-semibold text-green-900 mb-2'>
          {isUrdu ? '✓ اب آپ تیار ہیں!' : "✓ You're Ready!"}
        </h3>
        <p className='text-sm text-green-800'>
          {isUrdu
            ? 'اب آپ http://localhost:3000 پر ڈیمو دیکھ سکتے ہیں'
            : 'Now you can see the demo at http://localhost:3000'}
        </p>
      </div>
    </section>
  );
}
