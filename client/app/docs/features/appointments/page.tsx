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

export default function FeatureAppointmentsPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Appointments Feature'
      titleUr='ملاقات کی خصوصیت'
      description='Complete appointment system — booking, queue management, status lifecycle, and notifications.'
      breadcrumbs={[
        { label: 'Features', href: '/docs/features/appointments' },
        { label: 'Appointments' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            اپائنٹمنٹ سسٹم دی کیئر نیکسس کا بنیادی حصہ ہے جو مریض، ڈاکٹر اور
            کلینک کو آپس میں جوڑتا ہے۔ اس میں بکنگ، قطار کا انتظام اور ریئل ٹائم
            اطلاعات شامل ہیں۔
          </P>

          <H2>بکنگ کی پابندیاں</H2>
          <UL>
            <LI>
              ایک مریض ایک ہی وقت میں ایک ہی ڈاکٹر کے ساتھ ڈبل بکنگ نہیں کر سکتا
            </LI>
            <LI>
              سلاٹ صرف اسی وقت دستیاب ہوگا جب وہ ڈاکٹر کے شیڈول میں ہو اور پہلے
              سے بک نہ ہو
            </LI>
            <LI>
              مریض صرف اپنے کلینک سے منسلک ڈاکٹروں کے ساتھ اپائنٹمنٹ لے سکتا ہے
            </LI>
            <LI>زیادہ سے زیادہ 30 دن پہلے تک بکنگ کی اجازت ہے</LI>
            <LI>اسی دن بکنگ صرف مستقبل کے دستیاب سلاٹس کے لیے ممکن ہے</LI>
          </UL>

          <H2>اسٹیٹس سسٹم</H2>
          <Table
            headers={['حالت (From)', 'حالت (To)', 'کنٹرول کرنے والا']}
            rows={[
              ['pending', 'confirmed', 'ڈاکٹر (قبول کرتا ہے)'],
              ['pending', 'cancelled', 'مریض یا ڈاکٹر'],
              ['confirmed', 'in-progress', 'ڈاکٹر (علاج شروع کرتا ہے)'],
              ['confirmed', 'cancelled', 'مریض یا ڈاکٹر'],
              ['in-progress', 'completed', 'ڈاکٹر (مکمل کرتا ہے)'],
            ]}
          />

          <H2>اطلاعات کا نظام</H2>
          <UL>
            <LI>بکنگ پر ڈاکٹر کو فوری نوٹیفکیشن بھیجا جاتا ہے</LI>
            <LI>کنفرم یا کینسل پر مریض کو اطلاع دی جاتی ہے</LI>
            <LI>24 گھنٹے پہلے خودکار یاد دہانی بھیجی جاتی ہے</LI>
            <LI>1 گھنٹہ پہلے دوسرا ریمائنڈر بھیجا جاتا ہے</LI>
          </UL>

          <InfoCard variant='info' title='اپائنٹمنٹ کی قسم'>
            ہر اپائنٹمنٹ میں <Code>type</Code> فیلڈ ہوتا ہے:{' '}
            <Code>in-person</Code> یا <Code>follow-up</Code>۔ فالو اپ اپائنٹمنٹ
            خودکار طور پر تب بنتی ہے جب نسخے میں followUpDate موجود ہو اور مریض
            "Book Follow-up" پر کلک کرے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Appointments feature is the operational backbone of The Care
            Nexus...
          </P>

          <H2>Booking Constraints</H2>
          <UL>
            <LI>
              A patient cannot book the same doctor twice in the same time slot
            </LI>
            <LI>
              A slot is only available if it exists in schedule and is unbooked
            </LI>
            <LI>Patients can only book doctors linked to a clinic</LI>
            <LI>Appointments can be booked up to 30 days in advance</LI>
            <LI>Same-day booking is allowed if slot is in the future</LI>
          </UL>

          <H2>Status Machine</H2>
          <Table
            headers={['From', 'To', 'Who triggers']}
            rows={[
              ['pending', 'confirmed', 'Doctor'],
              ['pending', 'cancelled', 'Patient or Doctor'],
              ['confirmed', 'in-progress', 'Doctor'],
              ['confirmed', 'cancelled', 'Patient or Doctor'],
              ['in-progress', 'completed', 'Doctor'],
            ]}
          />

          <H2>Notification Triggers</H2>
          <UL>
            <LI>Booking → doctor gets real-time notification</LI>
            <LI>Confirmation → patient notified</LI>
            <LI>24h reminder → email + push notification</LI>
            <LI>1h reminder → second alert</LI>
          </UL>

          <InfoCard variant='info' title='Appointment type field'>
            Each appointment has a <Code>type</Code> field:{' '}
            <Code>in-person</Code> or <Code>follow-up</Code>.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
