'use client';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import {
  Rocket,
  Users,
  Stethoscope,
  Building2,
  Zap,
  Shield,
  Cpu,
  Code2,
  HelpCircle,
  Headphones,
  ArrowRight,
} from 'lucide-react';

const cards = [
  {
    icon: Rocket,
    label: 'Getting Started',
    labelUr: 'شروعات',
    href: '/docs/getting-started/introduction',
    desc: 'Set up your environment, create accounts, and explore the platform.',
    descUr:
      'اپنا ماحول سیٹ اپ کریں، اکاؤنٹ بنائیں، اور پلیٹ فارم کے بنیادی فیچرز کو سمجھیں۔',
  },
  {
    icon: Users,
    label: 'Patient Guide',
    labelUr: 'مریض گائیڈ',
    href: '/docs/patient-guide/dashboard',
    desc: 'Book appointments, view records, chat with doctors, manage family.',
    descUr:
      'اپائنٹمنٹس بک کریں، میڈیکل ریکارڈ دیکھیں، ڈاکٹروں سے چیٹ کریں اور فیملی کو منیج کریں۔',
  },
  {
    icon: Stethoscope,
    label: 'Doctor Guide',
    labelUr: 'ڈاکٹر گائیڈ',
    href: '/docs/doctor-guide/dashboard',
    desc: 'Manage patients, create prescriptions, set schedules, use AI tools.',
    descUr:
      'مریضوں کو منیج کریں، نسخے بنائیں، شیڈول ترتیب دیں اور AI ٹولز استعمال کریں۔',
  },
  {
    icon: Building2,
    label: 'Clinic Administration',
    labelUr: 'کلینک انتظامیہ',
    href: '/docs/clinic-administration/dashboard',
    desc: 'Oversee doctors, staff, revenue analytics, and clinic settings.',
    descUr:
      'ڈاکٹرز، اسٹاف، آمدنی کے تجزیے اور کلینک سیٹنگز کو مکمل طور پر منیج کریں۔',
  },
  {
    icon: Zap,
    label: 'Features',
    labelUr: 'خصوصیات',
    href: '/docs/features/appointments',
    desc: 'Deep dives into appointments, prescriptions, records and messaging.',
    descUr: 'اپائنٹمنٹس، نسخوں، ریکارڈز اور میسجنگ سسٹم کی مکمل تفصیلات۔',
  },
  {
    icon: Shield,
    label: 'Security',
    labelUr: 'سیکیورٹی',
    href: '/docs/security/privacy',
    desc: 'JWT auth, bcrypt, Redis sessions, encryption, and access control.',
    descUr:
      'JWT authentication، bcrypt encryption، Redis sessions اور مکمل سیکیورٹی کنٹرول۔',
  },
  {
    icon: Cpu,
    label: 'Architecture',
    labelUr: 'فن تعمیر',
    href: '/docs/architecture/system-design',
    desc: 'System design, database schema, APIs, and deployment infrastructure.',
    descUr:
      'سسٹم ڈیزائن، ڈیٹا بیس اسکیما، APIs اور ڈیپلائمنٹ انفراسٹرکچر کی تفصیل۔',
  },
  {
    icon: Code2,
    label: 'API Reference',
    labelUr: 'اے پی آئی حوالہ',
    href: '/docs/api-reference',
    desc: 'Complete REST API documentation with endpoints and schemas.',
    descUr:
      'مکمل REST API ڈاکیومنٹیشن جس میں endpoints اور data schemas شامل ہیں۔',
  },
  {
    icon: HelpCircle,
    label: 'FAQs',
    labelUr: 'عمومی سوالات',
    href: '/docs/faqs',
    desc: 'Common questions about setup, features, and troubleshooting.',
    descUr:
      'سیٹ اپ، فیچرز اور مسائل کے حل سے متعلق عام پوچھے جانے والے سوالات۔',
  },
  {
    icon: Headphones,
    label: 'Support',
    labelUr: 'سپورٹ',
    href: '/docs/support',
    desc: 'Contact the team, report issues, and access help resources.',
    descUr:
      'ٹیم سے رابطہ کریں، مسائل رپورٹ کریں اور ہیلپ ریسورسز تک رسائی حاصل کریں۔',
  },
];

export default function DocsIndex() {
  const locale = useLocale();
  const isUrdu = locale === 'ur';

  return (
    <div>
      {/* Hero */}
      <div className='mb-10 pb-8 border-b border-[rgba(37,99,235,0.08)]'>
        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-muted text-primary text-[11px] font-semibold uppercase tracking-wider mb-4'>
          Documentation
        </div>

        <h1 className='text-[2rem] font-bold text-text-primary leading-tight mb-3'>
          {isUrdu ? 'دی کیئر نیکسس دستاویزات' : 'The Care Nexus Docs'}
        </h1>

        <p className='text-[15px] text-text-secondary leading-relaxed max-w-2xl'>
          {isUrdu
            ? 'ڈاکٹروں، مریضوں اور کلینک منتظمین کے لیے مکمل پلیٹ فارم گائیڈ۔'
            : 'Complete guides, API references, and architecture documentation for doctors, patients, and clinic administrators using The Care Nexus platform.'}
        </p>
      </div>

      {/* Cards grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {cards.map(({ icon: Icon, label, labelUr, href, desc, descUr }) => (
          <Link
            key={href}
            href={href}
            className='group flex flex-col gap-3 p-5 bg-white rounded-[18px] border border-[rgba(37,99,235,0.10)] shadow-[0_2px_12px_rgba(37,99,235,0.06)] hover:shadow-[0_6px_24px_rgba(37,99,235,0.10)] hover:-translate-y-px transition-all'
          >
            <div className='flex items-center justify-between'>
              <div className='w-9 h-9 rounded-[10px] bg-[rgba(37,99,235,0.08)] flex items-center justify-center'>
                <Icon size={17} className='text-primary' />
              </div>

              <ArrowRight
                size={14}
                className='text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all'
              />
            </div>

            <div>
              <p className='text-[14px] font-semibold text-text-primary mb-1'>
                {isUrdu ? labelUr : label}
              </p>

              <p className='text-[12.5px] text-text-secondary leading-relaxed'>
                {isUrdu ? descUr : desc}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
