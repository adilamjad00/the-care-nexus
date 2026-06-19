export default function PrivacyPolicyContent() {
  return (
    <div className='max-w-4xl mx-auto space-y-8 p-6 bg-white rounded-2xl border border-black/5'>
      <h1 className='text-3xl font-bold text-text-primary'>Privacy Policy</h1>

      <p className='text-sm text-text-secondary'>
        Effective Date: {new Date().toLocaleDateString()}
      </p>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          1. Data Collection
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          At The Care Nexus, we collect information you directly provide us
          during account creation, appointment bookings, and consultations. This
          includes your name, email address, medical history, and clinical
          records.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          2. Usage of Data
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          Your data is strictly utilized to facilitate your healthcare journey,
          including sharing necessary records with your chosen physicians,
          processing transactions, and providing automated symptom inferences.
          We do not sell your personal data.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          3. Storage & Security
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          We maintain industry-standard security practices. Personal and
          clinical data are encrypted in transit and at rest within secure cloud
          environments. Only verifiable, authenticated users may access
          protected health information.
        </p>
      </section>

      <section className='space-y-4'>
        <h2 className='text-xl font-semibold text-text-primary'>
          4. User Rights
        </h2>
        <p className='text-text-secondary leading-relaxed'>
          Users reserve the right to access, rectify, or request the deletion of
          their personal data. Should you wish to permanently terminate your
          account and erase your records, you may do so by contacting our
          support line.
        </p>
      </section>
    </div>
  );
}
