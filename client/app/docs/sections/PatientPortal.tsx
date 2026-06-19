'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function PatientPortal({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'مریض کا پورٹل' : 'Patient Portal'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'مریض کے لیے صحت کی نگرانی'
            : 'Health management for patients'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div className='p-4 rounded-lg bg-green-50 border border-green-200'>
          <h3 className='font-semibold text-green-900 mb-1'>Appointments</h3>
          <p className='text-sm text-green-800'>Book & manage consultations</p>
        </div>
        <div className='p-4 rounded-lg bg-blue-50 border border-blue-200'>
          <h3 className='font-semibold text-blue-900 mb-1'>Medical Records</h3>
          <p className='text-sm text-blue-800'>
            Access prescriptions & history
          </p>
        </div>
        <div className='p-4 rounded-lg bg-purple-50 border border-purple-200'>
          <h3 className='font-semibold text-purple-900 mb-1'>Real-time Chat</h3>
          <p className='text-sm text-purple-800'>Communicate with doctors</p>
        </div>
      </div>

      <div className='bg-blue-50 p-6 rounded-lg border border-blue-200'>
        <h3 className='font-semibold text-blue-900 mb-3'>Features</h3>
        <ul className='text-sm text-blue-800 space-y-2'>
          <li>✓ Health Timeline - Track medical events</li>
          <li>✓ Family Members - Add dependents to your account</li>
          <li>✓ Prescription History - View all medications</li>
          <li>✓ Doctor Directory - Find specialists</li>
        </ul>
      </div>
    </section>
  );
}
