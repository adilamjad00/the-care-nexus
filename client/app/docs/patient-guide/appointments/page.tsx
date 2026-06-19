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

export default function PatientAppointmentsPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Appointments'
      titleUr='ملاقاتیں'
      description='Book, manage, and cancel appointments with clinic doctors.'
      descriptionUr='کلینک کے ڈاکٹروں کے ساتھ اپائنٹمنٹ بک کریں، مینج کریں اور منسوخ کریں۔'
      breadcrumbs={[
        { label: 'Patient Guide', href: '/docs/patient-guide/dashboard' },
        { label: 'Appointments' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            اپائنٹمنٹ سسٹم مریض اور کلینک کے درمیان بنیادی رابطہ ہے۔ اس سسٹم کے
            ذریعے مریض ڈاکٹر کے ساتھ ملاقات بک کر سکتا ہے، اپنی موجودہ اور پرانی
            ملاقاتیں دیکھ سکتا ہے، اور ضرورت پڑنے پر اپائنٹمنٹ منسوخ بھی کر سکتا
            ہے۔
          </P>

          <P>
            یہ پورا سسٹم اس طرح ڈیزائن کیا گیا ہے کہ مریض کو آسان اور تیز تجربہ
            ملے۔ صرف تین سادہ مراحل میں اپائنٹمنٹ بک کی جاتی ہے: کلینک منتخب
            کریں، ڈاکٹر منتخب کریں، اور وقت کا سلاٹ چنیں۔
          </P>

          <H2>بکنگ کا عمل</H2>

          <H3>مرحلہ 1 — کلینک منتخب کریں</H3>
          <P>
            سب سے پہلے مریض دستیاب کلینکس کی فہرست دیکھتا ہے۔ ہر کلینک کارڈ میں
            کلینک کا نام، پتہ، فعال ڈاکٹروں کی تعداد اور ورکنگ اوقات دکھائے جاتے
            ہیں۔ صرف وہی کلینکس دکھائے جاتے ہیں جن کے پاس فعال ڈاکٹر اور دستیاب
            سلاٹس موجود ہوں۔
          </P>

          <H3>مرحلہ 2 — ڈاکٹر منتخب کریں</H3>
          <P>
            کلینک منتخب کرنے کے بعد اس کلینک کے تمام ڈاکٹرز دکھائے جاتے ہیں۔ ہر
            ڈاکٹر کی پروفائل میں اسپیشلائزیشن، تجربہ، ریٹنگ اور اگلے دستیاب
            سلاٹس کا پیش منظر شامل ہوتا ہے۔ مریض اپنی پسند کا ڈاکٹر منتخب کرتا
            ہے۔
          </P>

          <H3>مرحلہ 3 — وقت کا انتخاب</H3>
          <P>
            اس مرحلے میں مریض ڈاکٹر کے دستیاب وقت کے سلاٹس دیکھتا ہے۔ جو سلاٹس
            پہلے سے بک ہوں وہ غیر فعال (disabled) ہوتے ہیں۔ سسٹم ہر ہفتے کے دن
            کے حساب سے ڈاکٹر کی شیڈول سیٹنگ سے سلاٹس جنریٹ کرتا ہے اور پہلے سے
            بک اپائنٹمنٹس کو ہٹا دیتا ہے تاکہ ڈبل بکنگ نہ ہو۔
          </P>

          <H2>API اینڈ پوائنٹس</H2>

          <Table
            headers={['طریقہ', 'اینڈ پوائنٹ', 'تفصیل']}
            rows={[
              [
                'GET',
                '/api/patient/appointments',
                'تمام اپائنٹمنٹس کی فہرست حاصل کریں (فلٹر کے ساتھ)',
              ],
              ['POST', '/api/patient/appointments', 'نئی اپائنٹمنٹ بک کریں'],
              [
                'PUT',
                '/api/patient/appointments/:id/cancel',
                'اپائنٹمنٹ منسوخ کریں',
              ],
              [
                'GET',
                '/api/patient/appointments/:id',
                'اپائنٹمنٹ کی مکمل تفصیل دیکھیں',
              ],
            ]}
          />

          <H2>اپائنٹمنٹ کا مکمل عمل (Lifecycle)</H2>

          <UL>
            <LI>
              مریض اپائنٹمنٹ بک کرتا ہے → اسٹیٹس: <Code>pending</Code>، ڈاکٹر کو
              فوری نوٹیفکیشن جاتا ہے
            </LI>
            <LI>
              ڈاکٹر اپائنٹمنٹ قبول کرتا ہے → اسٹیٹس: <Code>confirmed</Code>،
              مریض کو اطلاع ملتی ہے
            </LI>
            <LI>
              ملاقات شروع ہوتی ہے → اسٹیٹس: <Code>in-progress</Code>
            </LI>
            <LI>
              ملاقات مکمل ہوتی ہے → اسٹیٹس: <Code>completed</Code> اور نسخہ تیار
              ہوتا ہے
            </LI>
            <LI>
              کوئی بھی فریق منسوخ کرے → اسٹیٹس: <Code>cancelled</Code> اور دونوں
              کو اطلاع جاتی ہے
            </LI>
          </UL>

          <H2>اپائنٹمنٹ منسوخی کا اصول</H2>

          <P>
            مریض صرف وہ اپائنٹمنٹس منسوخ کر سکتا ہے جو <Code>pending</Code> یا{' '}
            <Code>confirmed</Code> حالت میں ہوں۔ اگر اپائنٹمنٹ{' '}
            <Code>in-progress</Code> یا <Code>completed</Code> ہو جائے تو اسے
            منسوخ نہیں کیا جا سکتا۔
          </P>

          <InfoCard variant='warning' title='ڈبل بکنگ سے تحفظ'>
            سسٹم سرور سائیڈ پر ہر سلاٹ کی دستیابی چیک کرتا ہے۔ ڈاکٹر اور وقت کے
            امتزاج پر unique constraint موجود ہے، اس لیے اگر دو مریض ایک ہی وقت
            میں بک کرنے کی کوشش کریں تو دوسرا request 409 Conflict error دے گا۔
          </InfoCard>
        </>
      ) : (
        <>
          {/* English unchanged */}
          <P>The Appointments system is the primary interaction point...</P>

          <H2>Booking Flow</H2>

          <H3>Step 1 — Select a Clinic</H3>
          <P>The patient browses available clinics...</P>

          <H3>Step 2 — Select a Doctor</H3>
          <P>After choosing a clinic...</P>

          <H3>Step 3 — Pick a Time Slot</H3>
          <P>The slot picker shows...</P>

          <H2>API Endpoints</H2>

          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              ['GET', '/api/patient/appointments', 'List all appointments'],
              ['POST', '/api/patient/appointments', 'Book appointment'],
              [
                'PUT',
                '/api/patient/appointments/:id/cancel',
                'Cancel appointment',
              ],
              [
                'GET',
                '/api/patient/appointments/:id',
                'Get appointment detail',
              ],
            ]}
          />

          <H2>Appointment Lifecycle</H2>

          <UL>
            <LI>
              <Code>pending</Code> → booked
            </LI>
            <LI>
              <Code>confirmed</Code> → accepted
            </LI>
            <LI>
              <Code>in-progress</Code> → ongoing
            </LI>
            <LI>
              <Code>completed</Code> → finished
            </LI>
            <LI>
              <Code>cancelled</Code> → cancelled
            </LI>
          </UL>

          <H2>Cancellation Policy</H2>

          <P>Patients can cancel only pending or confirmed appointments...</P>

          <InfoCard variant='warning' title='Double-booking prevention'>
            Server-side validation ensures no duplicate slot bookings...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
