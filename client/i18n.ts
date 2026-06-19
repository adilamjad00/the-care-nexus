import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  const currentLocale = locale || 'en';

  return {
    locale: currentLocale,
    messages: (await import(`./messages/${currentLocale}.json`)).default,
    timeZone: 'UTC',
    onError(error) {
      if (error.code === 'MISSING_MESSAGE') {
        console.warn(error);
      } else {
        console.error(error);
      }
    },
    getMessageFallback({ key }) {
      return key.split('.').pop() || key;
    }
  };
});
