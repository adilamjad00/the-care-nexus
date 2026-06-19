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

export default function PatientDashboardPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Patient Dashboard'
      titleUr='مریض ڈیش بورڈ'
      description='Your central health command center — stats, upcoming appointments, and quick actions.'
      descriptionUr='آپ کا مرکزی ہیلتھ کنٹرول سینٹر جہاں اپائنٹمنٹس، ریکارڈ اور فوری ایکشنز موجود ہیں۔'
      breadcrumbs={[
        { label: 'Patient Guide', href: '/docs/patient-guide/dashboard' },
        { label: 'Dashboard' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            مریض ڈیش بورڈ آپ کے اکاؤنٹ کا مرکزی کنٹرول سینٹر ہے۔ یہاں آپ اپنی
            صحت کی مکمل صورتحال ایک جگہ دیکھ سکتے ہیں، جیسے آنے والی ملاقاتیں،
            ماضی کی اپائنٹمنٹس، اور ڈاکٹروں کی معلومات۔
          </P>

          <P>
            یہ ڈیش بورڈ خاص طور پر اس لیے بنایا گیا ہے کہ مریض کو بار بار مختلف
            صفحات پر نہ جانا پڑے۔ تمام اہم معلومات ایک صاف اور سادہ انٹرفیس میں
            دکھائی جاتی ہیں تاکہ استعمال آسان اور تیز ہو۔
          </P>

          <H2>اہم اعداد و شمار (Dashboard KPIs)</H2>

          <P>
            ڈیش بورڈ کے اوپر چار بنیادی کارڈز دکھائے جاتے ہیں جو آپ کی صحت اور
            سرگرمیوں کا خلاصہ فراہم کرتے ہیں۔ یہ تمام ڈیٹا ایک ہی API کال سے
            حاصل کیا جاتا ہے تاکہ سسٹم تیز اور مؤثر رہے۔
          </P>

          <Table
            headers={['کارڈ', 'میٹرک', 'تفصیل']}
            rows={[
              [
                'اس ہفتے کی ملاقاتیں',
                'تعداد',
                'موجودہ ہفتے میں شیڈول اپائنٹمنٹس',
              ],
              [
                'اس مہینے کی ملاقاتیں',
                'تعداد',
                'موجودہ مہینے میں تمام اپائنٹمنٹس',
              ],
              [
                'دیکھے گئے ڈاکٹرز',
                'تعداد',
                'وہ ڈاکٹرز جن سے مریض نے ملاقات کی',
              ],
              ['کل نسخے', 'تعداد', 'تمام محفوظ شدہ میڈیکل نسخے'],
            ]}
          />

          <H2>آنے والی ملاقاتیں</H2>

          <P>
            اس سیکشن میں آپ کی اگلی تین اپائنٹمنٹس دکھائی جاتی ہیں۔ ہر اپائنٹمنٹ
            میں ڈاکٹر کا نام، کلینک، تاریخ اور وقت شامل ہوتا ہے۔ یہ لسٹ خود بخود
            وقت کے حساب سے ترتیب دی جاتی ہے تاکہ سب سے قریب ملاقات اوپر نظر آئے۔
          </P>

          <H3>اپائنٹمنٹ اسٹیٹس</H3>

          <UL>
            <LI>
              <strong>Pending</strong> — اپائنٹمنٹ بک ہو چکی ہے لیکن ڈاکٹر نے
              تصدیق نہیں کی
            </LI>
            <LI>
              <strong>Confirmed</strong> — ڈاکٹر نے اپائنٹمنٹ قبول کر لی ہے
            </LI>
            <LI>
              <strong>In Progress</strong> — ملاقات جاری ہے
            </LI>
            <LI>
              <strong>Completed</strong> — ملاقات مکمل ہو چکی ہے
            </LI>
            <LI>
              <strong>Cancelled</strong> — اپائنٹمنٹ منسوخ کر دی گئی ہے
            </LI>
          </UL>

          <H2>فوری ایکشنز</H2>

          <P>
            ڈیش بورڈ پر دو اہم بٹن دیے گئے ہیں: اپائنٹمنٹ بک کریں اور AI اسسٹنٹ
            سے سوال پوچھیں۔ یہ دونوں فیچرز مریض کے سب سے زیادہ استعمال ہونے والے
            ایکشنز ہیں، اس لیے انہیں ایک کلک میں دستیاب رکھا گیا ہے۔
          </P>

          <H2>حالیہ وزٹ کیے گئے ڈاکٹرز</H2>

          <P>
            اس حصے میں وہ ڈاکٹر دکھائے جاتے ہیں جن سے مریض نے حال ہی میں ملاقات
            کی ہے۔ کسی بھی ڈاکٹر پر کلک کرنے سے اس کی پروفائل کھل جاتی ہے جہاں
            اس کی اسپیشلائزیشن، ریٹنگ اور دوبارہ اپائنٹمنٹ بک کرنے کا آپشن موجود
            ہوتا ہے۔
          </P>

          <InfoCard variant='info' title='ڈیٹا پرائیویسی'>
            ہر مریض کا ڈیٹا مکمل طور پر الگ رکھا جاتا ہے۔ کوئی بھی معلومات دوسرے
            مریض کے ساتھ شیئر نہیں کی جاتی۔ تمام API درخواستیں JWT ٹوکن کے ذریعے
            محفوظ ہوتی ہیں اور ہر درخواست پر userId ویریفائی کیا جاتا ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          {/* English unchanged */}
          <P>The Patient Dashboard is the first screen...</P>

          <H2>Dashboard KPI Cards</H2>

          <P>The four stat cards are populated by a single API call...</P>

          <Table
            headers={['Card', 'Metric', 'Detail']}
            rows={[
              [
                'Appointments This Week',
                'Count',
                'Appointments with dateTime in current ISO week',
              ],
              [
                'Appointments This Month',
                'Count',
                'Appointments in current calendar month',
              ],
              [
                'Doctors Visited',
                'Count',
                'Unique doctors from completed appointments',
              ],
              [
                'Total Prescriptions',
                'Count',
                'All prescriptions linked to this patient',
              ],
            ]}
          />

          <H2>Upcoming Appointments Panel</H2>

          <P>Below the KPI cards...</P>

          <H3>Appointment Statuses</H3>

          <UL>
            <LI>
              <strong>Pending</strong> — Booked but not yet confirmed
            </LI>
            <LI>
              <strong>Confirmed</strong> — Accepted by doctor
            </LI>
            <LI>
              <strong>In Progress</strong> — Happening now
            </LI>
            <LI>
              <strong>Completed</strong> — Finished visit
            </LI>
            <LI>
              <strong>Cancelled</strong> — Cancelled appointment
            </LI>
          </UL>

          <H2>Quick Actions</H2>

          <P>Two primary actions...</P>

          <H2>Recent Doctors Visited</H2>

          <P>A scrollable row of doctor avatars...</P>

          <InfoCard variant='info' title='Data privacy'>
            Dashboard stats are computed per patient in isolation...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
