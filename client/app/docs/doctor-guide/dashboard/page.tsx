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

export default function DoctorDashboardPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Doctor Dashboard'
      titleUr='ڈاکٹر ڈیش بورڈ'
      description="Today's queue, upcoming appointments, revenue overview, and quick clinical tools."
      descriptionUr='آج کی مریضوں کی قطار، آنے والی ملاقاتیں، آمدنی کا جائزہ اور فوری طبی ٹولز۔'
      breadcrumbs={[
        { label: 'Doctor Guide', href: '/docs/doctor-guide/dashboard' },
        { label: 'Dashboard' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            ڈاکٹر ڈیش بورڈ کلینیکل ورک فلو کا مرکزی کنٹرول سسٹم ہے۔ یہاں ڈاکٹر
            کو فوراً آج کی ملاقاتوں کی قطار، اہم اسٹیٹس، اور فوری ایکشنز نظر آتے
            ہیں تاکہ کام تیزی سے انجام دیا جا سکے۔
          </P>

          <P>
            یہ ڈیش بورڈ خاص طور پر اس طرح ڈیزائن کیا گیا ہے کہ ڈاکٹر کو کم سے کم
            کلکس میں زیادہ سے زیادہ کام کرنے کی سہولت ملے — جیسے نسخہ بنانا،
            مریض کی تفصیل دیکھنا، یا ملاقات اپڈیٹ کرنا۔
          </P>

          <H2>آج کی مریضوں کی قطار</H2>
          <P>
            آج کے تمام مریض ترتیب وار فہرست میں دکھائے جاتے ہیں۔ ہر مریض کے کارڈ
            میں نام، وقت، اسٹیٹس اور پروفائل تصویر شامل ہوتی ہے۔ ڈاکٹر کسی بھی
            مریض پر کلک کر کے تفصیل دیکھ سکتا ہے یا فوری نسخہ بنا سکتا ہے۔
          </P>

          <H2>ڈیش بورڈ اسٹیٹس کارڈز</H2>
          <Table
            headers={['کارڈ', 'تفصیل']}
            rows={[
              ['کل سیشنز', 'تمام مکمل شدہ ملاقاتوں کی مجموعی تعداد'],
              ['آج کی قطار', 'آج کے تمام pending اور confirmed مریض'],
              ['اوسط ریٹنگ', 'تمام مریضوں کی فیڈبیک کی بنیاد پر اسٹار ریٹنگ'],
              ['ماہانہ آمدنی', 'اس مہینے کی کل کمائی کا حساب'],
            ]}
          />

          <H2>کلینیکل شارٹ کٹس</H2>
          <P>
            ڈیش بورڈ پر دو اہم شارٹ کٹس موجود ہیں: نیا نسخہ بنائیں اور ملاقاتیں
            دیکھیں۔ یہ دونوں آپشنز ڈاکٹر کے روزمرہ کے سب سے زیادہ استعمال ہونے
            والے فیچرز ہیں۔
          </P>

          <H2>آمدنی کا چارٹ</H2>
          <P>
            ایک چھوٹا سا چارٹ اس مہینے کی ہفتہ وار آمدنی دکھاتا ہے تاکہ ڈاکٹر
            اپنی کلینک کی کارکردگی کو فوری طور پر سمجھ سکے۔
          </P>

          <InfoCard variant='info' title='آنے والی ملاقاتیں'>
            ڈیش بورڈ پر آنے والی 4 اگلی ملاقاتیں بھی دکھائی جاتی ہیں تاکہ ڈاکٹر
            اپنی آنے والی مصروفیت کو بہتر طریقے سے پلان کر سکے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Doctor Dashboard is the clinical command center. It surfaces
            what matters most at the start of every work session: today's
            appointment queue, key practice metrics, and one-click access to the
            two highest-frequency actions — creating a prescription and viewing
            appointments. Everything is optimized to reduce the number of clicks
            required to perform the most common tasks.
          </P>

          <H2>Today's Queue</H2>
          <P>
            The queue section shows all appointments for today, sorted
            chronologically. Each queue item displays the patient name, photo,
            appointment time, and status badge. A right-arrow button links
            directly to the patient's appointment detail where the doctor can
            update the status or create a prescription. The queue automatically
            de-duplicates — if a patient somehow has two entries for the same
            slot, the one with the higher priority status (confirmed over
            pending) is shown.
          </P>

          <H2>Dashboard Stat Cards</H2>
          <Table
            headers={['Card', 'Metric']}
            rows={[
              ['Total Sessions', 'All-time completed appointment count'],
              [
                'Pending Queue',
                "Today's appointments still in pending/confirmed status",
              ],
              [
                'Average Rating',
                'Computed from all patient reviews, displayed as stars',
              ],
              [
                'Monthly Revenue',
                'Sum of RevenueEntry records for the current calendar month',
              ],
            ]}
          />

          <H2>Practice Tools</H2>
          <P>
            Two quick-action cards are displayed below the stats: New
            Prescription (opens the prescription creation form pre-filled with
            today's patients) and Appointments (jumps directly to the
            appointments page). These shortcuts are the result of analyzing the
            most common navigation patterns — 80% of doctor sessions begin with
            one of these two actions.
          </P>

          <H2>Revenue Mini Chart</H2>
          <P>
            A compact bar chart powered by Recharts shows the current month's
            revenue by week. This gives the doctor a quick pulse on practice
            performance without navigating to the full revenue page. The data
            comes from <Code>GET /api/doctor/revenue?period=month</Code>.
          </P>

          <InfoCard variant='info' title='Upcoming appointments panel'>
            The dashboard also shows the next 4 upcoming appointments beyond
            today, sorted by dateTime. This helps doctors plan ahead for
            high-volume days and manage patient expectations in advance.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
