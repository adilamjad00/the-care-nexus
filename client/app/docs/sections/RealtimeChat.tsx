'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function RealtimeChat({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'لائیو چیٹ' : 'Real-Time Chat'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'Socket.io کے ساتھ فوری اور محفوظ'
            : 'Instant and secure messaging powered by Socket.io'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-4 rounded-lg border border-blue-200 bg-blue-50'>
          <h3 className='font-semibold text-blue-900 mb-2'>Architecture</h3>
          <p className='text-sm text-blue-800'>
            Direct WebSocket connections between clients and server
          </p>
        </div>
        <div className='p-4 rounded-lg border border-green-200 bg-green-50'>
          <h3 className='font-semibold text-green-900 mb-2'>Persistence</h3>
          <p className='text-sm text-green-800'>
            All messages stored in MongoDB for history
          </p>
        </div>
        <div className='p-4 rounded-lg border border-purple-200 bg-purple-50'>
          <h3 className='font-semibold text-purple-900 mb-2'>Encryption</h3>
          <p className='text-sm text-purple-800'>
            Message crypto utilities for data security
          </p>
        </div>
      </div>

      <div className='space-y-3'>
        <h3 className='text-lg font-semibold text-gray-900'>Socket Events</h3>
        <div className='bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono space-y-1'>
          <p>message:send → Emit message to room</p>
          <p>message:receive → Listen for incoming</p>
          <p>typing:start → Show typing indicator</p>
          <p>connection:status → Online/offline events</p>
        </div>
      </div>
    </section>
  );
}
