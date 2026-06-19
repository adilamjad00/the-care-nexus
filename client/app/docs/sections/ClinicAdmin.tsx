'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function ClinicAdmin({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'کلینک کا منتظم' : 'Clinic Admin Dashboard'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu ? 'مکمل کلینک منتظمانہ' : 'Complete clinic management system'}
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
        <div className='p-3 rounded-lg bg-blue-50 border border-blue-200 text-center'>
          <p className='text-lg font-bold text-blue-600'>📊</p>
          <p className='text-xs text-blue-900 mt-1'>Analytics</p>
        </div>
        <div className='p-3 rounded-lg bg-purple-50 border border-purple-200 text-center'>
          <p className='text-lg font-bold text-purple-600'>👥</p>
          <p className='text-xs text-purple-900 mt-1'>Staff Mgmt</p>
        </div>
        <div className='p-3 rounded-lg bg-green-50 border border-green-200 text-center'>
          <p className='text-lg font-bold text-green-600'>💰</p>
          <p className='text-xs text-green-900 mt-1'>Revenue</p>
        </div>
        <div className='p-3 rounded-lg bg-amber-50 border border-amber-200 text-center'>
          <p className='text-lg font-bold text-amber-600'>📅</p>
          <p className='text-xs text-amber-900 mt-1'>Schedules</p>
        </div>
      </div>

      <div className='space-y-3'>
        <h3 className='font-semibold text-gray-900'>Key Capabilities</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          <div className='p-3 border border-gray-200 rounded-lg text-sm text-gray-700'>
            • Manage doctors and staff
          </div>
          <div className='p-3 border border-gray-200 rounded-lg text-sm text-gray-700'>
            • View clinic analytics
          </div>
          <div className='p-3 border border-gray-200 rounded-lg text-sm text-gray-700'>
            • Revenue tracking
          </div>
          <div className='p-3 border border-gray-200 rounded-lg text-sm text-gray-700'>
            • Appointment management
          </div>
        </div>
      </div>
    </section>
  );
}
