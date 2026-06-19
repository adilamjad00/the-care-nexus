'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function DoctorPortal({ isUrdu }: SectionProps) {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/doctor/prescribe',
      desc: 'Create prescription from voice',
    },
    {
      method: 'GET',
      path: '/api/doctor/appointments',
      desc: 'Get doctor appointments',
    },
    {
      method: 'POST',
      path: '/api/doctor/schedule',
      desc: 'Update availability schedule',
    },
  ];

  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'ڈاکٹر کا پورٹل' : 'Doctor Portal'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'ڈاکٹر کے لیے مکمل منتظمانہ حل'
            : 'Complete administrative solution for doctors'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-4 rounded-lg bg-purple-50 border border-purple-200'>
          <p className='text-2xl font-bold text-purple-600'>50+</p>
          <p className='text-sm text-purple-900'>API Endpoints</p>
        </div>
        <div className='p-4 rounded-lg bg-blue-50 border border-blue-200'>
          <p className='text-2xl font-bold text-blue-600'>Voice AI</p>
          <p className='text-sm text-blue-900'>Prescription Generation</p>
        </div>
        <div className='p-4 rounded-lg bg-emerald-50 border border-emerald-200'>
          <p className='text-2xl font-bold text-emerald-600'>Real-time</p>
          <p className='text-sm text-emerald-900'>Patient Chat</p>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-100 border-b'>
            <tr>
              <th className='px-4 py-2 text-left'>Method</th>
              <th className='px-4 py-2 text-left'>Endpoint</th>
              <th className='px-4 py-2 text-left'>Description</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((ep, i) => (
              <tr key={i} className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2'>
                  <span className='font-mono text-xs bg-blue-100 px-2 py-1 rounded'>
                    {ep.method}
                  </span>
                </td>
                <td className='px-4 py-2 font-mono text-xs text-gray-600'>
                  {ep.path}
                </td>
                <td className='px-4 py-2 text-gray-600'>{ep.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
