'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Users,
  Stethoscope,
  Hospital,
  Zap,
  Lock,
  Layers,
  Code2,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  title: string;
  icon: React.ReactNode;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Getting Started',
    icon: <BookOpen size={18} />,
    items: [
      { label: 'Introduction', href: '/docs/getting-started/introduction' },
      {
        label: 'Platform Overview',
        href: '/docs/getting-started/platform-overview',
      },
      { label: 'Quick Start', href: '/docs/getting-started/quick-start' },
    ],
  },
  {
    title: 'Patient Guide',
    icon: <Users size={18} />,
    items: [
      { label: 'Dashboard', href: '/docs/patient-guide/dashboard' },
      { label: 'Appointments', href: '/docs/patient-guide/appointments' },
      { label: 'Medical Vault', href: '/docs/patient-guide/medical-vault' },
      { label: 'Messaging', href: '/docs/patient-guide/messaging' },
    ],
  },
  {
    title: 'Doctor Guide',
    icon: <Stethoscope size={18} />,
    items: [
      { label: 'Dashboard', href: '/docs/doctor-guide/dashboard' },
      { label: 'Patients', href: '/docs/doctor-guide/patients' },
      { label: 'Prescriptions', href: '/docs/doctor-guide/prescriptions' },
      { label: 'Schedule', href: '/docs/doctor-guide/schedule' },
      { label: 'AI Assistant', href: '/docs/doctor-guide/ai-assistant' },
    ],
  },
  {
    title: 'Clinic Administration',
    icon: <Hospital size={18} />,
    items: [
      { label: 'Dashboard', href: '/docs/clinic-administration/dashboard' },
      {
        label: 'Staff Management',
        href: '/docs/clinic-administration/staff-management',
      },
      { label: 'Revenue', href: '/docs/clinic-administration/revenue' },
      { label: 'Analytics', href: '/docs/clinic-administration/analytics' },
    ],
  },
  {
    title: 'Features',
    icon: <Zap size={18} />,
    items: [
      { label: 'Appointments', href: '/docs/features/appointments' },
      { label: 'Prescriptions', href: '/docs/features/prescriptions' },
      { label: 'Records', href: '/docs/features/records' },
      { label: 'Messaging', href: '/docs/features/messaging' },
    ],
  },
  {
    title: 'Security',
    icon: <Lock size={18} />,
    items: [
      { label: 'Privacy', href: '/docs/security/privacy' },
      { label: 'Encryption', href: '/docs/security/encryption' },
      { label: 'Access Control', href: '/docs/security/access-control' },
    ],
  },
  {
    title: 'Architecture',
    icon: <Layers size={18} />,
    items: [
      { label: 'System Design', href: '/docs/architecture/system-design' },
      { label: 'Database', href: '/docs/architecture/database' },
      { label: 'APIs', href: '/docs/architecture/api' },
      { label: 'Deployment', href: '/docs/architecture/deployment' },
    ],
  },
  {
    title: 'API Reference',
    icon: <Code2 size={18} />,
    items: [{ label: 'Overview', href: '/docs/api-reference' }],
  },
  {
    title: 'FAQs',
    icon: <HelpCircle size={18} />,
    items: [{ label: 'Common Questions', href: '/docs/faqs' }],
  },
  {
    title: 'Support',
    icon: <MessageSquare size={18} />,
    items: [{ label: 'Contact Us', href: '/docs/support' }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSection = (index: number) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpenSections(newOpen);
  };

  const isItemActive = (href: string) => pathname === href;
  const isSectionActive = (items: NavItem[]) =>
    items.some((item) =>
      pathname.startsWith(item.href.split('/').slice(0, -1).join('/')),
    );

  return (
    <div className='h-screen flex flex-col bg-white border-r border-blue-100/50 overflow-hidden'>
      {/* Header */}
      <div className='px-4 py-6 border-b border-blue-100/30'>
        <div className='flex items-center gap-2 mb-4'>
          <div className='w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center'>
            <BookOpen size={18} className='text-white' />
          </div>
          <span className='font-bold text-gray-900'>Care Nexus</span>
        </div>
        <p className='text-xs text-gray-500'>Documentation</p>
      </div>

      {/* Search */}
      <div className='px-3 py-3 border-b border-blue-100/30'>
        <div className='relative'>
          <Search size={16} className='absolute left-3 top-2.5 text-gray-400' />
          <input
            type='text'
            placeholder='Search docs...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-9 pr-3 py-2 rounded-lg border border-blue-100 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 overflow-y-auto px-2 py-4 space-y-1'>
        {navSections.map((section, sectionIndex) => {
          const isOpen = openSections.has(sectionIndex);
          const hasActive = isSectionActive(section.items);

          return (
            <div key={section.title}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(sectionIndex)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  hasActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className='flex items-center gap-2.5'>
                  <span
                    className={hasActive ? 'text-blue-600' : 'text-gray-500'}
                  >
                    {section.icon}
                  </span>
                  <span>{section.title}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Sub Items */}
              {isOpen && (
                <div className='mt-1 space-y-0.5 ml-2'>
                  {section.items.map((item) => {
                    const isActive = isItemActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive
                            ? 'bg-blue-100 text-blue-700 font-medium border-l-2 border-blue-600 pl-2.5'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        {isActive && (
                          <div className='w-1.5 h-1.5 bg-blue-600 rounded-full mr-2.5' />
                        )}
                        {item.label}
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
      <div className='px-4 py-4 border-t border-blue-100/30 text-xs text-gray-500 space-y-2'>
        <div className='flex items-center justify-between'>
          <span>The Care Nexus Docs</span>
          <span className='text-green-600 font-semibold'>Production</span>
        </div>
        <p>v1.0.0</p>
      </div>
    </div>
  );
}
