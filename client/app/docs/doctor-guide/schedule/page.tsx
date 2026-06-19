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
  CodeBlock,
} from '../../components/DocProse';

export default function DoctorSchedulePage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Schedule Management'
      titleUr='شیڈول مینجمنٹ'
      description='Define your weekly availability so patients can book the right slots.'
      breadcrumbs={[
        { label: 'Doctor Guide', href: '/docs/doctor-guide/dashboard' },
        { label: 'Schedule' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            ڈاکٹر اپنی ہفتہ وار دستیابی مقرر کر سکتا ہے جس کے ذریعے مریض مناسب
            وقت کے سلاٹس میں اپائنٹمنٹ بک کر سکتے ہیں۔ ہر دن کے لیے الگ الگ وقت
            کے سلاٹس طے کیے جا سکتے ہیں۔
          </P>

          <H2>شیڈول کا ڈھانچہ</H2>
          <P>
            شیڈول ڈاکٹر کے پروفائل میں محفوظ ہوتا ہے اور ہر ہفتے کے دن کے لیے
            الگ ترتیب رکھتا ہے (0 = اتوار، 6 = ہفتہ)۔ ہر دن کے اندر وقت کے سلاٹس
            HH:MM فارمیٹ میں محفوظ کیے جاتے ہیں اور یہ بھی بتایا جاتا ہے کہ اس
            دن ڈاکٹر دستیاب ہے یا نہیں۔
          </P>

          <CodeBlock label='Schedule object structure'>
            {`{
  "schedule": {
    "0": { "available": false, "slots": [] },
    "1": { "available": true,  "slots": ["09:00","09:30","10:00","10:30","11:00"] },
    "2": { "available": true,  "slots": ["09:00","09:30","10:00"] },
    "3": { "available": true,  "slots": ["14:00","14:30","15:00","15:30"] },
    "4": { "available": true,  "slots": ["09:00","09:30","10:00","10:30"] },
    "5": { "available": true,  "slots": ["09:00","10:00","11:00"] },
    "6": { "available": false, "slots": [] }
  }
}`}
          </CodeBlock>

          <H2>شیڈول میں تبدیلی</H2>
          <P>
            شیڈول ایڈیٹر ایک ہفتہ وار گرڈ کی شکل میں ہوتا ہے۔ ہر دن کے لیے
            "Available" یا "Unavailable" کا ٹوگل موجود ہوتا ہے۔ جب کوئی دن
            دستیاب کیا جاتا ہے تو ڈاکٹر اس میں وقت کے سلاٹس شامل کر سکتا ہے۔
            تبدیلیاں محفوظ کرنے کے لیے API استعمال ہوتا ہے۔
          </P>

          <H2>بکنگ پر اثر</H2>
          <P>
            جب مریض کسی ڈاکٹر کے لیے اپائنٹمنٹ بک کرتا ہے تو سسٹم پہلے ڈاکٹر کا
            شیڈول حاصل کرتا ہے اور پھر پہلے سے بک شدہ اپائنٹمنٹس کو ہٹا کر صرف
            دستیاب سلاٹس دکھاتا ہے۔
          </P>

          <InfoCard variant='warning' title='پہلے سے موجود اپائنٹمنٹس'>
            شیڈول میں تبدیلی پہلے سے بک شدہ اپائنٹمنٹس کو متاثر نہیں کرتی۔ اگر
            کوئی سلاٹ پہلے سے بک ہے تو وہ اپائنٹمنٹ برقرار رہتی ہے۔ شیڈول کی
            تبدیلی صرف مستقبل کی بکنگ پر اثر ڈالتی ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Schedule system allows doctors to define their weekly
            availability by configuring time slots for each day of the week.
            This availability data drives the slot picker in the patient booking
            flow — patients only see slots that the doctor has explicitly marked
            as available and which are not already booked.
          </P>

          <H2>Schedule Structure</H2>
          <P>
            The schedule is stored as an object on the Doctor document with keys
            for each weekday (0=Sunday through 6=Saturday). Each day contains an
            array of time slot strings in HH:MM format, plus a boolean
            indicating whether the doctor is available at all on that day.
          </P>

          <CodeBlock label='Schedule object structure'>
            {`{
  "schedule": {
    "0": { "available": false, "slots": [] },
    "1": { "available": true,  "slots": ["09:00","09:30","10:00","10:30","11:00"] },
    "2": { "available": true,  "slots": ["09:00","09:30","10:00"] },
    "3": { "available": true,  "slots": ["14:00","14:30","15:00","15:30"] },
    "4": { "available": true,  "slots": ["09:00","09:30","10:00","10:30"] },
    "5": { "available": true,  "slots": ["09:00","10:00","11:00"] },
    "6": { "available": false, "slots": [] }
  }
}`}
          </CodeBlock>

          <H2>Editing the Schedule</H2>
          <P>
            The schedule editor presents a weekly grid UI. Each day has a toggle
            to mark it available or unavailable. When a day is toggled
            available, the doctor can add time slots by clicking time chips or
            entering custom times. Changes are saved on submit via{' '}
            <Code>PUT /api/doctor/schedule</Code>. The schedule is not versioned
            — saving overwrites the current week pattern, and the new pattern
            takes effect immediately for all future bookings.
          </P>

          <H2>Impact on Booking</H2>
          <P>
            When a patient opens the slot picker for a specific doctor on a
            specific date, the system calls{' '}
            <Code>GET /api/doctor/schedule</Code> to get the available slots for
            that weekday, then cross-references against existing appointments on
            that exact date to filter out already-booked slots. Only the
            remaining open slots are shown to the patient.
          </P>

          <InfoCard variant='warning' title='Existing bookings not affected'>
            Changing the schedule does not cancel or modify existing
            appointments. If a doctor removes a slot that already has a booked
            appointment, that appointment remains valid. The schedule change
            only affects future booking availability.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
