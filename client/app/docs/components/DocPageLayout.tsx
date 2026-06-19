'use client';

import PageHeader from '../components/PageHeader';
import { useLocale } from 'next-intl';

interface DocPageProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  lastUpdated: string;
  readingTime: string;
  children: React.ReactNode;
}

export default function DocLayout({
  title,
  description,
  breadcrumbs,
  lastUpdated,
  readingTime,
  children,
}: DocPageProps) {
  const locale = useLocale();
  const isUrdu = locale === 'ur';

  return (
    <div className='space-y-8'>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
        lastUpdated={lastUpdated}
        readingTime={readingTime}
      />

      {/* Content */}
      <div className='prose prose-sm max-w-none'>{children}</div>
    </div>
  );
}
