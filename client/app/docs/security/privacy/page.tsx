'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import { P, H2, UL, LI, InfoCard } from '../../components/DocProse';

export default function PrivacyPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Privacy'
      titleUr='رازداری'
      description='How The Care Nexus handles, stores, and protects user health data.'
      breadcrumbs={[
        { label: 'Security', href: '/docs/security/privacy' },
        { label: 'Privacy' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس ایک پرائیویسی فرسٹ آرکیٹیکچر پر بنایا گیا سسٹم ہے۔ طبی
            ڈیٹا انتہائی حساس ہوتا ہے، اس لیے سسٹم کے ہر ڈیزائن فیصلے میں مکمل
            حفاظت اور رازداری کو یقینی بنایا گیا ہے۔ مریضوں کے ریکارڈز، نسخے،
            اور کمیونیکیشن ڈیٹا کبھی بھی تیسرے فریق کے ساتھ شیئر نہیں کیے جاتے،
            نہ ہی انہیں کسی قسم کی ایڈورٹائزنگ کے لیے استعمال کیا جاتا ہے۔
          </P>

          <H2>ڈیٹا آئسولیشن ماڈل</H2>
          <P>
            ہر API درخواست صرف authenticated صارف تک محدود ہوتی ہے۔ بیک اینڈ
            middleware JWT ٹوکن کی تصدیق کرتا ہے اور <code>userId</code> کو ہر
            ڈیٹا بیس کوئری میں شامل کرتا ہے۔ اس سے یہ یقینی بنتا ہے کہ:
          </P>

          <UL>
            <LI>مریض صرف اپنا ذاتی طبی ڈیٹا دیکھ سکتے ہیں</LI>
            <LI>ڈاکٹر صرف اپنے assign کیے گئے مریضوں کا ڈیٹا دیکھ سکتے ہیں</LI>
            <LI>کلینک ایڈمن صرف اپنے کلینک کے اندر کا ڈیٹا دیکھ سکتا ہے</LI>
          </UL>

          <H2>جمع کیا جانے والا ڈیٹا</H2>
          <UL>
            <LI>اکاؤنٹ ڈیٹا — نام، ای میل، فون نمبر، رول، تاریخ پیدائش</LI>
            <LI>طبی ڈیٹا — نسخے، تشخیص، الرجی، بلڈ گروپ</LI>
            <LI>ملاقات کا ڈیٹا — شیڈول، کلینک، ڈاکٹر، نوٹس</LI>
            <LI>چیٹ پیغامات — انکرپٹڈ اور صرف متعلقہ دو صارفین کے درمیان</LI>
            <LI>وائس ریکارڈنگ — ٹرانسکرپشن کے دوران عارضی طور پر محفوظ</LI>
          </UL>

          <H2>ڈیٹا محفوظ رکھنے کی پالیسی</H2>
          <P>
            طبی ریکارڈز اور نسخے ہمیشہ کے لیے محفوظ رکھے جاتے ہیں تاکہ مریض کی
            مکمل صحت کی تاریخ برقرار رہے۔ چیٹ پیغامات کلینیکل کمیونیکیشن کے
            تسلسل کے لیے محفوظ رہتے ہیں۔
          </P>

          <P>
            وائس ریکارڈنگز جو ٹرانسکرپشن کے لیے استعمال ہوتی ہیں Cloudinary میں
            90 دن تک محفوظ رہتی ہیں، اس کے بعد خودکار طور پر حذف کر دی جاتی ہیں۔
            Redis میں موجود authentication sessions 7 دن بعد expire ہو جاتی ہیں۔
          </P>

          <InfoCard variant='info' title='سیکیورٹی معیار'>
            یہ سسٹم جدید ہیلتھ کیئر سیکیورٹی اصولوں پر بنایا گیا ہے جس میں ڈیٹا
            انکرپشن، رول بیسڈ ایکسس کنٹرول، اور آڈٹ لاگز شامل ہیں۔ پروڈکشن
            ڈیپلائمنٹ میں جو حقیقی مریضوں کا ڈیٹا ہینڈل کرتی ہے، اس کے لیے
            ریگولیٹری کمپلائنس (جیسے HIPAA، PDPA یا مقامی قوانین) کا الگ سے
            جائزہ ضروری ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Care Nexus is built with a privacy-first architecture. Medical
            data is highly sensitive, and every system design decision reflects
            strict protection principles. Patient records, prescriptions, and
            communication data are never sold, never shared with third parties,
            and never used for advertising.
          </P>

          <H2>Data Isolation Model</H2>
          <P>
            Every API request is strictly scoped to the authenticated user. The
            backend middleware validates the JWT token and injects the{' '}
            <code>userId</code> into all database queries. This ensures that:
          </P>

          <UL>
            <LI>Patients can only access their own medical data</LI>
            <LI>Doctors can only access their assigned patients</LI>
            <LI>Clinic admins can only access their clinic’s data scope</LI>
          </UL>

          <H2>Data Collected</H2>
          <UL>
            <LI>Account data — name, email, phone, role, DOB</LI>
            <LI>
              Medical data — prescriptions, diagnoses, allergies, blood group
            </LI>
            <LI>Appointment data — schedules, clinic, doctor, notes</LI>
            <LI>
              Chat messages — encrypted and scoped to 1-to-1 conversations
            </LI>
            <LI>Voice recordings — temporarily stored during transcription</LI>
          </UL>

          <H2>Data Retention Policy</H2>
          <P>
            Medical records and prescriptions are stored indefinitely to
            maintain a complete health history. Chat messages are retained to
            ensure continuity of clinical communication.
          </P>

          <P>
            Voice recordings used for transcription are stored in Cloudinary
            with a 90-day retention policy, after which they are automatically
            deleted. Authentication sessions stored in Redis expire after 7
            days.
          </P>

          <InfoCard variant='info' title='Security alignment'>
            The system follows modern healthcare security practices including
            encryption at rest, role-based access control, and audit logging.
            Production deployments handling real patient data should still
            undergo formal compliance review (e.g., HIPAA, PDPA, or local
            healthcare regulations).
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
