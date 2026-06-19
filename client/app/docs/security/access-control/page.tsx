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

export default function AccessControlPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Access Control'
      titleUr='رسائی کنٹرول'
      description='Role-based access control (RBAC), middleware enforcement, and route protection.'
      breadcrumbs={[
        { label: 'Security', href: '/docs/security/privacy' },
        { label: 'Access Control' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس ایک Role-Based Access Control (RBAC) سسٹم استعمال کرتا
            ہے۔ ہر صارف کو اس کے کردار کے مطابق مخصوص ڈیٹا اور فیچرز تک رسائی دی
            جاتی ہے۔
          </P>

          <H2>کردار (Roles)</H2>
          <Table
            headers={['کردار', 'اہم اجازتیں', 'رسائی نہیں']}
            rows={[
              [
                'patient',
                'اپنے ریکارڈز، اپنی اپائنٹمنٹس، فیملی ریکارڈز، AI چیٹ',
                'دوسرے مریضوں کا ڈیٹا، ڈاکٹر مینجمنٹ، کلینک اینالیٹکس',
              ],
              [
                'doctor',
                'اپنے مریض، نسخے، شیڈول، آمدنی',
                'دوسرے ڈاکٹروں کے مریض، کلینک اسٹاف مینجمنٹ',
              ],
              [
                'clinic_admin',
                'تمام ڈاکٹرز، اسٹاف، اپائنٹمنٹس، اینالیٹکس',
                'دوسرے کلینکس کا ڈیٹا، پلیٹ فارم لیول یوزرز',
              ],
            ]}
          />

          <H2>Middleware سسٹم</H2>

          <H3>authMiddleware</H3>
          <P>
            ہر محفوظ API روٹ پہلے <Code>authMiddleware</Code> سے گزرتا ہے جو JWT
            ٹوکن کو verify کرتا ہے۔ اگر ٹوکن غلط، expire یا missing ہو تو فوراً{' '}
            <Code>401 Unauthorized</Code> واپس کر دیا جاتا ہے۔ کامیاب
            verification کے بعد user data (<Code>userId</Code>,{' '}
            <Code>role</Code>) کو <Code>req.user</Code> میں attach کیا جاتا ہے۔
          </P>

          <H3>roleMiddleware</H3>
          <P>
            اس کے بعد <Code>roleMiddleware</Code> چیک کرتا ہے کہ یوزر کا رول
            route کے مطابق ہے یا نہیں۔ مثال کے طور پر <Code>/api/clinic/*</Code>{' '}
            صرف <Code>clinic_admin</Code> کے لیے ہوتا ہے۔ اگر ڈاکٹر اس route تک
            رسائی کرے تو <Code>403 Forbidden</Code> واپس کیا جاتا ہے۔
          </P>

          <H2>Frontend Route Guards</H2>
          <P>
            ہر portal (Doctor, Patient, Clinic) کا layout یوزر کا رول
            localStorage سے چیک کرتا ہے۔ اگر رول mismatch ہو تو یوزر کو فوراً{' '}
            <Code>/login</Code> پر redirect کر دیا جاتا ہے۔ اس سے کوئی بھی یوزر
            غلط dashboard تک نہیں جا سکتا۔
          </P>

          <InfoCard variant='warning' title='کلائنٹ پر اعتماد نہ کریں'>
            Frontend guards صرف user experience کے لیے ہیں، security کے لیے
            نہیں۔ اصل سیکیورٹی ہمیشہ backend پر enforce ہوتی ہے جہاں ہر API
            request پر token اور role دوبارہ verify کیا جاتا ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Care Nexus uses a multi-layer Role-Based Access Control (RBAC)
            system. Access is enforced at three levels: the API middleware
            layer, frontend route guards, and database query scoping. This
            defense-in-depth model ensures security even if one layer is
            bypassed.
          </P>

          <H2>Roles</H2>
          <Table
            headers={['Role', 'Key Permissions', 'Cannot Access']}
            rows={[
              [
                'patient',
                'Own records, appointments, family data, AI chat',
                "Other patients' data, doctor management, clinic analytics",
              ],
              [
                'doctor',
                'Own patients, prescriptions, schedule, revenue',
                "Other doctors' patients, clinic staff management",
              ],
              [
                'clinic_admin',
                'All clinic doctors, staff, appointments, analytics',
                "Other clinics' data, platform-wide users",
              ],
            ]}
          />

          <H2>Middleware Stack</H2>

          <H3>authMiddleware</H3>
          <P>
            Every protected API route passes through <Code>authMiddleware</Code>{' '}
            which validates the JWT token. If invalid, expired, or missing, it
            returns <Code>401 Unauthorized</Code> before reaching the
            controller. The decoded payload (<Code>userId</Code>,{' '}
            <Code>role</Code>) is attached to <Code>req.user</Code>.
          </P>

          <H3>roleMiddleware</H3>
          <P>
            <Code>roleMiddleware</Code> ensures that the user’s role matches the
            required role for the endpoint. For example, all{' '}
            <Code>/api/clinic/*</Code> routes require <Code>clinic_admin</Code>.
            Unauthorized access results in <Code>403 Forbidden</Code>.
          </P>

          <H2>Frontend Route Guards</H2>
          <P>
            Layout components (<Code>DoctorLayout</Code>,{' '}
            <Code>PatientLayout</Code>, <Code>ClinicLayout</Code>) check the
            user role from localStorage on mount. If mismatched, the user is
            redirected to <Code>/login</Code>, preventing access to unauthorized
            dashboards.
          </P>

          <InfoCard variant='warning' title='Never trust the client'>
            Frontend guards improve UX but do not provide security. All
            authorization is enforced on the backend for every request.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
