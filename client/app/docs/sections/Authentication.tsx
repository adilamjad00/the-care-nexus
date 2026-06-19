'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function Authentication({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'سیکیورٹی اور تثقیق' : 'Authentication & Security'}
        </h2>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>
          JWT-Based Authentication
        </h3>
        <p className='text-gray-700'>
          Access Token (15 min) + Refresh Token (7 days) stored in Redis
        </p>
        <div className='bg-blue-50 p-4 rounded-lg border border-blue-200 text-sm space-y-1'>
          <p className='text-blue-900'>✓ Password hashing with bcrypt</p>
          <p className='text-blue-900'>✓ Role-based access control (RBAC)</p>
          <p className='text-blue-900'>
            ✓ API key verification for external calls
          </p>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>User Roles</h3>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='p-4 border border-gray-200 rounded-lg'>
            <h4 className='font-semibold text-gray-900 mb-2'>Doctor</h4>
            <p className='text-sm text-gray-600'>
              Prescriptions, appointments, chat
            </p>
          </div>
          <div className='p-4 border border-gray-200 rounded-lg'>
            <h4 className='font-semibold text-gray-900 mb-2'>Patient</h4>
            <p className='text-sm text-gray-600'>
              Bookings, records, health timeline
            </p>
          </div>
          <div className='p-4 border border-gray-200 rounded-lg'>
            <h4 className='font-semibold text-gray-900 mb-2'>Clinic Admin</h4>
            <p className='text-sm text-gray-600'>
              Staff management, analytics, revenue
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
