'use client';

import { Calendar, Search, UserCog, Settings, HeartPulse } from 'lucide-react';
import LayoutDashboardIcon from '@/icons/layout-dashboard-icon';
import UsersIcon from '@/icons/users-icon';
import UserIconAnimated from '@/icons/user-icon';
import FilledBellIcon from '@/icons/filled-bell-icon';
import XIcon from '@/icons/x-icon';
import LogoutIcon from '@/icons/logout-icon';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useGetNotificationsQuery } from '@/store/api/notificationApi';
import { setNotifications } from '@/store/slices/notificationSlice';
import { useLocale, useTranslations } from 'next-intl';

interface TopbarProps {
  title?: string;
}

import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import NotificationPanel from '@/components/NotificationPanel';
import { Hamburger } from '@/components/ui/Hamburger';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function ClinicTopbar({ title }: TopbarProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ur';
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const user = useSelector((state: any) => state.auth.user);
  const { unreadCount } = useSelector((state: any) => state.notifications);
  const { data: notificationsData } = useGetNotificationsQuery('clinic_admin', {
    skip: !mounted,
  });
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (notificationsData?.data) {
      dispatch(setNotifications(notificationsData.data));
    }
  }, [notificationsData, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    toast.success('Logged out successfully');
    router.push('/login');
  };

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
      label: t('nav.patients'),
      icon: Search,
    },
    {
      href: '/dashboard/clinic_admin/staff',
      label: t('nav.staff'),
      icon: UserCog,
    },
    {
      href: '/dashboard/clinic_admin/profile',
      label: t('nav.profile'),
      icon: UserIconAnimated,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard/clinic_admin') return pathname === href;
    return pathname?.startsWith(href);
  };

  if (!mounted) return null;

  return (
    <>
      <header className='lens-topbar border-b border-[rgba(37,99,235,0.08)] bg-[rgba(239,244,251,0.92)] backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between w-full'>
        {/* Logo - mobile only */}
        <Link
          href='/dashboard/clinic_admin'
          className='flex items-center gap-2.5 group lg:hidden'
        >
          <CareNexusLogo size={30} />
          <span className='font-display text-[18px] font-bold text-text-primary'>
            CareNexus
          </span>
        </Link>

        <h1 className='hidden lg:block text-sm font-black uppercase tracking-[0.2em] text-text-primary'>
          {title || t('nav.clinicPortal')}
        </h1>

        {/* Right Side Options */}
        <div className='flex items-center gap-3'>
          {/* Responsive Search Input */}
          <div className='relative hidden sm:block w-44 md:w-60 lg:w-72 mr-1'>
            <span className='absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none'>
              <Search className='h-3.5 w-3.5 text-text-muted' />
            </span>
            <input
              type='search'
              className='w-full pl-9 pr-4 py-2 text-xs rounded-full border border-primary/15 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all'
              placeholder='Search patients, appointments, records...'
              readOnly
            />
          </div>

          <button
            onClick={() => setIsNotificationOpen(true)}
            className='h-9 w-9 text-text-secondary hover:bg-white rounded-[10px] flex items-center justify-center relative transition-all border border-[rgba(37,99,235,0.10)] shadow-[0_1px_4px_rgba(37,99,235,0.06)] cursor-pointer'
          >
            <FilledBellIcon className='h-[18px] w-[18px]' />
            {unreadCount > 0 && (
              <span className='absolute -top-1 -right-1 h-4 min-w-4 px-0.5 bg-danger text-white text-[9px] font-bold rounded-full border-2 border-[#EFF4FB] flex items-center justify-center pointer-events-none'>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          <LanguageSwitcher />

          <Hamburger
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className='text-text-primary ml-1 cursor-pointer lg:hidden shrink-0'
          />
        </div>
      </header>

      <NotificationPanel
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* Right Drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-500 ${isMenuOpen ? 'visible' : 'invisible'}`}
      >
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />

        <div
          className={`absolute right-0 top-0 h-full w-full max-w-[88vw] sm:max-w-sm bg-white transition-transform duration-500 ease-out border-l border-[rgba(37,99,235,0.10)] ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className='flex flex-col h-full'>
            <div className='p-6 border-b border-[rgba(37,99,235,0.08)] flex items-center justify-between'>
              <h2
                className={`font-bold text-text-primary text-sm ${isRtl ? 'tracking-normal' : 'uppercase tracking-[0.15em] text-xs'}`}
              >
                {t('nav.clinicPortal')}
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className='h-9 w-9 flex items-center justify-center rounded-[10px] hover:bg-[rgba(37,99,235,0.07)] transition-colors'
                title='Close Menu'
              >
                <XIcon className='h-5 w-5 text-text-secondary' />
              </button>
            </div>

            <nav
              className={`flex-1 overflow-y-auto p-4 space-y-1 ${isRtl ? 'text-right' : ''}`}
            >
              <p
                className={`px-3 text-[11px] font-bold text-text-muted mt-4 mb-2 ${isRtl ? 'tracking-normal' : 'uppercase tracking-widest text-[10px]'}`}
              >
                {t('nav.navigation')}
              </p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] text-sm font-semibold transition-all ${isRtl ? 'justify-end' : ''} ${
                      isActive(link.href)
                        ? 'bg-primary text-white'
                        : 'text-text-secondary hover:text-primary hover:bg-[rgba(37,99,235,0.06)]'
                    }`}
                  >
                    <Icon size={17} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className='p-6 border-t border-[rgba(37,99,235,0.08)] space-y-3'>
              <button
                onClick={handleLogout}
                className='flex items-center justify-center gap-2 w-full py-3 bg-danger text-white rounded-[10px] text-sm font-semibold hover:bg-danger/90 transition-all active:scale-95'
              >
                <LogoutIcon className='h-4 w-4 stroke-white' />
                <span>{t('nav.signOut')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
