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

export default function ClinicDashboardPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Clinic Admin Dashboard'
      titleUr='کلینک ایڈمن ڈیش بورڈ'
      description="Full operational overview — today's patients, revenue, active doctors, and appointment flow."
      breadcrumbs={[
        {
          label: 'Clinic Administration',
          href: '/docs/clinic-administration/dashboard',
        },
        { label: 'Dashboard' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            کلینک ایڈمن ڈیش بورڈ کلینک مینیجرز کے لیے ایک مرکزی کنٹرول سسٹم ہے۔
            یہ تمام ڈاکٹروں، مریضوں اور ملاقاتوں کا مجموعی جائزہ فراہم کرتا ہے
            تاکہ کلینک کی کارکردگی کو ایک نظر میں سمجھا جا سکے۔
          </P>

          <H2>اہم میٹرکس</H2>
          <Table
            headers={['میٹرک', 'ماخذ', 'اپ ڈیٹ فریکوئنسی']}
            rows={[
              ['آج کے کل مریض', 'آج کی تاریخ والی اپائنٹمنٹس', 'ریئل ٹائم'],
              ['کل آمدنی', 'تمام ریونیو ریکارڈز کا مجموعہ', 'ریئل ٹائم'],
              ['فعال ڈاکٹر', 'کلینک میں موجود ڈاکٹرز', 'ریئل ٹائم'],
              ['زیر التواء اپائنٹمنٹس', 'status = pending', 'ریئل ٹائم'],
              ['ماہانہ آمدنی', 'موجودہ مہینے کا ریونیو', 'ریئل ٹائم'],
            ]}
          />

          <H2>مریضوں کا فلو چارٹ</H2>
          <P>
            یہ چارٹ پچھلے 30 دنوں میں مریضوں کی یومیہ تعداد دکھاتا ہے۔ یہ ڈیٹا
            اپائنٹمنٹ مکمل ہونے پر تیار ہوتا ہے اور کلینک کے پیٹرن سمجھنے میں
            مدد دیتا ہے۔
          </P>

          <H2>اپائنٹمنٹ اوورویو</H2>
          <P>
            یہ ٹیبل تمام ڈاکٹروں کی آج کی ملاقاتیں دکھاتا ہے تاکہ ریسپشن اسٹاف
            آسانی سے پورے کلینک کا انتظام کر سکے۔
          </P>

          <H2>کوئیک ایکشنز</H2>
          <UL>
            <LI>ڈاکٹر شامل کریں — نیا ڈاکٹر ای میل کے ذریعے دعوت دیں</LI>
            <LI>اسٹاف شامل کریں — ریسپشنسٹ یا سپورٹ اسٹاف بنائیں</LI>
            <LI>ریونیو رپورٹ دیکھیں</LI>
            <LI>کلینک سیٹنگز اپڈیٹ کریں</LI>
          </UL>

          <InfoCard variant='tip' title='اینالیٹکس سنیپ شاٹ'>
            اینالیٹکس ڈیٹا ہر رات 2 بجے محفوظ کیا جاتا ہے تاکہ ڈیش بورڈ تیزی سے
            لوڈ ہو سکے اور ہر بار پورے ڈیٹا کو دوبارہ کیلکولیٹ نہ کرنا پڑے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Clinic Administration Dashboard provides the operational command
            center for clinic managers...
          </P>

          <H2>Key Metrics</H2>
          <Table
            headers={['Metric', 'Source', 'Update Frequency']}
            rows={[
              [
                "Today's Total Patients",
                "Appointments with today's date",
                'Real-time on load',
              ],
              [
                'Total Revenue',
                'Sum of all RevenueEntry records',
                'Real-time on load',
              ],
              [
                'Active Doctors',
                'Doctors with isActive=true in clinic',
                'Real-time on load',
              ],
              [
                'Pending Appointments',
                'Appointments with status=pending',
                'Real-time on load',
              ],
              [
                'Monthly Revenue',
                'RevenueEntry sum for current month',
                'Real-time on load',
              ],
            ]}
          />

          <H2>Patient Flow Chart</H2>
          <P>
            A line chart shows patient visit counts per day for the past 30
            days...
          </P>

          <H2>Appointment Queue Overview</H2>
          <P>A table shows all appointments across all clinic doctors...</P>

          <H2>Quick Actions</H2>
          <UL>
            <LI>
              Add Doctor — invite a new doctor to join the clinic by email
            </LI>
            <LI>Add Staff — create a receptionist or support staff account</LI>
            <LI>View Revenue Report</LI>
            <LI>Clinic Settings</LI>
          </UL>

          <InfoCard variant='tip' title='Analytics snapshot jobs'>
            Detailed analytics are powered by nightly snapshot jobs running at 2
            AM...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
