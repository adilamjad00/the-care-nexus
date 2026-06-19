'use client';
import { useLanguage } from '@/providers/LanguageProvider';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className='flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-black/10 text-text-primary hover:bg-black/5 :bg-white/5 transition-colors whitespace-nowrap'
    >
      <span
        className={
          language === 'en' ? 'text-primary font-bold' : 'text-text-muted'
        }
      >
        EN
      </span>
      <span className='text-text-muted'>|</span>
      <span
        className={`font-urdu ${language === 'ur' ? 'text-primary font-bold' : 'text-text-muted'}`}
      >
        اردو
      </span>
    </button>
  );
}
