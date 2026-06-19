'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import {
  P,
  H2,
  H3,
  UL,
  LI,
  Table,
  InfoCard,
  Code,
} from '../../components/DocProse';

export default function PlatformOverviewPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Platform Overview'
      titleUr='پلیٹ فارم کا جائزہ'
      description='Understand the full architecture, portals, and capabilities of The Care Nexus.'
      descriptionUr='دی کیئر نیکسس کے مکمل آرکیٹیکچر، پورٹلز اور اس کی تمام صلاحیتوں کو سمجھیں۔'
      breadcrumbs={[
        {
          label: 'Getting Started',
          href: '/docs/getting-started/introduction',
        },
        { label: 'Platform Overview' },
      ]}
      lastUpdated='June 2026'
      readingTime='8 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس ایک متحد SaaS ہیلتھ کیئر پلیٹ فارم ہے جو تین بنیادی
            پورٹلز پر مشتمل ہے: مریض پورٹل، ڈاکٹر پورٹل، اور کلینک ایڈمن پورٹل۔
            ہر پورٹل الگ ہونے کے باوجود ایک ہی مرکزی API اور ریئل ٹائم
            انفراسٹرکچر کے ساتھ منسلک ہے۔
          </P>

          <P>
            یہ سسٹم Next.js App Router پر بنایا گیا ہے، جہاں ہر پورٹل کا اپنا
            UI، لے آؤٹ اور روٹ سسٹم موجود ہے، لیکن تمام ڈیٹا اور کمیونیکیشن ایک
            ہی Express.js backend اور Socket.IO سرور کے ذریعے چلتی ہے۔
          </P>

          <H2>تین بنیادی پورٹلز</H2>

          <H3>مریض پورٹل</H3>
          <P>
            مریض پورٹل عام صارفین اور خاندانوں کے لیے مکمل ہیلتھ مینجمنٹ فراہم
            کرتا ہے۔ مریض اپنی رجسٹریشن مکمل کرنے کے بعد ڈاکٹروں کو تلاش کر سکتے
            ہیں، اپائنٹمنٹ بک کر سکتے ہیں، اور اپنی مکمل میڈیکل ہسٹری دیکھ سکتے
            ہیں۔ AI ہیلتھ اسسٹنٹ انہیں عمومی صحت سے متعلق رہنمائی فراہم کرتا ہے،
            جبکہ فیملی مینجمنٹ فیچر ایک اکاؤنٹ سے پورے خاندان کے ریکارڈز کو
            سنبھالنے کی سہولت دیتا ہے۔
          </P>

          <H3>ڈاکٹر پورٹل</H3>
          <P>
            ڈاکٹر پورٹل کلینیکل ورک فلو کو تیز اور مؤثر بنانے کے لیے ڈیزائن کیا
            گیا ہے۔ ڈاکٹر اپنی آج کی اپائنٹمنٹ لائن کو فوری دیکھ سکتے ہیں، اور
            وائس پریسکرپشن فیچر کے ذریعے صرف بول کر مکمل نسخہ تیار کر سکتے ہیں۔
            یہ سسٹم وقت بچانے اور دستی کام کو کم کرنے کے لیے بنایا گیا ہے۔
          </P>

          <H3>کلینک ایڈمن پورٹل</H3>
          <P>
            کلینک ایڈمن پورٹل کلینک کے تمام آپریشنز کو کنٹرول کرتا ہے۔ اس میں
            ڈاکٹرز کی مینجمنٹ، اسٹاف اکاؤنٹس، اپائنٹمنٹ فلو، اور ریونیو اینالٹکس
            شامل ہیں۔ تمام ڈیٹا روزانہ کے اسنیپ شاٹس کی صورت میں محفوظ کیا جاتا
            ہے تاکہ رپورٹس تیزی سے جنریٹ کی جا سکیں۔
          </P>

          <H2>ٹیکنالوجی کا خلاصہ</H2>

          <Table
            headers={['لیئر', 'ٹیکنالوجی', 'مقصد']}
            rows={[
              [
                'فرنٹ اینڈ',
                'Next.js 15, React 19, Tailwind CSS v4',
                'SSR، روٹنگ اور ریسپانسیو UI',
              ],
              [
                'اسٹیٹ مینجمنٹ',
                'Redux Toolkit + RTK Query',
                'API ڈیٹا فیچنگ اور کیشنگ',
              ],
              ['بیک اینڈ', 'Node.js + Express.js', 'REST API اور بزنس لاجک'],
              ['ڈیٹا بیس', 'MongoDB Atlas + Mongoose', 'مرکزی ڈیٹا اسٹور'],
              ['کیش', 'Upstash Redis', 'سیشنز، ریٹ لمٹنگ، چیٹ کیش'],
              [
                'AI',
                'Google Gemini + GROQ API',
                'چیٹ بوٹ، ٹرانسکرپشن، پراسیسنگ',
              ],
              ['ریئل ٹائم', 'Socket.IO', 'لائیو چیٹ اور نوٹیفکیشنز'],
              ['Auth', 'JWT + bcrypt', 'محفوظ ٹوکن بیسڈ لاگ ان'],
              ['i18n', 'next-intl', 'انگریزی اور اردو (RTL سپورٹ)'],
              [
                'ڈیپلائمنٹ',
                'Vercel + Render + MongoDB Atlas',
                'پروڈکشن ہوسٹنگ',
              ],
            ]}
          />

          <H2>ڈیٹا فلو</H2>

          <P>
            جب کوئی مریض اپائنٹمنٹ بک کرتا ہے تو درخواست
            <Code>POST /api/patient/appointments</Code> پر جاتی ہے۔ بیک اینڈ اس
            کی دستیابی چیک کرتا ہے، اپائنٹمنٹ بناتا ہے، اور فوراً Socket.IO کے
            ذریعے ڈاکٹر کو ریئل ٹائم نوٹیفکیشن بھیجتا ہے۔ ڈاکٹر کا جواب فوری طور
            پر مریض تک واپس پہنچتا ہے۔ بعد میں نسخہ بنانے پر مریض کا ریکارڈ
            خودکار طور پر اپڈیٹ ہو جاتا ہے۔
          </P>

          <H2>ریکویسٹ سیکیورٹی</H2>

          <P>
            ہر محفوظ API ریکویسٹ کے لیے JWT ٹوکن لازمی ہے جو Authorization
            header میں بھیجا جاتا ہے۔ ایکسیس ٹوکن 15 منٹ کے لیے کارآمد ہوتا ہے،
            جبکہ ریفریش ٹوکن Redis میں 7 دن کے لیے محفوظ رہتا ہے۔ لاگ آؤٹ ہونے
            پر ریفریش ٹوکن فوراً ختم کر دیا جاتا ہے تاکہ سیشن مکمل طور پر بند ہو
            جائے۔
          </P>

          <InfoCard variant='note' title='ملٹی ٹیننٹ آرکیٹیکچر'>
            ہر کلینک ایک الگ یونٹ ہے۔ ڈاکٹر صرف ایک کلینک سے منسلک ہو سکتے ہیں۔
            مریض کا ڈیٹا کسی دوسرے کلینک کے ساتھ شیئر نہیں کیا جاتا، اور تمام
            ریکارڈز کلینک کے سیاق و سباق میں محفوظ رہتے ہیں۔
          </InfoCard>
        </>
      ) : (
        <>
          {/* English unchanged */}
          <P>
            The Care Nexus is structured as a unified SaaS platform with three
            independent portals sharing a single backend API and real-time
            infrastructure...
          </P>

          <H2>The Three Portals</H2>

          <H3>Patient Portal</H3>
          <P>
            The patient-facing portal provides end-to-end healthcare
            management...
          </P>

          <H3>Doctor Portal</H3>
          <P>The doctor portal is optimized for clinical workflow speed...</P>

          <H3>Clinic Administration Portal</H3>
          <P>
            Clinic administrators manage the operational and business layer...
          </P>

          <H2>Tech Stack at a Glance</H2>

          <Table
            headers={['Layer', 'Technology', 'Purpose']}
            rows={[
              [
                'Frontend',
                'Next.js 15, React 19, Tailwind CSS v4',
                'SSR, routing, responsive UI',
              ],
              [
                'State',
                'Redux Toolkit + RTK Query',
                'API data fetching and caching',
              ],
              ['Backend', 'Node.js + Express.js', 'REST API, business logic'],
              ['Database', 'MongoDB Atlas + Mongoose', 'Primary data store'],
              ['Cache', 'Upstash Redis', 'Sessions, rate limiting, chat cache'],
              [
                'AI',
                'Google Gemini + GROQ API',
                'Chatbot, transcription, parsing',
              ],
              ['Realtime', 'Socket.IO', 'Live chat, notifications'],
              ['Auth', 'JWT + bcrypt', 'Secure token-based authentication'],
              ['i18n', 'next-intl', 'English/Urdu with RTL switching'],
              [
                'Deployment',
                'Vercel + Render + MongoDB Atlas',
                'Production hosting',
              ],
            ]}
          />

          <H2>Data Flow</H2>

          <P>
            When a patient books an appointment, the request hits{' '}
            <Code>POST /api/patient/appointments</Code>...
          </P>

          <H2>Request Authentication</H2>

          <P>Every protected API route requires a valid JWT access token...</P>

          <InfoCard variant='note' title='Multi-tenant Architecture'>
            Each clinic is a separate entity...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
