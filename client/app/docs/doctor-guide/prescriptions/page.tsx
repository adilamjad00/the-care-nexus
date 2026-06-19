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
  CodeBlock,
} from '../../components/DocProse';

export default function DoctorPrescriptionsPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Prescriptions & Voice Workflow'
      titleUr='نسخہ جات اور آواز ورک فلو'
      description='Create structured prescriptions manually or via AI-powered voice transcription.'
      breadcrumbs={[
        { label: 'Doctor Guide', href: '/docs/doctor-guide/dashboard' },
        { label: 'Prescriptions' },
      ]}
      lastUpdated='June 2026'
      readingTime='8 min read'
    >
      {isUrdu ? (
        <>
          <P>
            یہ نظام دی کیئر نیکسس کی سب سے اہم خصوصیات میں سے ایک ہے۔ ڈاکٹر دستی
            طور پر یا آواز کے ذریعے نسخہ تیار کر سکتے ہیں۔ آواز کے ذریعے نسخہ
            بنانے کے لیے مائیکروفون بٹن دبائیں اور بولیں، سسٹم خود بخود اسے
            ساختی (structured) نسخے میں تبدیل کر دیتا ہے۔ اس سے نسخہ لکھنے کا
            وقت کافی حد تک کم ہو جاتا ہے۔
          </P>

          <H2>آواز پر مبنی نسخہ ورک فلو</H2>

          <H3>1. ریکارڈ کرنا</H3>
          <P>
            ڈاکٹر مائیکروفون بٹن پر کلک کر کے آواز ریکارڈ کرتا ہے۔ براؤزر کا
            MediaRecorder API آڈیو کو WebM یا WAV فارمیٹ میں محفوظ کرتا ہے۔
            ریکارڈنگ دوبارہ کلک کرنے یا 5 منٹ کے ٹائم آؤٹ پر رک جاتی ہے۔ آڈیو
            فائل API کے ذریعے سرور پر بھیجی جاتی ہے۔
          </P>

          <H3>2. ٹرانسکرائب کرنا</H3>
          <P>
            GROQ API آڈیو کو متن (text) میں تبدیل کرتا ہے۔ ڈاکٹر اردو یا انگریزی
            دونوں زبانوں میں بول سکتا ہے۔ اصل ٹرانسکرپٹ محفوظ کیا جاتا ہے تاکہ
            بعد میں آڈٹ کے لیے استعمال ہو سکے۔
          </P>

          <H3>3. تجزیہ اور ساخت بندی</H3>
          <P>
            یہ ٹیکسٹ Gemini AI کو بھیجا جاتا ہے جو اسے ساختی نسخے میں تبدیل کرتا
            ہے۔ اس میں تشخیص، ادویات، خوراک، دورانیہ، ڈاکٹر کے نوٹس اور فالو اپ
            تاریخ شامل ہوتی ہے۔ نتیجہ ایک JSON ساخت میں واپس آتا ہے۔
          </P>

          <H3>4. جائزہ اور محفوظ کرنا</H3>
          <P>
            ڈاکٹر تمام ڈیٹا کو دیکھ اور ایڈٹ کر سکتا ہے۔ محفوظ کرنے کے بعد نسخہ
            مریض کے میڈیکل والٹ میں شامل ہو جاتا ہے اور اپائنٹمنٹ کے ساتھ لنک ہو
            جاتا ہے۔
          </P>

          <H2>دستی نسخہ</H2>
          <P>
            ڈاکٹر چاہے تو مکمل نسخہ دستی طور پر بھی لکھ سکتا ہے۔ فارم میں تشخیص،
            ادویات، نوٹس اور فالو اپ تاریخ شامل ہوتی ہے۔ دونوں طریقے (دستی اور
            آواز) ایک ہی ڈیٹا اسٹرکچر پیدا کرتے ہیں۔
          </P>

          <H2>نسخہ مینجمنٹ</H2>
          <Table
            headers={['عمل', 'اینڈ پوائنٹ', 'وقت']}
            rows={[
              ['بنائیں', 'POST /api/doctor/prescriptions', 'ملاقات کے بعد'],
              ['تبدیل کریں', 'PUT /api/doctor/prescriptions/:id', 'اسی دن تک'],
              [
                'حذف کریں',
                'DELETE /api/doctor/prescriptions/:id',
                'شاذ و نادر، تصدیق کے بعد',
              ],
              [
                'دیکھیں',
                'GET /api/doctor/prescriptions',
                'تمام نسخوں کی فہرست',
              ],
            ]}
          />

          <InfoCard variant='warning' title='ترمیم کی حد'>
            نسخہ صرف اسی دن ترمیم کیا جا سکتا ہے جس دن بنایا گیا ہو۔ اس کے بعد
            یہ ریکارڈ صرف پڑھنے کے لیے (read-only) ہو جاتا ہے تاکہ میڈیکل ریکارڈ
            کی سالمیت برقرار رہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The prescription system is the most distinctive feature of The Care
            Nexus. While other systems require doctors to type every
            prescription field manually, The Care Nexus offers a voice-first
            workflow: the doctor speaks naturally, the system transcribes and
            structures the prescription automatically, and the doctor simply
            reviews, edits if needed, and saves. This reduces prescription
            creation time from several minutes to under 30 seconds.
          </P>

          <H2>Voice Prescription Workflow</H2>

          <H3>1. Record</H3>
          <P>
            The doctor clicks the microphone button on the prescription form.
            The browser's <Code>MediaRecorder</Code> API captures audio in WebM
            or WAV format. Recording stops on a second click or after 5 minutes
            (timeout safety). The audio blob is sent as multipart form data to{' '}
            <Code>POST /api/ai/chat/transcribe</Code>.
          </P>

          <H3>2. Transcribe</H3>
          <P>
            The GROQ API's multimodal endpoint processes the audio file and
            returns raw text. GROQ supports both Urdu and English natively, so
            doctors can speak in either language. The raw transcript is
            preserved and stored in the prescription for audit purposes.
          </P>

          <H3>3. Parse</H3>
          <P>
            The raw transcript is passed to{' '}
            <Code>POST /api/ai/gemini/parse-prescription</Code>. A carefully
            crafted system prompt instructs Gemini to extract: diagnosis, list
            of medicines with dosage/frequency/duration, doctor notes, and
            follow-up date if mentioned. The response is a validated JSON
            object.
          </P>

          <CodeBlock label='AI parsed prescription response'>
            {`{
  "diagnosis": "Acute pharyngitis with mild fever",
  "medicines": [
    { "name": "Amoxicillin", "dosage": "500mg", "frequency": "3x daily", "duration": "7 days" },
    { "name": "Paracetamol", "dosage": "500mg", "frequency": "as needed", "duration": "3 days" }
  ],
  "notes": "Rest advised. Plenty of fluids. Return if fever persists beyond 3 days.",
  "followUpDate": "2026-06-22"
}`}
          </CodeBlock>

          <H3>4. Review and Save</H3>
          <P>
            The parsed data pre-fills the prescription form. Every field is
            editable — the doctor can add, remove, or correct any detail. On
            save, the final prescription is posted to{' '}
            <Code>POST /api/doctor/prescriptions</Code>, linked to the patient
            and appointment, and the patient's medical vault is immediately
            updated.
          </P>

          <H2>Manual Prescription</H2>
          <P>
            The manual form is also available for doctors who prefer to type. It
            presents the same field structure: diagnosis text area, a dynamic
            medicine list where medicines can be added one by one, notes, and
            follow-up date picker. Both manual and voice prescriptions produce
            identical data structures in the database.
          </P>

          <H2>Prescription Management</H2>
          <Table
            headers={['Action', 'Endpoint', 'When']}
            rows={[
              [
                'Create',
                'POST /api/doctor/prescriptions',
                'After appointment visit',
              ],
              [
                'Edit',
                'PUT  /api/doctor/prescriptions/:id',
                'Before patient has seen it (same day only)',
              ],
              [
                'Delete',
                'DELETE /api/doctor/prescriptions/:id',
                'Rare — requires confirmation modal',
              ],
              [
                'List',
                'GET /api/doctor/prescriptions',
                'Paginated history, searchable by patient name',
              ],
            ]}
          />

          <InfoCard variant='warning' title='Edit window'>
            Prescription edits are allowed only on the same calendar day as
            creation. After midnight, the prescription becomes read-only to
            preserve medical record integrity. The doctor can add a new
            prescription if corrections are needed after this window.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
