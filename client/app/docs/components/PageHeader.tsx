'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  lastUpdated: string;
  readingTime: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  lastUpdated,
  readingTime,
}: PageHeaderProps) {
  return (
    <div className='space-y-6 border-b border-blue-100/30 pb-8'>
      {/* Breadcrumbs */}
      <div className='flex items-center gap-2 text-sm text-gray-600'>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className='flex items-center gap-2'>
            {crumb.href ? (
              <Link href={crumb.href} className='hover:text-blue-600 transition'>
                {crumb.label}
              </Link>
            ) : (
              <span className='text-gray-900 font-medium'>{crumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <ChevronRight size={16} className='text-gray-300' />
            )}
          </div>
        ))}
      </div>

      {/* Title & Description */}
      <div>
        <h1 className='text-4xl font-bold text-gray-900 mb-3'>{title}</h1>
        <p className='text-lg text-gray-700 leading-relaxed max-w-3xl'>
          {description}
        </p>
      </div>

      {/* Meta Info */}
      <div className='flex items-center gap-4 text-sm text-gray-500'>
        <span>📅 Updated: {lastUpdated}</span>
        <span>•</span>
        <span>⏱️ {readingTime}</span>
      </div>
    </div>
  );
}
