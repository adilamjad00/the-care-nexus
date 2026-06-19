'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function ProjectStructure({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'پروجیکٹ کی ساخت' : 'Project Structure'}
        </h2>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>
          Frontend (/client)
        </h3>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm font-mono text-gray-700'>
          <p>app/ - Next.js App Router pages</p>
          <p>├── dashboard/ - Doctor & Patient dashboards</p>
          <p>├── clinic/ - Clinic management</p>
          <p>├── docs/ - Documentation portal</p>
          <p>components/ - Reusable React components</p>
          <p>hooks/ - Custom React hooks</p>
          <p>store/ - Redux Toolkit slices</p>
          <p>lib/ - Utilities and helpers</p>
        </div>
      </div>

      <div className='space-y-4'>
        <h3 className='text-xl font-semibold text-gray-900'>Backend (/api)</h3>
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm font-mono text-gray-700'>
          <p>controllers/ - Request handlers</p>
          <p>├── doctorController.js</p>
          <p>├── patientController.js</p>
          <p>├── clinicController.js</p>
          <p>models/ - MongoDB schemas</p>
          <p>routes/ - API endpoints</p>
          <p>services/ - Business logic</p>
          <p>middleware/ - Auth & error handling</p>
          <p>config/ - Database & external services</p>
        </div>
      </div>
    </section>
  );
}
