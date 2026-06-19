'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import {
  BookOpen,
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
  ChevronDown,
  ChevronRight,
  Search,
  CheckCircle2,
  LayoutDashboard,
  Calendar,
  FileText,
  MessageSquare,
  UserCog,
  BarChart3,
  DollarSign,
  Lock,
  KeyRound,
  Database,
  Server,
  Globe,
  ClipboardList,
  Brain,
} from 'lucide-react';

interface NavItem {
  label: string;
  labelUr: string;
  href: string;
  icon?: React.ElementType;
  children?: {
    label: string;
    labelUr: string;
    href: string;
    icon?: React.ElementType;
  }[];
}

const NAV: NavItem[] = [
  {
    label: 'Getting Started',
    labelUr: 'شروعات',
    href: '/docs/getting-started',
    icon: Rocket,
    children: [
      {
        label: 'Introduction',
        labelUr: 'تعارف',
        href: '/docs/getting-started/introduction',
        icon: BookOpen,
      },
      {
        label: 'Platform Overview',
        labelUr: 'پلیٹ فارم جائزہ',
        href: '/docs/getting-started/platform-overview',
        icon: Globe,
      },
      {
        label: 'Quick Start',
        labelUr: 'فوری آغاز',
        href: '/docs/getting-started/quick-start',
        icon: Rocket,
      },
    ],
  },
  {
    label: 'Patient Guide',
    labelUr: 'مریض گائیڈ',
    href: '/docs/patient-guide',
    icon: Users,
    children: [
      {
        label: 'Dashboard',
        labelUr: 'ڈیش بورڈ',
        href: '/docs/patient-guide/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Appointments',
        labelUr: 'ملاقاتیں',
        href: '/docs/patient-guide/appointments',
        icon: Calendar,
      },
      {
        label: 'Medical Vault',
        labelUr: 'طبی ریکارڈ',
        href: '/docs/patient-guide/medical-vault',
        icon: ClipboardList,
      },
      {
        label: 'Messaging',
        labelUr: 'پیغام رسانی',
        href: '/docs/patient-guide/messaging',
        icon: MessageSquare,
      },
    ],
  },
  {
    label: 'Doctor Guide',
    labelUr: 'ڈاکٹر گائیڈ',
    href: '/docs/doctor-guide',
    icon: Stethoscope,
    children: [
      {
        label: 'Dashboard',
        labelUr: 'ڈیش بورڈ',
        href: '/docs/doctor-guide/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Patients',
        labelUr: 'مریض',
        href: '/docs/doctor-guide/patients',
        icon: Users,
      },
      {
        label: 'Prescriptions',
        labelUr: 'نسخہ جات',
        href: '/docs/doctor-guide/prescriptions',
        icon: FileText,
      },
      {
        label: 'Schedule',
        labelUr: 'شیڈول',
        href: '/docs/doctor-guide/schedule',
        icon: Calendar,
      },
      {
        label: 'AI Assistant',
        labelUr: 'اے آئی معاون',
        href: '/docs/doctor-guide/ai-assistant',
        icon: Brain,
      },
    ],
  },
  {
    label: 'Clinic Administration',
    labelUr: 'کلینک انتظامیہ',
    href: '/docs/clinic-administration',
    icon: Building2,
    children: [
      {
        label: 'Dashboard',
        labelUr: 'ڈیش بورڈ',
        href: '/docs/clinic-administration/dashboard',
        icon: LayoutDashboard,
      },
      {
        label: 'Staff Management',
        labelUr: 'عملہ انتظام',
        href: '/docs/clinic-administration/staff-management',
        icon: UserCog,
      },
      {
        label: 'Revenue',
        labelUr: 'آمدنی',
        href: '/docs/clinic-administration/revenue',
        icon: DollarSign,
      },
      {
        label: 'Analytics',
        labelUr: 'تجزیات',
        href: '/docs/clinic-administration/analytics',
        icon: BarChart3,
      },
    ],
  },
  {
    label: 'Features',
    labelUr: 'خصوصیات',
    href: '/docs/features',
    icon: Zap,
    children: [
      {
        label: 'Appointments',
        labelUr: 'ملاقاتیں',
        href: '/docs/features/appointments',
        icon: Calendar,
      },
      {
        label: 'Prescriptions',
        labelUr: 'نسخہ جات',
        href: '/docs/features/prescriptions',
        icon: FileText,
      },
      {
        label: 'Records',
        labelUr: 'ریکارڈ',
        href: '/docs/features/records',
        icon: ClipboardList,
      },
      {
        label: 'Messaging',
        labelUr: 'پیغام رسانی',
        href: '/docs/features/messaging',
        icon: MessageSquare,
      },
    ],
  },
  {
    label: 'Security',
    labelUr: 'سیکیورٹی',
    href: '/docs/security',
    icon: Shield,
    children: [
      {
        label: 'Privacy',
        labelUr: 'رازداری',
        href: '/docs/security/privacy',
        icon: Lock,
      },
      {
        label: 'Encryption',
        labelUr: 'خفیہ کاری',
        href: '/docs/security/encryption',
        icon: KeyRound,
      },
      {
        label: 'Access Control',
        labelUr: 'رسائی کنٹرول',
        href: '/docs/security/access-control',
        icon: Shield,
      },
    ],
  },
  {
    label: 'Architecture',
    labelUr: 'فن تعمیر',
    href: '/docs/architecture',
    icon: Cpu,
    children: [
      {
        label: 'System Design',
        labelUr: 'سسٹم ڈیزائن',
        href: '/docs/architecture/system-design',
        icon: Cpu,
      },
      {
        label: 'Database',
        labelUr: 'ڈیٹا بیس',
        href: '/docs/architecture/database',
        icon: Database,
      },
      {
        label: 'API',
        labelUr: 'اے پی آئی',
        href: '/docs/architecture/api',
        icon: Server,
      },
      {
        label: 'Deployment',
        labelUr: 'تعیناتی',
        href: '/docs/architecture/deployment',
        icon: Globe,
      },
    ],
  },
  {
    label: 'API Reference',
    labelUr: 'اے پی آئی حوالہ',
    href: '/docs/api-reference',
    icon: Code2,
  },
  {
    label: 'FAQs',
    labelUr: 'عمومی سوالات',
    href: '/docs/faqs',
    icon: HelpCircle,
  },
  {
    label: 'Support',
    labelUr: 'سپورٹ',
    href: '/docs/support',
    icon: Headphones,
  },
];

export default function DocsSidebar() {
  const pathname = usePathname();
  const locale = useLocale();
  const isUrdu = locale === 'ur';

  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    NAV.forEach((item) => {
      if (item.children) {
        init[item.href] =
          item.children.some(
            (c) => pathname === c.href || pathname.startsWith(c.href),
          ) ||
          pathname === item.href ||
          pathname.startsWith(item.href + '/');
      }
    });
    return init;
  });

  const toggle = (href: string) =>
    setOpen((prev) => ({ ...prev, [href]: !prev[href] }));

  const isActive = (href: string) => pathname === href;
  const isSectionActive = (item: NavItem) =>
    pathname === item.href ||
    pathname.startsWith(item.href + '/') ||
    item.children?.some(
      (c) => pathname === c.href || pathname.startsWith(c.href),
    );

  return (
    <div className='flex flex-col h-full bg-white border-r border-[rgba(37,99,235,0.10)]'>
      {/* Search */}
      <div className='px-4 pt-5 pb-3'>
        <div className='flex items-center gap-2 rounded-md border-primary focus-within:border-primary/80 focus-within:shadow-md transition-all'>
          {/* <Search className='w-4 h-4 text-primary/70 shrink-0' /> */}

          <input
            type='text'
            placeholder={isUrdu ? 'تلاش کریں...' : 'Search docs...'}
            className='w-full bg-transparent border-none outline-none px-3 py-1.5 text-[13px] text-text-primary placeholder:text-text-secondary'
          />
        </div>
      </div>

      {/* Nav */}
      <nav className='flex-1 overflow-y-auto px-3 pb-4 space-y-0.5'>
        {NAV.map((item) => {
          const Icon = item.icon;
          const sectionActive = isSectionActive(item);
          const isOpen = open[item.href];

          if (!item.children) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  'flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all',
                  isActive(item.href)
                    ? 'bg-linear-to-r from-[rgba(37,99,235,0.12)] to-[rgba(106,191,243,0.10)] text-primary font-semibold border-l-[3px] border-primary'
                    : 'text-text-secondary hover:bg-[rgba(37,99,235,0.05)] hover:text-text-primary',
                ].join(' ')}
              >
                {Icon && <Icon size={15} className='shrink-0' />}
                <span>{isUrdu ? item.labelUr : item.label}</span>
              </Link>
            );
          }

          return (
            <div key={item.href}>
              <button
                onClick={() => toggle(item.href)}
                className={[
                  'w-full flex items-center justify-between gap-2 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-all',
                  sectionActive
                    ? 'bg-linear-to-r from-[rgba(37,99,235,0.10)] to-[rgba(106,191,243,0.07)] text-primary font-semibold border-l-[3px] border-primary'
                    : 'text-text-secondary hover:bg-[rgba(37,99,235,0.05)] hover:text-text-primary',
                ].join(' ')}
              >
                <span className='flex items-center gap-2.5'>
                  {Icon && <Icon size={15} className='shrink-0' />}
                  {isUrdu ? item.labelUr : item.label}
                </span>
                {isOpen ? (
                  <ChevronDown size={13} className='shrink-0 opacity-60' />
                ) : (
                  <ChevronRight size={13} className='shrink-0 opacity-60' />
                )}
              </button>

              {isOpen && (
                <div className='ml-4 mt-0.5 space-y-0.5 border-l border-[rgba(37,99,235,0.12)] pl-3'>
                  {item.children.map((child) => {
                    const CIcon = child.icon;
                    const childActive = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={[
                          'flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12.5px] transition-all',
                          childActive
                            ? 'bg-[rgba(37,99,235,0.09)] text-primary font-semibold border-l-2 border-primary -ml-3.75 pl-3.25'
                            : 'text-text-secondary hover:bg-[rgba(37,99,235,0.05)] hover:text-primary',
                        ].join(' ')}
                      >
                        {CIcon && (
                          <CIcon size={13} className='shrink-0 opacity-70' />
                        )}
                        <span>{isUrdu ? child.labelUr : child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className='px-4 py-4 border-t border-[rgba(37,99,235,0.08)] bg-[#EFF4FB]/50'>
        <p className='text-[11px] text-text-muted font-medium'>
          The Care Nexus Docs v1.0.0
        </p>
        <span className='inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[rgba(154,224,114,0.18)] text-[#3A7A1A] text-[10px] font-bold rounded-full border border-[rgba(154,224,114,0.35)]'>
          <CheckCircle2 size={9} />
          Production
        </span>
      </div>
    </div>
  );
}
