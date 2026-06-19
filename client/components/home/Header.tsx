'use client';

import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  Languages,
  Menu,
  X,
  Home,
  UserRound,
  FileText,
  HelpCircle,
  FileCheck,
  Landmark,
  ShieldAlert,
} from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export function Header() {
  const { language, toggleLanguage } = useLanguage();
  const isUrdu = language === 'ur';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: '/about', label: 'About', labelUr: 'ہمارے بارے میں' },
    { href: '/docs', label: 'Docs', labelUr: 'دستاویزات' },
    { href: '/pricing', label: 'Pricing', labelUr: 'قیمتیں' },
    { href: '/terms', label: 'Terms & Conditions', labelUr: 'شرائط و ضوابط' },
    { href: '/faqs', label: 'FAQ', labelUr: 'سوالات' },
    { href: '/support', label: 'Support', labelUr: 'مدد' },
  ];

  const mobileNavLinks = [
    { href: '/', label: 'Home', labelUr: 'ہوم', icon: Home },
    ...navLinks.map((link) => ({ ...link, icon: HelpCircle })),
    {
      href: '/login',
      label: isUrdu ? 'لاگ اِن' : 'Log In',
      labelUr: 'لاگ اِن',
      icon: UserRound,
    },
    {
      href: '/register',
      label: isUrdu ? 'شروع کریں' : 'Get Started',
      labelUr: 'شروع کریں',
      icon: FileText,
    },
  ];

  return (
    <header className='relative w-full z-50 bg-transparent'>
      <div
        className={cn(
          'mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 h-16 flex items-center justify-between gap-4',
          isUrdu ? 'flex-row-reverse' : 'flex-row',
        )}
        dir={isUrdu ? 'rtl' : 'ltr'}
      >
        {/* Brand Left Section */}
        <Link
          href='/'
          className={cn(
            'flex items-center gap-3 group shrink-0',
            isUrdu && 'flex-row-reverse',
          )}
        >
          <CareNexusLogo size={30} />

          <span
            className={cn(
              'font-sans text-lg sm:text-xl tracking-tight font-extrabold bg-linear-to-r from-[#5f7bff] via-[#7a7dff] to-[#a56bff] bg-clip-text text-transparent group-hover:opacity-90 transition-all',
              isUrdu && 'font-urdu text-2xl',
            )}
          >
            {isUrdu ? 'دی کیئر نیکسس' : 'The Care Nexus'}
          </span>
        </Link>

        {/* Centered Navigation Links */}
        <nav
          className={cn(
            'hidden md:flex items-center gap-4 lg:gap-7 mx-auto',
            isUrdu && 'flex-row-reverse',
          )}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className='text-sm font-semibold hover:text-primary transition-colors duration-150 py-1'
            >
              {isUrdu ? link.labelUr : link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section Action Buttons */}
        <div
          className={cn(
            'flex items-center gap-3 shrink-0',
            isUrdu && 'flex-row-reverse',
          )}
        >
          {/* Language Switcher */}
          <button
            type='button'
            onClick={toggleLanguage}
            className='flex items-center gap-1.5 rounded-lg border border-black/5 bg-transparent px-2.5 py-1.5 hover:bg-white/80 transition-colors text-[10px] sm:text-xs font-bold text-text-secondary'
            aria-label='Toggle language'
          >
            <Languages className='h-3.5 w-3.5 text-text-secondary' />
            <span
              className={
                language === 'en'
                  ? 'text-primary font-extrabold'
                  : 'text-text-muted'
              }
            >
              EN
            </span>
            <span className='text-text-muted'>|</span>
            <span
              className={
                language === 'ur'
                  ? 'text-primary font-extrabold font-urdu'
                  : 'text-text-muted font-urdu'
              }
            >
              اردو
            </span>
          </button>

          {/* Auth Buttons */}
          <div
            className={cn(
              'hidden sm:flex items-center gap-2',
              isUrdu && 'flex-row-reverse',
            )}
          >
            <Link href='/login'>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  'h-9 px-3 text-xs font-bold transition-colors whitespace-nowrap',
                  isUrdu && 'font-urdu px-4 py-1.5 text-sm',
                )}
              >
                {isUrdu ? 'لاگ اِن' : 'Log In'}
              </Button>
            </Link>
            <Link href='/register'>
              <Button
                size='sm'
                className={cn(
                  'h-9 px-3.5 text-xs font-extrabold bg-[#2944FF] hover:bg-primary-hover text-white transition-colors whitespace-nowrap',
                  isUrdu && 'font-urdu px-5 py-1.5 text-sm',
                )}
              >
                {isUrdu ? 'شروع کریں' : 'Get Started'}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type='button'
            onClick={() => setMobileMenuOpen(true)}
            className='inline-flex md:hidden h-9 w-9 items-center justify-center rounded-lg border border-black/5 bg-white/40 text-text-primary shadow-sm hover:bg-white/80'
            aria-label='Open menu'
          >
            <Menu className='h-4 w-4' />
          </button>
        </div>
      </div>

      {mounted && mobileMenuOpen
        ? createPortal(
            <div className='fixed inset-0 z-9999 md:hidden'>
              <div
                className='absolute inset-0 bg-black/30 backdrop-blur-[1px]'
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className='absolute right-0 top-0 h-full w-[80vw] max-w-xs bg-white shadow-2xl p-6 flex flex-col gap-4 z-10000'>
                <div className='flex items-center justify-between'>
                  <span className='font-sans text-lg font-bold text-text-primary'>
                    {isUrdu ? 'دی کیئر نیکسس' : 'The Care Nexus'}
                  </span>
                  <button
                    type='button'
                    onClick={() => setMobileMenuOpen(false)}
                    className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10'
                  >
                    <X className='h-4 w-4' />
                  </button>
                </div>

                <button
                  type='button'
                  onClick={toggleLanguage}
                  className='flex items-center justify-between gap-3 rounded-xl border border-black/5 bg-surface/60 px-3 py-2 text-xs font-semibold text-text-primary shadow-sm'
                  aria-label='Toggle language'
                >
                  <span className='flex items-center gap-2'>
                    <Languages className='h-4 w-4 text-primary' />
                    <span
                      className={
                        language === 'en'
                          ? 'text-primary font-bold'
                          : 'text-text-muted'
                      }
                    >
                      EN
                    </span>
                    <span className='text-text-muted'>|</span>
                    <span
                      className={
                        language === 'ur'
                          ? 'text-primary font-bold font-urdu'
                          : 'text-text-muted font-urdu'
                      }
                    >
                      اردو
                    </span>
                  </span>
                  <span className='text-[10px] font-bold uppercase tracking-wider text-text-muted'>
                    {isUrdu ? 'زبان' : 'Language'}
                  </span>
                </button>

                <nav className='mt-4 flex flex-col gap-1'>
                  {mobileNavLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className='flex items-center gap-3 rounded-xl border border-black/2 px-3.5 py-2.5 text-xs font-bold text-text-primary hover:bg-primary/5 transition-colors'
                      >
                        <Icon className='h-3.5 w-3.5 text-primary' />
                        <span>
                          {isUrdu && item.labelUr ? item.labelUr : item.label}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </header>
  );
}
