'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function AIIntegration({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'AI انضمام' : 'AI Integration'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu
            ? 'Gemini اور GROQ کے ساتھ'
            : 'Powered by Google Gemini & GROQ APIs'}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='p-6 rounded-lg border border-blue-200 bg-blue-50'>
          <h3 className='font-bold text-blue-900 mb-3'>Google Gemini</h3>
          <ul className='text-sm text-blue-800 space-y-2'>
            <li>✓ Chat conversations</li>
            <li>✓ Medical query analysis</li>
            <li>✓ Prescription parsing</li>
            <li>✓ Context understanding</li>
          </ul>
        </div>
        <div className='p-6 rounded-lg border border-purple-200 bg-purple-50'>
          <h3 className='font-bold text-purple-900 mb-3'>GROQ API</h3>
          <ul className='text-sm text-purple-800 space-y-2'>
            <li>✓ Speech-to-text transcription</li>
            <li>✓ Real-time audio processing</li>
            <li>✓ Multiple language support</li>
            <li>✓ Fast inference</li>
          </ul>
        </div>
      </div>

      <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
        <p className='text-sm text-yellow-900'>
          💡 Voice prescriptions are transcribed via GROQ, then analyzed by
          Gemini for structured extraction
        </p>
      </div>
    </section>
  );
}
