'use client';

interface SectionProps {
  isUrdu: boolean;
}

export default function DesignSystem({ isUrdu }: SectionProps) {
  return (
    <section className='space-y-8'>
      <div>
        <h2 className='text-3xl font-bold text-gray-900 mb-4'>
          {isUrdu ? 'ڈیزائن سسٹم' : 'Design System'}
        </h2>
        <p className='text-lg text-gray-700'>
          {isUrdu ? 'Tailwind CSS v4 کے ساتھ' : 'Built with Tailwind CSS v4'}
        </p>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        <div className='space-y-2'>
          <p className='text-xs font-semibold text-gray-500 uppercase'>
            Colors
          </p>
          <div className='space-y-1'>
            <div className='h-6 rounded bg-blue-600' />
            <div className='h-6 rounded bg-green-600' />
            <div className='h-6 rounded bg-purple-600' />
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-xs font-semibold text-gray-500 uppercase'>
            Spacing
          </p>
          <div className='space-y-1 text-xs text-gray-600'>
            <p>4px, 8px, 16px</p>
            <p>24px, 32px</p>
            <p>48px, 64px</p>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-xs font-semibold text-gray-500 uppercase'>
            Typography
          </p>
          <div className='space-y-1 text-xs'>
            <p className='text-xs'>Small</p>
            <p className='text-sm'>Regular</p>
            <p className='text-base font-semibold'>Semibold</p>
          </div>
        </div>

        <div className='space-y-2'>
          <p className='text-xs font-semibold text-gray-500 uppercase'>
            Radius
          </p>
          <div className='space-y-1 text-xs text-gray-600'>
            <p>4px - Small</p>
            <p>8px - Medium</p>
            <p>12px - Large</p>
          </div>
        </div>
      </div>

      <div className='bg-linear-to-br from-blue-50 via-white to-blue-100 p-6 rounded-lg border border-blue-100'>
        <p className='text-sm font-semibold text-gray-900 mb-2'>
          Primary Gradient
        </p>
        <p className='text-xs text-gray-600'>
          from-blue-50 via-white to-blue-100
        </p>
      </div>
    </section>
  );
}
