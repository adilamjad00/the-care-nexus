'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function Notifications({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'اطلاعات' : 'Notifications System'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'فوری اور ای میل کی اطلاعات'
            : 'Real-time and email notifications'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-4 rounded-lg border border-blue-200 bg-blue-50'>
          <h3 className='font-bold text-blue-900 mb-2'>📱 In-App</h3>
          <p className='text-sm text-blue-800'>Real-time push notifications</p>
        </div>
        <div className='p-4 rounded-lg border border-purple-200 bg-purple-50'>
          <h3 className='font-bold text-purple-900 mb-2'>📧 Email</h3>
          <p className='text-sm text-purple-800'>Scheduled email alerts</p>
        </div>
        <div className='p-4 rounded-lg border border-green-200 bg-green-50'>
          <h3 className='font-bold text-green-900 mb-2'>⚙️ Smart</h3>
          <p className='text-sm text-green-800'>User preference based</p>
        </div>
      </div>

      <div className='space-y-3'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Notification Types
        </h3>
        <div className='space-y-2 text-sm'>
          <p className='flex items-start gap-2'>
            <span className='text-blue-500 font-bold'>•</span> Appointment
            confirmations
          </p>
          <p className='flex items-start gap-2'>
            <span className='text-blue-500 font-bold'>•</span> Prescription
            updates
          </p>
          <p className='flex items-start gap-2'>
            <span className='text-blue-500 font-bold'>•</span> Message arrivals
          </p>
          <p className='flex items-start gap-2'>
            <span className='text-blue-500 font-bold'>•</span> Doctor status
            changes
          </p>
          <p className='flex items-start gap-2'>
            <span className='text-blue-500 font-bold'>•</span> Clinic
            announcements
          </p>
        </div>
      </div>
    </section>
  );
}
