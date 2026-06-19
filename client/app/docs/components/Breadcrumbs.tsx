'use client';

import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  section: string;
  isUrdu: boolean;
}

export default function Breadcrumbs({ section, isUrdu }: BreadcrumbsProps) {
  return (
    <div className='flex items-center gap-2 text-sm text-gray-500 mb-6'>
      <span className='hover:text-blue-600 cursor-pointer transition'>
        {isUrdu ? 'ہوم' : 'Home'}
      </span>
      <ChevronRight size={16} className='text-gray-300' />
      <span className='hover:text-blue-600 cursor-pointer transition'>
        {isUrdu ? 'دستاویزات' : 'Docs'}
      </span>
      <ChevronRight size={16} className='text-gray-300' />
      <span className='text-blue-600 font-medium'>{section}</span>
    </div>
  );
}
