'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../components/DocLayout';
import { P, H2, UL, LI, InfoCard } from '../components/DocProse';
import { Mail, Github, BookOpen, MessageSquare } from 'lucide-react';

export default function SupportPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Support'
      titleUr='سپورٹ'
      description='Get help with The Care Nexus — bug reports, feature requests, and technical assistance.'
      breadcrumbs={[{ label: 'Support' }]}
      lastUpdated='June 2026'
      readingTime='3 min read'
    >
      <P>
        {isUrdu
          ? 'تکنیکی مدد، بگ رپورٹس اور فیچر ریکویسٹ کے لیے درج ذیل چینلز استعمال کریں۔'
          : 'The Care Nexus is an actively maintained project. If you encounter bugs, have questions, or want to request features, use the following support channels.'}
      </P>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 my-6'>
        {[
          {
            icon: Mail,
            title: isUrdu ? 'ای میل سپورٹ' : 'Email Support',
            desc: isUrdu
              ? 'براہ راست مدد کے لیے'
              : 'For direct support requests',
            link: 'mailto:support@carenexus.health',
            label: 'support@carenexus.health',
          },
          {
            icon: Github,
            title: 'GitHub Issues',
            desc: isUrdu
              ? 'بگ رپورٹس اور فیچر ریکویسٹ'
              : 'Bug reports and feature requests',
            link: 'https://github.com',
            label: isUrdu ? 'مسئلہ رپورٹ کریں' : 'Open an issue',
          },
          {
            icon: BookOpen,
            title: isUrdu ? 'دستاویزات' : 'Documentation',
            desc: isUrdu ? 'پہلے یہاں تلاش کریں' : 'Search these docs first',
            link: '/docs',
            label: isUrdu ? 'ڈاکس دیکھیں' : 'Browse docs',
          },
          {
            icon: MessageSquare,
            title: isUrdu ? 'ان-ایپ چیٹ' : 'In-App Chat',
            desc: isUrdu
              ? 'اگر سسٹم چل رہا ہو'
              : 'If you have a running instance',
            link: '/dashboard',
            label: isUrdu ? 'پلیٹ فارم کھولیں' : 'Go to platform',
          },
        ].map(({ icon: Icon, title, desc, link, label }) => (
          <a
            key={title}
            href={link}
            className='group flex gap-4 p-5 bg-white rounded-[18px] border border-[rgba(37,99,235,0.10)] shadow-[0_2px_8px_rgba(37,99,235,0.06)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.10)] hover:-translate-y-px transition-all no-underline'
          >
            <div className='w-10 h-10 rounded-[10px] bg-[rgba(37,99,235,0.08)] flex items-center justify-center shrink-0'>
              <Icon size={18} className='text-primary' />
            </div>
            <div>
              <p className='text-[13.5px] font-semibold text-text-primary'>
                {title}
              </p>
              <p className='text-[12px] text-text-muted mt-0.5'>{desc}</p>
              <p className='text-[12px] text-primary mt-1.5 group-hover:underline'>
                {label}
              </p>
            </div>
          </a>
        ))}
      </div>

      <H2>{isUrdu ? 'رابطہ کرنے سے پہلے' : 'Before Reaching Out'}</H2>
      <UL>
        <LI>
          {isUrdu
            ? 'سب سے پہلے FAQs چیک کریں — زیادہ تر سوالات وہاں موجود ہیں'
            : 'Check the FAQs page — most common questions are answered there'}
        </LI>
        <LI>
          {isUrdu
            ? 'براؤزر کنسول میں errors چیک کریں'
            : 'Check the browser console for JavaScript errors'}
        </LI>
        <LI>
          {isUrdu ? 'بیک اینڈ لاگز چیک کریں' : 'Check backend terminal logs'}
        </LI>
        <LI>
          {isUrdu
            ? 'environment variables صحیح ہیں یا نہیں verify کریں'
            : 'Verify all environment variables are correctly set'}
        </LI>
        <LI>
          {isUrdu
            ? 'MongoDB connection اور IP whitelist چیک کریں'
            : 'Confirm MongoDB connection string and IP whitelist'}
        </LI>
      </UL>

      <H2>{isUrdu ? 'بگ رپورٹ کیسے کریں' : 'Reporting Bugs'}</H2>
      <P>
        {isUrdu
          ? 'بگ رپورٹ کرتے وقت پلیٹ فارم، steps to reproduce، expected result، actual result اور errors لازمی شامل کریں۔'
          : 'When reporting a bug, include portal type, steps to reproduce, expected vs actual behavior, and error logs.'}
      </P>

      <InfoCard
        variant='tip'
        title={isUrdu ? 'سیکیورٹی مسائل' : 'Security vulnerabilities'}
      >
        {isUrdu
          ? 'سیکیورٹی مسائل public GitHub issues میں رپورٹ نہ کریں۔ ای میل کے ذریعے بھیجیں۔'
          : 'Do not report security vulnerabilities publicly. Email them directly to maintainers.'}
      </InfoCard>
    </DocLayout>
  );
}
