'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function AutomationEngine({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'خودکار نظام' : 'Automation Engine'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'node-cron کے ساتھ خودکار نوکریاں'
            : 'Scheduled tasks with node-cron'}
        </p>
      </div>

      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-900'>Automated Jobs</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='p-4 border border-blue-200 rounded-lg bg-blue-50'>
            <h4 className='font-semibold text-blue-900 mb-2'>
              📅 Appointment Reminders
            </h4>
            <p className='text-sm text-blue-800'>
              Send reminders 24h before appointments
            </p>
          </div>
          <div className='p-4 border border-purple-200 rounded-lg bg-purple-50'>
            <h4 className='font-semibold text-purple-900 mb-2'>
              📞 Follow-up Calls
            </h4>
            <p className='text-sm text-purple-800'>
              Automated post-consultation follow-ups
            </p>
          </div>
          <div className='p-4 border border-green-200 rounded-lg bg-green-50'>
            <h4 className='font-semibold text-green-900 mb-2'>
              💊 Prescription Alerts
            </h4>
            <p className='text-sm text-green-800'>
              Notify patients about refill time
            </p>
          </div>
          <div className='p-4 border border-amber-200 rounded-lg bg-amber-50'>
            <h4 className='font-semibold text-amber-900 mb-2'>
              📊 Analytics Reports
            </h4>
            <p className='text-sm text-amber-800'>
              Generate daily clinic analytics
            </p>
          </div>
        </div>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700'>
        All jobs run on the backend server and are logged for monitoring
      </div>
    </section>
  );
}
