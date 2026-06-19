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

export default function DoctorPatientsPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Patient Management'
      titleUr='مریضوں کا انتظام'
      description='View, search, and manage your patient roster with full history access.'
      descriptionUr='اپنے مریضوں کی فہرست دیکھیں، تلاش کریں اور مکمل میڈیکل ہسٹری کے ساتھ انتظام کریں۔'
      breadcrumbs={[
        { label: 'Doctor Guide', href: '/docs/doctor-guide/dashboard' },
        { label: 'Patients' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            ڈاکٹر اپنے تمام مریضوں کی فہرست دیکھ سکتا ہے جن کا وہ علاج کر چکا ہے
            یا جنہوں نے اس کے ساتھ اپوائنٹمنٹ بک کی ہے۔ یہ سسٹم بڑی تعداد میں
            مریضوں کو آسانی سے منظم کرنے کے لیے ڈیزائن کیا گیا ہے۔
          </P>

          <P>
            ہر مریض کے ریکارڈ میں آخری ملاقات کی تاریخ، نسخوں کی تعداد اور مکمل
            میڈیکل ہسٹری تک فوری رسائی شامل ہوتی ہے۔
          </P>

          <H2>مریض کی تفصیل</H2>
          <P>
            کسی بھی مریض پر کلک کرنے سے اس کی مکمل پروفائل کھل جاتی ہے جہاں عمر،
            بلڈ گروپ، الرجی، گزشتہ ملاقاتیں اور تمام نسخے دکھائے جاتے ہیں۔ ڈاکٹر
            اسی صفحے سے براہ راست نیا نسخہ بھی بنا سکتا ہے۔
          </P>

          <H2>API اینڈ پوائنٹس</H2>
          <Table
            headers={['طریقہ', 'اینڈ پوائنٹ', 'تفصیل']}
            rows={[
              [
                'GET',
                '/api/doctor/patients',
                'مریضوں کی فہرست — سرچ اور پیجینیشن کے ساتھ',
              ],
              [
                'POST',
                '/api/doctor/patients',
                'ای میل یا آئی ڈی کے ذریعے نیا مریض شامل کریں',
              ],
              [
                'GET',
                '/api/doctor/patients/:id',
                'مکمل مریض کی تفصیل، اپوائنٹمنٹس اور نسخے',
              ],
              [
                'DELETE',
                '/api/doctor/patients/:id',
                'مریض کو لسٹ سے ہٹانا (ریکارڈ حذف نہیں ہوتے)',
              ],
            ]}
          />

          <H2>مریض شامل کرنا (Manual Add)</H2>
          <P>
            ڈاکٹر کسی بھی مریض کو اس کے رجسٹرڈ ای میل کے ذریعے اپنی لسٹ میں شامل
            کر سکتا ہے۔ یہ فیچر ان مریضوں کے لیے مفید ہے جو براہ راست کلینک میں
            آتے ہیں لیکن پہلے سے سسٹم میں موجود ہوتے ہیں۔
          </P>

          <InfoCard variant='info' title='لسٹ اور ریکارڈ کا فرق'>
            کسی مریض کو ڈاکٹر کی لسٹ سے ہٹانے کا مطلب یہ نہیں کہ اس کا ڈیٹا
            ڈیلیٹ ہو گیا ہے۔ تمام اپوائنٹمنٹس اور نسخے محفوظ رہتے ہیں اور مریض
            کے اپنے اکاؤنٹ میں دستیاب رہتے ہیں۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Patients section gives doctors a managed roster of all patients
            they have treated or who have booked appointments with them. The
            list is searchable by name and supports pagination to handle large
            patient volumes efficiently. Each patient record shows the last
            visit date, prescription count, and a quick link to view their full
            medical history within the doctor's context.
          </P>

          <H2>Patient Detail View</H2>
          <P>
            Clicking on a patient opens a full detail page showing the patient's
            profile information (age, blood group, known allergies), all
            appointments with this doctor (sorted newest first), and all
            prescriptions this doctor has created for them. The doctor can
            create a new prescription directly from this view without going
            through the appointments queue.
          </P>

          <H2>API Endpoints</H2>
          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              [
                'GET',
                '/api/doctor/patients',
                'Paginated list — ?search=name&page=1&limit=20',
              ],
              [
                'POST',
                '/api/doctor/patients',
                'Manually add a patient by email or ID',
              ],
              [
                'GET',
                '/api/doctor/patients/:id',
                'Full patient detail — profile, appointments, prescriptions',
              ],
              [
                'DELETE',
                '/api/doctor/patients/:id',
                'Remove patient from roster (does not delete records)',
              ],
            ]}
          />

          <H2>Adding Patients Manually</H2>
          <P>
            Doctors can add patients to their roster manually by entering the
            patient's registered email address. This creates a connection
            without requiring the patient to book an appointment first — useful
            for in-clinic walk-ins where the patient has an existing account.
            The patient receives a notification that a doctor has added them to
            their roster.
          </P>

          <InfoCard variant='info' title='Roster vs Records'>
            Removing a patient from the doctor's roster does not delete any
            medical records or appointment history. It only removes them from
            the active roster list. All past prescriptions and appointments
            remain visible in both the patient's medical vault and the doctor's
            prescription history.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
