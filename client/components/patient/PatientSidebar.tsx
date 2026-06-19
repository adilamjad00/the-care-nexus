'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import {
  Calendar,
  Pill,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  LogOut,
  PanelLeftOpen,
  PanelLeftClose,
} from 'lucide-react';
import { useGetConversationsQuery } from '@/store/api/chatApi';
import { logout } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import LayoutDashboardIcon from '@/icons/layout-dashboard-icon';
import UsersIcon from '@/icons/users-icon';
import MessageCircleIcon from '@/icons/message-circle-icon';
import UserIcon from '@/icons/user-icon';
import DescriptionIcon from '@/icons/file-description-icon';
import AlarmClockPlusIcon from '@/icons/alarm-clock-plus-icon';
import { toggleSidebar } from '@/store/slices/uiSlice';
import { RootState } from '@/store/store';
import { useTranslations } from 'next-intl';
import { useChatSocket } from '@/providers/ChatSocketProvider';

export default function PatientSidebar() {
  const t = useTranslations();
  const pathname = usePathname();
  const isCollapsed = useSelector(
    (state: RootState) => state.ui.sidebarCollapsed,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const { theme } = useTheme();

  const navLinks = [
    {
      href: '/dashboard/patient',
      label: t('nav.dashboard'),
      icon: LayoutDashboardIcon,
    },
    {
      href: '/dashboard/patient/records',
      label: t('nav.records'),
      icon: DescriptionIcon,
    },
    {
      href: '/dashboard/patient/find-doctors',
      label: t('nav.doctors'),
      icon: UsersIcon,
    },
    {
      href: '/dashboard/patient/appointments',
      label: t('nav.appointments'),
      icon: Calendar,
    },
    {
      href: '/dashboard/patient/book-appointment',
      label: t('nav.bookAppointment'),
      icon: AlarmClockPlusIcon,
    },
    {
      href: '/dashboard/patient/family',
      label: t('nav.family'),
      icon: UsersIcon,
    },
    {
      href: '/dashboard/patient/chat',
      label: t('nav.chat'),
      icon: MessageSquare,
    },
    {
      href: '/dashboard/patient/ai-assistant',
      label: t('nav.aiAssistant'),
      icon: MessageCircleIcon,
    },
    {
      href: '/dashboard/patient/profile',
      label: t('nav.profile'),
      icon: UserIcon,
    },
  ];

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: conversationsData, refetch } = useGetConversationsQuery(
    { viewerRole: 'patient' },
    {
      pollingInterval: 30000,
      skip: !mounted,
    },
  );
  const { onConversationUpdated, onNewMessage } = useChatSocket();

  useEffect(() => {
    const unsubConversation = onConversationUpdated?.(() => {
      refetch();
    });
    const unsubMessage = onNewMessage?.(() => {
      refetch();
    });
    return () => {
      unsubConversation?.();
      unsubMessage?.();
    };
  }, [onConversationUpdated, onNewMessage, refetch]);

  const totalUnread =
    conversationsData?.data?.reduce(
      (acc: number, conv: any) => acc + (conv.unreadCount || 0),
      0,
    ) || 0;

  const isActive = (href: string) => {
    if (href === '/dashboard/patient') {
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
          href='/dashboard/patient'
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
            {t('nav.patientPortal')}
          </p>
        </Link>
      </div>

      {/* Logo — collapsed */}
      {isCollapsed && (
        <div className='flex justify-center mb-7'>
          <Link href='/dashboard/patient'>
            <CareNexusLogo variant='capsule' size={40} />
          </Link>
        </div>
      )}

      <nav className='flex flex-col gap-0.5 scroll-me'>
        {!isCollapsed && (
          <p className='lens-section-label'>{t('nav.navigation')}</p>
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
              {link.href.includes('/chat') && totalUnread > 0 && (
                <span
                  className={`${isCollapsed ? 'absolute -top-1 -right-1' : 'ml-auto'} min-w-4.5 h-4.5 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center border-2 border-white`}
                >
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
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
