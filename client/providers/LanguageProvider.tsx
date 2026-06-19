'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import enMessages from '@/messages/en.json';
import urMessages from '@/messages/ur.json';

const STORAGE_KEY = 'carenexus_lang';
const APP_TIME_ZONE = 'UTC';

type Language = 'en' | 'ur';

const LanguageContext = createContext<{
  language: Language;
  toggleLanguage: () => void;
}>({ language: 'en', toggleLanguage: () => { } });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [language, setLanguage] = useState<Language>('en');
  const [messages, setMessages] = useState<Record<string, any>>(enMessages as Record<string, any>);
  const router = useRouter();
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
  const languageEndpoint = apiBaseUrl.endsWith('/api')
    ? `${apiBaseUrl}/user/language`
    : `${apiBaseUrl}/api/user/language`;

  useEffect(() => {
    const saved = (localStorage.getItem(STORAGE_KEY) as Language) || 'en';
    setLanguage(saved);
    setMessages(saved === 'ur' ? urMessages : enMessages);
    document.documentElement.dir = saved === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = saved;
    document.documentElement.setAttribute('data-lang', saved);
    document.body.className = saved === 'ur' ? 'font-urdu antialiased relative min-h-screen' : 'font-sans antialiased relative min-h-screen';
  }, []);

  const toggleLanguage = async () => {
    const next: Language = language === 'en' ? 'ur' : 'en';
    setLanguage(next);
    setMessages(next === 'ur' ? urMessages : enMessages);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dir = next === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
    document.documentElement.setAttribute('data-lang', next);
    document.body.className = next === 'ur' ? 'font-urdu antialiased relative min-h-screen' : 'font-sans antialiased relative min-h-screen';

    if (accessToken) {
      try {
        const response = await fetch(languageEndpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ language: next }),
        });

        if (!response.ok) {
          await fetch(languageEndpoint, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ language: next }),
          });
        }
      } catch (error) {
        console.warn('Language sync failed, continuing locally.', error);
      }
    }

    router.refresh();
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <NextIntlClientProvider locale={language} messages={messages as any} timeZone={APP_TIME_ZONE}>
        {children}
      </NextIntlClientProvider>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
