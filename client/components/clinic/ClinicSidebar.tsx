'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  UserCog,
  ChevronLeft,
  ChevronRight,
  LogOut,
  DollarSign,
  Sparkles,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import LayoutDashboardIcon from '@/icons/layout-dashboard-icon';
import UsersIcon from '@/icons/users-icon';
import UserIcon from '@/icons/user-icon';
import MagnifierIcon from '@/icons/magnifier-icon';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { RootState } from '@/store/store';
import { useTranslations } from 'next-intl';

export default function ClinicSidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const isCollapsed = useSelector(
    (state: RootState) => state.ui.sidebarCollapsed,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    {
      href: '/dashboard/clinic_admin',
      label: t('nav.dashboard'),
      icon: LayoutDashboardIcon,
    },
    {
      href: '/dashboard/clinic_admin/doctors',
      label: t('nav.doctors'),
      icon: UsersIcon,
    },
    {
      href: '/dashboard/clinic_admin/appointments',
      label: t('nav.appointments'),
      icon: Calendar,
    },
    {
      href: '/dashboard/clinic_admin/patients/search',
      label: t('nav.searchPatients'),
      icon: MagnifierIcon,
    },
    {
      href: '/dashboard/clinic_admin/staff',
      label: t('nav.staff'),
      icon: UserCog,
    },
    {
      href: '/dashboard/clinic_admin/ai-assistant',
      label: t('nav.aiAssistant'),
      icon: Sparkles,
    },
    {
      href: '/dashboard/clinic_admin/profile',
      label: t('nav.profile'),
      icon: UserIcon,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/clinic_admin') {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    toast.success(t('toast.logoutSuccess'));
    router.push('/login');
  };

  return (
    <aside
      style={{
        zIndex: 600,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
      className={`lens-sidebar self-start hidden lg:flex flex-col h-screen overflow-y-auto ${isCollapsed ? 'lens-sidebar-collapsed' : ''}`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className={`absolute ${t.raw('nav.navigation') === 'نیویگیشن' ? '-left-3.5' : '-right-3.5'} top-12 bg-white text-primary p-1.5 rounded-full border border-primary/25 shadow-[0_4px_12px_rgba(29,78,216,0.12)] z-50 hover:bg-primary hover:text-white transition-all duration-200 hidden lg:flex items-center justify-center cursor-pointer`}
      >
        {t.raw('nav.navigation') === 'نیویگیشن' ? (
          isCollapsed ? (
            <PanelLeftOpen size={15} />
          ) : (
            <PanelLeftClose size={15} />
          )
        ) : isCollapsed ? (
          <PanelLeftOpen size={15} />
        ) : (
          <PanelLeftClose size={15} />
        )}
      </button>

      {/* Logo — expanded */}
      <div
        className={`px-3 mb-4 ${isCollapsed ? 'opacity-0 scale-0 overflow-hidden h-0' : 'opacity-100 scale-100 transition-all'}`}
      >
        <Link
          href='/dashboard/clinic_admin'
          className='flex flex-col items-center gap-2 group'
        >
          <CareNexusLogo variant='capsule' size={40} />
          <span className='font-display text-[22px] leading-none text-text-primary tracking-tight font-bold mt-1'>
            Care Nexus
          </span>
          <p
            className='text-[10px] font-bold leading-none tracking-widest px-1 text-center text-nowrap'
            style={{ color: '#6985FF' }}
          >
            {t('nav.clinicPortal')}
          </p>
        </Link>
      </div>

      {/* Logo — collapsed */}
      {isCollapsed && (
        <div className='flex justify-center mb-5'>
          <Link href='/dashboard/clinic_admin'>
            <CareNexusLogo variant='capsule' size={40} />
          </Link>
        </div>
      )}

      <nav className='flex flex-col gap-[2px] scroll-me'>
        {!isCollapsed && (
          <p className='lens-section-label '>{t('nav.navigation')}</p>
        )}
        {navLinks.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              title={isCollapsed ? link.label : ''}
              className={[
                active ? 'lens-nav-item-active' : 'lens-nav-item',
                isCollapsed ? 'justify-center px-0' : '',
              ].join(' ')}
            >
              <Icon
                size={17}
                strokeWidth={active ? 2.5 : 2}
                className='shrink-0'
              />
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div
        className={`mt-auto border-t border-black/6 ${isCollapsed ? 'flex justify-center' : ''}`}
      >
        <button
          onClick={handleLogout}
          title={isCollapsed ? t('nav.signOut') : ''}
          className={`flex items-center gap-2.5 w-full rounded-lg px-3 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors ${isCollapsed ? 'justify-center w-auto px-2.5' : ''}`}
        >
          <LogOut size={15} strokeWidth={2} className='shrink-0' />
          {!isCollapsed && <span>{t('nav.signOut')}</span>}
        </button>
      </div>
    </aside>
  );
}
