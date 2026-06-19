'use client';

import { useLocale } from 'next-intl';
import { ChevronRight, Clock, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface DocLayoutProps {
  children: React.ReactNode;
  title: string;
  titleUr?: string;
  description?: string;
  descriptionUr?: string;
  breadcrumbs: BreadcrumbItem[];
  lastUpdated?: string;
  readingTime?: string;
}

export default function DocLayout({
  children,
  title,
  titleUr,
  description,
  descriptionUr,
  breadcrumbs,
  lastUpdated = 'June 2026',
  readingTime = '5 min read',
}: DocLayoutProps) {
  const locale = useLocale();
  const isUrdu = locale === 'ur';

  const displayTitle = isUrdu && titleUr ? titleUr : title;
  const displayDesc = isUrdu && descriptionUr ? descriptionUr : description;

  return (
    <article className='min-h-full'>
      {/* Breadcrumb */}
      <nav className='flex items-center gap-1.5 text-[12px] text-text-muted mb-6 flex-wrap'>
        <Link href='/' className='hover:text-primary transition-colors'>
          <Home size={12} />
        </Link>
        <ChevronRight size={11} className='opacity-40' />
        <Link href='/docs' className='hover:text-primary transition-colors'>
          Docs
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className='flex items-center gap-1.5'>
            <ChevronRight size={11} className='opacity-40' />
            {crumb.href ? (
              <Link
                href={crumb.href}
                className='hover:text-primary transition-colors'
              >
                {crumb.label}
              </Link>
            ) : (
              <span className='text-text-secondary font-medium'>
                {crumb.label}
              </span>
            )}
          </span>
        ))}
      </nav>

      {/* Page header */}
      <div className='mb-8 pb-6 border-b border-[rgba(37,99,235,0.08)]'>
        <h1
          className={`font-bold text-text-primary leading-tight mb-3 ${isUrdu ? 'text-2xl font-urdu' : 'text-[1.875rem]'}`}
        >
          {displayTitle}
        </h1>
        {displayDesc && (
          <p
            className={`text-text-secondary leading-relaxed max-w-2xl ${isUrdu ? 'text-base font-urdu' : 'text-[15px]'}`}
          >
            {displayDesc}
          </p>
        )}
        <div className='flex items-center gap-4 mt-4 text-[12px] text-text-muted'>
          <span className='flex items-center gap-1.5'>
            <RefreshCw size={11} /> Updated {lastUpdated}
          </span>
          <span className='flex items-center gap-1.5'>
            <Clock size={11} /> {readingTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`prose-docs space-y-6 ${isUrdu ? 'font-urdu' : ''}`}>
        {children}
      </div>
    </article>
  );
}
