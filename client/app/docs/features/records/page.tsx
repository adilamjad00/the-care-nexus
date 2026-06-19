'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import { P, H2, UL, LI, InfoCard } from '../../components/DocProse';

export default function FeatureRecordsPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Medical Records'
      titleUr='طبی ریکارڈ'
      description='Chronological health timeline, family member records, and record permanence.'
      breadcrumbs={[
        { label: 'Features', href: '/docs/features/appointments' },
        { label: 'Records' },
      ]}
      lastUpdated='June 2026'
      readingTime='4 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس میں طبی ریکارڈ مریض کی مکمل اور مستقل صحت کی تاریخ ہے۔
            ہر مکمل اپائنٹمنٹ اور نسخہ خود بخود اس ریکارڈ میں محفوظ ہو جاتا ہے۔
          </P>

          <H2>ریکارڈ کی خصوصیات</H2>
          <UL>
            <LI>تاریخی ترتیب — تازہ ترین ریکارڈ سب سے اوپر</LI>
            <LI>تلاش اور فلٹر — ڈاکٹر، تاریخ یا بیماری کے نام سے</LI>
            <LI>مکمل نسخہ تفصیل — ادویات، ڈوز اور ڈاکٹر کے نوٹس</LI>
            <LI>ڈاکٹر پروفائل لنک — دوبارہ اپائنٹمنٹ بک کرنے کی سہولت</LI>
            <LI>فیملی ممبرز کے الگ ریکارڈز</LI>
            <LI>پرنٹ کے لیے موزوں فارمیٹ</LI>
          </UL>

          <H2>فیملی ممبرز کا نظام</H2>
          <P>
            مریض اپنے خاندان کے افراد جیسے بچوں، والدین یا شریکِ حیات کے الگ
            پروفائل بنا سکتا ہے۔ ہر فیملی ممبر کا اپنا الگ میڈیکل ریکارڈ ہوتا ہے
            جو مرکزی اکاؤنٹ سے الگ لیکن اسی کے ذریعے قابل رسائی ہوتا ہے۔ ڈاکٹر
            کی طرف سے بنایا گیا نسخہ اسی فیملی ممبر کے ریکارڈ میں محفوظ ہوتا ہے۔
          </P>

          <InfoCard variant='note' title='ریکارڈ کی ملکیت'>
            تمام طبی ریکارڈ مریض کی ملکیت ہوتے ہیں۔ کلینک یا ڈاکٹر کی تبدیلی کے
            باوجود ریکارڈ محفوظ رہتے ہیں اور کبھی حذف نہیں کیے جاتے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            Medical Records in The Care Nexus form a permanent, chronological
            health timeline for every patient...
          </P>

          <H2>Record Features</H2>
          <UL>
            <LI>Chronological timeline — newest records at top</LI>
            <LI>Search and filter — by doctor, date, diagnosis</LI>
            <LI>Full prescription detail — medicines and notes</LI>
            <LI>Doctor profile link — rebook easily</LI>
            <LI>Family member sub-vault system</LI>
            <LI>Print-friendly layout</LI>
          </UL>

          <H2>Family Member Management</H2>
          <P>A patient can add family members with separate profiles...</P>

          <InfoCard variant='note' title='Record ownership'>
            Medical records belong to the patient, not the clinic or doctor...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
