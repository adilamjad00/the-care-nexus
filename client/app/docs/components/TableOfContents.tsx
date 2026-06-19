'use client';

import { AlertCircle } from 'lucide-react';

interface TableOfContentsProps {
  sections: { id: string; label: string }[];
  activeSection: string;
  isUrdu: boolean;
}

export default function TableOfContents({
  sections,
  activeSection,
  isUrdu,
}: TableOfContentsProps) {
  return (
    <div className='px-4 py-6 space-y-4'>
      <h3 className='text-xs font-bold text-gray-500 uppercase tracking-wider'>
        {isUrdu ? 'اس صفحہ پر' : 'On this page'}
      </h3>

      <nav className='space-y-2'>
        {sections.slice(0, 10).map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`block text-sm transition-colors ${
              activeSection === section.id
                ? 'text-blue-600 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {section.label}
          </a>
        ))}
      </nav>

      {/* Help Box */}
      <div className='mt-6 pt-4 border-t border-blue-100/50'>
        <div className='p-3 rounded-lg bg-blue-50 border border-blue-100'>
          <div className='flex items-start gap-2'>
            <AlertCircle size={16} className='text-blue-600 mt-0.5 shrink-0' />
            <div className='text-sm text-blue-800'>
              <p className='font-medium mb-1'>
                {isUrdu ? 'مسئلہ ہو؟' : 'Need help?'}
              </p>
              <p className='text-xs'>
                {isUrdu
                  ? 'ہماری سپورٹ ٹیم سے رابطہ کریں'
                  : 'Contact our support team'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
