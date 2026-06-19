'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function Architecture({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'نظام کی تعمیر' : 'System Architecture'}
        </h2>
        <p className='text-lg text-gray-700 leading-relaxed'>
          {isUrdu
            ? 'مختلف حصوں میں منقسم نظام کی ساخت'
            : 'The platform is structured in multiple layers for scalability and maintainability'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-6 rounded-lg border border-blue-200 bg-blue-50'>
          <h3 className='font-semibold text-gray-900 mb-3'>Client Layer</h3>
          <ul className='text-sm text-gray-700 space-y-2'>
            <li>• Doctor Portal (Next.js)</li>
            <li>• Patient Portal (Next.js)</li>
            <li>• Admin Portal (Next.js)</li>
            <li>• Real-time UI updates</li>
          </ul>
        </div>

        <div className='p-6 rounded-lg border border-purple-200 bg-purple-50'>
          <h3 className='font-semibold text-gray-900 mb-3'>API Layer</h3>
          <ul className='text-sm text-gray-700 space-y-2'>
            <li>• Express.js REST APIs</li>
            <li>• JWT authentication</li>
            <li>• Role-based authorization</li>
            <li>• Socket.io server</li>
          </ul>
        </div>

        <div className='p-6 rounded-lg border border-emerald-200 bg-emerald-50'>
          <h3 className='font-semibold text-gray-900 mb-3'>Data Layer</h3>
          <ul className='text-sm text-gray-700 space-y-2'>
            <li>• MongoDB Atlas</li>
            <li>• Redis Cache</li>
            <li>• Session storage</li>
            <li>• Rate limiting</li>
          </ul>
        </div>
      </div>

      <div className='bg-gray-50 p-6 rounded-lg border border-gray-200'>
        <p className='text-sm text-gray-700 mb-4'>
          {isUrdu
            ? 'تمام حصے microservices طریقے سے الگ الگ کام کرتے ہیں اور API کے ذریعے آپس میں بات کرتے ہیں'
            : 'All layers communicate through well-defined REST APIs and WebSocket connections for real-time updates'}
        </p>
        <p className='text-xs text-gray-600'>
          → Scalable | Maintainable | Secure | Real-time capable
        </p>
      </div>
    </section>
  );
}
