'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function DatabaseSchema({ isUrdu }: SectionProps) {
  const collections = [
    { name: 'Users', fields: 'id, email, password, role, profile' },
    { name: 'Doctors', fields: 'userId, specialty, schedule, ratings' },
    { name: 'Patients', fields: 'userId, healthTimeline, familyMembers' },
    { name: 'Appointments', fields: 'doctorId, patientId, dateTime, status' },
    {
      name: 'Prescriptions',
      fields: 'doctorId, patientId, medications, notes',
    },
    { name: 'Messages', fields: 'senderId, recipientId, content, timestamp' },
  ];

  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'ڈیٹا بیس' : 'Database Schema'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'MongoDB Atlas کی ساخت'
            : 'MongoDB Atlas collections and structure'}
        </p>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead className='bg-gray-100 border-b'>
            <tr>
              <th className='px-4 py-2 text-left font-semibold'>Collection</th>
              <th className='px-4 py-2 text-left font-semibold'>Key Fields</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col, i) => (
              <tr key={i} className='border-b hover:bg-gray-50'>
                <td className='px-4 py-2 font-semibold text-gray-900'>
                  {col.name}
                </td>
                <td className='px-4 py-2 text-gray-600 text-xs'>
                  {col.fields}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
        <p className='text-sm text-blue-900'>
          💾 All data is encrypted at rest and backed up daily to MongoDB Atlas
        </p>
      </div>
    </section>
  );
}
