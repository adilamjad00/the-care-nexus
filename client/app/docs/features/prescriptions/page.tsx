'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import {
  P,
  H2,
  UL,
  LI,
  Table,
  InfoCard,
  Code,
} from '../../components/DocProse';

export default function FeaturePrescriptionsPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Prescriptions Feature'
      titleUr='نسخہ جات کی خصوصیت'
      description='AI-powered voice prescriptions, structured medicine data, and cross-portal accessibility.'
      breadcrumbs={[
        { label: 'Features', href: '/docs/features/appointments' },
        { label: 'Prescriptions' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            نسخہ سسٹم دی کیئر نیکسس کی سب سے اہم خصوصیت ہے جو ڈاکٹروں کو آواز یا
            دستی طریقے سے منظم اور ساختی نسخے لکھنے کی سہولت دیتا ہے۔ یہ نسخے
            فوراً مریض کے میڈیکل ریکارڈ میں محفوظ ہو جاتے ہیں۔
          </P>

          <H2>ادویات کا ڈھانچہ</H2>
          <P>
            ہر نسخہ میں ادویات کی ایک فہرست شامل ہوتی ہے جس میں ہر دوا کی تفصیل
            محفوظ کی جاتی ہے تاکہ مستقبل میں آسانی سے سمجھا جا سکے اور سسٹم میں
            استعمال کیا جا سکے۔
          </P>

          <Table
            headers={['فیلڈ', 'مثال']}
            rows={[
              ['نام', 'Amoxicillin'],
              ['ڈوز', '500mg'],
              ['فریکوئنسی', 'دن میں 3 بار کھانے کے بعد'],
              ['مدت', '7 دن'],
              ['نوٹس', 'مکمل کورس لازمی کریں'],
            ]}
          />

          <H2>سسٹم میں رسائی (Cross Portal)</H2>
          <UL>
            <LI>ڈاکٹر نسخہ بناتا ہے → ڈاکٹر کے ریکارڈ میں محفوظ ہوتا ہے</LI>
            <LI>مریض کو فوراً نظر آتا ہے → میڈیکل والٹ اپڈیٹ ہو جاتا ہے</LI>
            <LI>کلینک ایڈمن دیکھ سکتا ہے → صرف شمار (count) کی صورت میں</LI>
            <LI>
              فیملی ممبرز → اگر نسخہ ان کے لیے ہو تو ان کے سب والٹ میں ظاہر ہوتا
              ہے
            </LI>
          </UL>

          <InfoCard variant='tip' title='پرنٹ اور پی ڈی ایف'>
            ہر نسخہ پرنٹ کے لیے تیار ہوتا ہے۔ پرنٹ بٹن دبانے پر ایک صاف اور
            کلینک لیٹر ہیڈ والا پیج کھلتا ہے جس میں ڈاکٹر کی تفصیل، مریض کی
            معلومات اور کلینک کا پتہ شامل ہوتا ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The prescription system is The Care Nexus's signature feature...
          </P>

          <H2>Medicine Structure</H2>
          <Table
            headers={['Field', 'Example']}
            rows={[
              ['name', 'Amoxicillin'],
              ['dosage', '500mg'],
              ['frequency', '3 times daily after meals'],
              ['duration', '7 days'],
              ['notes', 'Complete the full course'],
            ]}
          />

          <H2>Cross-Portal Visibility</H2>
          <UL>
            <LI>Doctor creates → appears in doctor's history</LI>
            <LI>Patient sees → vault updates in real time</LI>
            <LI>Admin sees → analytics only (no content access)</LI>
            <LI>Family members → stored in sub-vault</LI>
          </UL>

          <InfoCard variant='tip' title='Print/PDF'>
            Each prescription has a print-optimized layout...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
