'use client';

import Link from 'next/link';
import { CareNexusLogo } from '@/components/ui/CareNexusLogo';
import { useLanguage } from '@/providers/LanguageProvider';

export function Footer() {
  const { language } = useLanguage();
  const isUrdu = language === 'ur';

  const productLinks = [
    { label: 'Documentation', labelUr: 'دستاویزات', href: '/docs' },
    { label: 'Help Center', labelUr: 'ہیلپ سینٹر', href: '/support' },
    { label: 'Pricing', labelUr: 'قیمتیں', href: '/pricing' },
    { label: 'FAQs', labelUr: 'سوالات', href: '/faqs' },
  ];

  const companyLinks = [
    { label: 'Home Page', labelUr: 'ہوم', href: '/' },
    { label: 'About Us', labelUr: 'ہمارے بارے میں', href: '/about' },
    { label: 'Support', labelUr: 'مدد', href: '/support' },
    { label: 'Contact', labelUr: 'رابطہ کریں', href: '/support' },
  ];

  const legalLinks = [
    { label: 'Terms & Conditions', labelUr: 'شرائط و ضوابط', href: '/terms' },
    {
      label: 'Privacy Policy',
      labelUr: 'پرائیویسی پالیسی',
      href: '/privacy-policy',
    },
    { label: 'Cookie Policy', labelUr: 'کوکی پالیسی', href: '/cookie-policy' },
    { label: 'Licensing', labelUr: 'لائسنسنگ', href: '/privacy-policy' },
  ];

  const getStartedLinks = [
    { label: 'Login', labelUr: 'لاگ اِن', href: '/login' },
    { label: 'Register', labelUr: 'رجسٹریشن', href: '/register' },
    { label: 'Start Free Trial', labelUr: 'فری ٹرائل', href: '/register' },
    { label: 'Request Demo', labelUr: 'ڈیمو', href: '/register' },
  ];

  return (
    <footer className='relative bg-white border-t border-black/5 overflow-hidden'>
      {/* Subtle grid background to match SaaS aesthetic */}
      <div className='absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] pointer-events-none opacity-60' />

      <div className='relative mx-auto max-w-7xl px-6 lg:px-8 pt-16 pb-8'>
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24 ${isUrdu ? 'text-right' : 'text-left'}`}
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          {/* Brand Left Column (Grid col span 4) */}
          <div className='md:col-span-4 flex flex-col gap-6'>
            <Link
              href='/'
              className={`flex items-center gap-4 ${isUrdu ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <CareNexusLogo size={25} />
              <span className='font-sans text-xl tracking-tight font-extrabold text-text-primary'>
                {isUrdu ? 'دی کیئر نیکسس' : 'The Care Nexus'}
              </span>
            </Link>
            <p className='text-sm leading-relaxed text-text-secondary max-w-md'>
              {isUrdu
                ? 'مریضوں، ڈاکٹروں اور طبی ورک فلوز کو ایک ہی ذہین ہیلتھ کیئر پلیٹ فارم کے ذریعے جوڑنا۔'
                : 'Connecting patients, healthcare providers, and medical workflows through one intelligent healthcare platform. AI Powered Medical & Healthcare Software Development Company.'}
            </p>
          </div>

          {/* Right Columns (Grid col span 8, split into 4 columns) */}
          <div className='md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-12'>
            {/* Product Column */}
            <div>
              <h3 className='text-[11px] font-bold tracking-wider uppercase text-text-muted mb-4'>
                {isUrdu ? 'ریسرورسز' : 'Resources'}
              </h3>
              <ul className='space-y-2.5'>
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-xs text-text-secondary hover:text-primary transition-colors font-medium'
                    >
                      {isUrdu ? link.labelUr : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className='text-[11px] font-bold tracking-wider uppercase text-text-muted mb-4'>
                {isUrdu ? 'کمپنی' : 'Company'}
              </h3>
              <ul className='space-y-2.5'>
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-xs text-text-secondary hover:text-primary transition-colors font-medium'
                    >
                      {isUrdu ? link.labelUr : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className='text-[11px] font-bold tracking-wider uppercase text-text-muted mb-4'>
                {isUrdu ? 'قانونی' : 'Legal'}
              </h3>
              <ul className='space-y-2.5'>
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-xs text-text-secondary hover:text-primary transition-colors font-medium'
                    >
                      {isUrdu ? link.labelUr : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Get Started Column */}
            <div>
              <h3 className='text-[11px] font-bold tracking-wider uppercase text-text-muted mb-4'>
                {isUrdu ? 'شروع کریں' : 'Get Started'}
              </h3>
              <ul className='space-y-2.5'>
                {getStartedLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className='text-xs text-text-secondary hover:text-primary transition-colors font-medium'
                    >
                      {isUrdu ? link.labelUr : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`mt-16 pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 ${isUrdu ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}
          dir={isUrdu ? 'rtl' : 'ltr'}
        >
          <p className='text-[12px] text-text-muted font-medium'>
            {isUrdu
              ? `کاپی رائٹ © 2026 دی کیئر نیکسس۔ جملہ حقوق محفوظ ہیں۔`
              : `Copyright © 2026 The Care Nexus. All Rights Reserved.`}
          </p>

          <div className='flex items-center gap-4 text-[12px] text-text-muted font-medium'>
            <Link
              href='/terms'
              className='hover:text-primary transition-colors'
            >
              {isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions'}
            </Link>
            <span className='text-black/10'>•</span>
            <Link
              href='/privacy-policy'
              className='hover:text-primary transition-colors'
            >
              {isUrdu ? 'پرائیویسی پالیسی' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
