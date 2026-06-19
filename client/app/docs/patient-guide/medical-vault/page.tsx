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

export default function MedicalVaultPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Medical Vault'
      titleUr='طبی خزانہ'
      description='Your complete chronological health record — every prescription, diagnosis, and treatment in one place.'
      descriptionUr='آپ کا مکمل میڈیکل ریکارڈ سسٹم جہاں ہر نسخہ، تشخیص اور علاج محفوظ ہوتا ہے۔'
      breadcrumbs={[
        { label: 'Patient Guide', href: '/docs/patient-guide/dashboard' },
        { label: 'Medical Vault' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            میڈیکل والٹ مریض کے تمام طبی ریکارڈز کا مرکزی ڈیجیٹل سسٹم ہے۔ یہاں
            ہر ڈاکٹر کی طرف سے لکھا گیا نسخہ، تشخیص، علاج اور فالو اپ تاریخ
            محفوظ کی جاتی ہے۔ یہ سسٹم اس لیے بنایا گیا ہے تاکہ مریض اپنی پوری
            میڈیکل ہسٹری ایک ہی جگہ آسانی سے دیکھ سکے۔
          </P>

          <P>
            روایتی کاغذی ریکارڈز کے برعکس، یہ ایک مستقل ڈیجیٹل ریکارڈ ہے جو کبھی
            ضائع نہیں ہوتا اور کسی بھی کلینک یا ڈاکٹر کے ساتھ جڑا رہتا ہے۔
          </P>

          <H2>کیا محفوظ کیا جاتا ہے؟</H2>

          <P>
            ہر ریکارڈ ایک مکمل نسخہ ہوتا ہے جو اپائنٹمنٹ مکمل ہونے کے بعد ڈاکٹر
            کی طرف سے بنایا جاتا ہے۔ اس میں تشخیص، دواؤں کی تفصیل، ڈاکٹر کے
            نوٹس، فالو اپ تاریخ اور اگر وائس نسخہ استعمال ہوا ہو تو اس کی
            ٹرانسکرپشن بھی شامل ہوتی ہے۔
          </P>

          <Table
            headers={['فیلڈ', 'ٹائپ', 'تفصیل']}
            rows={[
              ['diagnosis', 'String', 'ڈاکٹر کی تشخیص'],
              ['medicines', 'Array', 'دواؤں کی فہرست (نام، ڈوز، وقت، مدت)'],
              ['notes', 'String', 'ڈاکٹر کے کلینیکل نوٹس'],
              ['followUpDate', 'Date', 'فالو اپ تاریخ (یاد دہانی سسٹم کے لیے)'],
              ['rawTranscript', 'String', 'وائس پریسکرپشن کی اصل ٹرانسکرپشن'],
              ['audioUrl', 'String', 'ریکارڈ شدہ آڈیو کا کلاؤڈ لنک'],
              ['doctorId', 'ObjectId', 'نسخہ لکھنے والے ڈاکٹر کا ریفرنس'],
              ['appointmentId', 'ObjectId', 'اصل اپائنٹمنٹ کا ریفرنس'],
            ]}
          />

          <H2>ریکارڈز تک رسائی</H2>

          <H3>ٹائم لائن ویو</H3>
          <P>
            ڈیفالٹ ویو میں تمام میڈیکل ریکارڈز ایک ٹائم لائن کی شکل میں دکھائے
            جاتے ہیں۔ ہر کارڈ میں تاریخ، ڈاکٹر کا نام، کلینک کا نام، تشخیص اور
            دواؤں کا خلاصہ شامل ہوتا ہے۔ کارڈ پر کلک کرنے سے مکمل تفصیل کھل جاتی
            ہے۔
          </P>

          <H3>فیملی ممبرز کے ریکارڈز</H3>
          <P>
            اگر مریض نے اپنے فیملی ممبرز شامل کیے ہوں تو وہ ان کے ریکارڈ بھی
            دیکھ سکتا ہے۔ ہر فیملی ممبر کا الگ میڈیکل والٹ ہوتا ہے جسے اوپر
            موجود سلیکٹر سے تبدیل کیا جا سکتا ہے۔ یہ ڈیٹا مکمل طور پر الگ اور
            محفوظ ہوتا ہے۔
          </P>

          <H2>API اینڈ پوائنٹس</H2>

          <Table
            headers={['طریقہ', 'اینڈ پوائنٹ', 'تفصیل']}
            rows={[
              [
                'GET',
                '/api/patient/records',
                'تمام میڈیکل ریکارڈز کی فہرست (نئے سے پرانے)',
              ],
              [
                'GET',
                '/api/patient/records/:id',
                'ایک مخصوص ریکارڈ کی مکمل تفصیل',
              ],
              [
                'GET',
                '/api/patient/family/:memberId/records',
                'فیملی ممبر کے ریکارڈز',
              ],
            ]}
          />

          <H2>فالو اپ آٹومیشن</H2>

          <P>
            اگر کسی نسخے میں <Code>followUpDate</Code> شامل ہو تو سسٹم خود بخود
            مریض کو یاد دہانی بھیجتا ہے۔ یہ سسٹم ہر 6 گھنٹے بعد چیک کرتا ہے اور
            24 گھنٹے پہلے نوٹیفکیشن اور ای میل بھیج دیتا ہے تاکہ مریض وقت پر
            دوبارہ ڈاکٹر سے رابطہ کر سکے۔
          </P>

          <InfoCard variant='tip' title='ریکارڈ مستقل ہوتے ہیں'>
            میڈیکل ریکارڈز کبھی بھی ڈیلیٹ نہیں کیے جاتے۔ چاہے ڈاکٹر مریض کو اپنی
            لسٹ سے ہٹا دے یا اپائنٹمنٹ کینسل ہو جائے، نسخہ ہمیشہ مریض کے اکاؤنٹ
            میں محفوظ رہتا ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          {/* English unchanged */}
          <P>The Medical Vault is the patient's complete health timeline...</P>

          <H2>What's Stored</H2>

          <P>
            Each record in the Medical Vault corresponds to one prescription...
          </P>

          <Table
            headers={['Field', 'Type', 'Description']}
            rows={[
              ['diagnosis', 'String', "Doctor's diagnosis text"],
              ['medicines', 'Array', 'List of medicines'],
              ['notes', 'String', "Doctor's notes"],
              ['followUpDate', 'Date', 'Follow-up reminder trigger'],
              ['rawTranscript', 'String', 'Voice transcription'],
              ['audioUrl', 'String', 'Audio file URL'],
              ['doctorId', 'ObjectId', 'Doctor reference'],
              ['appointmentId', 'ObjectId', 'Appointment reference'],
            ]}
          />

          <H2>Accessing Records</H2>

          <H3>Timeline View</H3>

          <P>The default view is a descending chronological timeline...</P>

          <H3>Family Member Records</H3>

          <P>Each family member has their own sub-vault...</P>

          <H2>API Endpoints</H2>

          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              ['GET', '/api/patient/records', 'List all records'],
              ['GET', '/api/patient/records/:id', 'Single record detail'],
              [
                'GET',
                '/api/patient/family/:memberId/records',
                'Family member records',
              ],
            ]}
          />

          <H2>Follow-Up Automation</H2>

          <P>When a prescription includes a follow-up date...</P>

          <InfoCard variant='tip' title='Record permanence'>
            Medical records are never deleted...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
