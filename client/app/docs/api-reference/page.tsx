'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../components/DocLayout';
import { P, H2, H3, Table, InfoCard, Code } from '../components/DocProse';

export default function ApiReferencePage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='API Reference'
      titleUr='اے پی آئی حوالہ'
      description='Complete REST API documentation — all endpoints, request formats, and response schemas.'
      breadcrumbs={[{ label: 'API Reference' }]}
      lastUpdated='June 2026'
      readingTime='12 min read'
    >
      {isUrdu ? (
        <>
          <P>
            یہ صفحہ دی کیئر نیکسس کے تمام REST API endpoints کی مکمل دستاویز
            فراہم کرتا ہے۔ Development میں base URL{' '}
            <Code>http://localhost:5000/api</Code> ہے جبکہ production میں آپ
            اپنا deployed backend URL استعمال کریں گے۔
          </P>

          <P>
            تمام protected endpoints کے لیے JWT token ضروری ہے جو header میں اس
            فارمیٹ میں بھیجا جاتا ہے:{' '}
            <Code>Authorization: Bearer &lt;token&gt;</Code>
          </P>

          <H2>Authentication APIs</H2>
          <Table
            headers={['Method', 'Endpoint', 'Auth', 'تفصیل']}
            rows={[
              [
                'POST',
                '/auth/register',
                'None',
                'نیا اکاؤنٹ بنانا (name, email, password, role)',
              ],
              ['POST', '/auth/login', 'None', 'لاگ اِن (email, password)'],
              [
                'POST',
                '/auth/logout',
                'Bearer',
                'Refresh token کو invalidate کرنا',
              ],
              ['POST', '/auth/refresh', 'None', 'نیا access token حاصل کرنا'],
              ['POST', '/auth/forgot-password', 'None', 'Reset email بھیجنا'],
              [
                'POST',
                '/auth/reset-password/:token',
                'None',
                'نیا password سیٹ کرنا',
              ],
              ['GET', '/auth/verify/:token', 'None', 'Email verification'],
            ]}
          />

          <H2>Patient APIs</H2>
          <Table
            headers={['Method', 'Endpoint', 'تفصیل']}
            rows={[
              ['GET', '/patient/dashboard', 'Patient dashboard stats'],
              ['GET', '/patient/profile', 'Patient profile دیکھنا'],
              ['PUT', '/patient/profile', 'Profile update کرنا'],
              ['GET', '/patient/appointments', 'Appointments کی فہرست'],
              ['POST', '/patient/appointments', 'نیا appointment بک کرنا'],
              [
                'PUT',
                '/patient/appointments/:id/cancel',
                'Appointment cancel کرنا',
              ],
              ['GET', '/patient/records', 'Medical records (vault)'],
              ['GET', '/patient/records/:id', 'Single record detail'],
              ['GET', '/patient/family', 'Family members list'],
              ['POST', '/patient/family', 'Family member add کرنا'],
              ['PUT', '/patient/family/:memberId', 'Family member update'],
              ['DELETE', '/patient/family/:memberId', 'Family member delete'],
              [
                'GET',
                '/patient/family/:memberId/records',
                'Family records دیکھنا',
              ],
            ]}
          />

          <H2>Doctor APIs</H2>
          <Table
            headers={['Method', 'Endpoint', 'تفصیل']}
            rows={[
              [
                'GET',
                '/doctor/patients',
                'Patients list (search + pagination)',
              ],
              ['POST', '/doctor/patients', 'Email کے ذریعے patient add کرنا'],
              ['GET', '/doctor/patients/:id', 'Patient detail'],
              ['DELETE', '/doctor/patients/:id', 'Patient remove کرنا'],
              ['GET', '/doctor/appointments', 'Today + upcoming queue'],
              ['PUT', '/doctor/appointments/:id', 'Status update کرنا'],
              ['GET', '/doctor/prescriptions', 'Prescription history'],
              ['POST', '/doctor/prescriptions', 'نیا prescription بنانا'],
              ['PUT', '/doctor/prescriptions/:id', 'Edit (same-day only)'],
              ['DELETE', '/doctor/prescriptions/:id', 'Prescription delete'],
              ['GET', '/doctor/schedule', 'Weekly schedule حاصل کرنا'],
              ['PUT', '/doctor/schedule', 'Schedule update کرنا'],
              ['GET', '/doctor/revenue', 'Revenue data (filters کے ساتھ)'],
            ]}
          />

          <H2>Clinic Admin APIs</H2>
          <Table
            headers={['Method', 'Endpoint', 'تفصیل']}
            rows={[
              ['GET', '/clinic/analytics/overview', 'Dashboard KPIs'],
              ['GET', '/clinic/analytics/patient-flow', 'Daily patient data'],
              ['GET', '/clinic/analytics/revenue', 'Revenue analytics'],
              ['GET', '/clinic/doctors', 'Clinic doctors list'],
              ['POST', '/clinic/doctors', 'Doctor invite کرنا'],
              ['DELETE', '/clinic/doctors/:id', 'Doctor remove کرنا'],
              ['GET', '/clinic/doctors/:id/stats', 'Doctor performance stats'],
              ['GET', '/clinic/appointments', 'All clinic appointments'],
              ['GET', '/clinic/settings', 'Clinic settings'],
              ['PUT', '/clinic/settings', 'Settings update کرنا'],
              ['GET', '/clinic/staff', 'Staff list'],
              ['POST', '/clinic/staff', 'Staff create کرنا'],
              ['PUT', '/clinic/staff/:id', 'Staff update کرنا'],
              ['DELETE', '/clinic/staff/:id', 'Staff remove کرنا'],
            ]}
          />

          <H2>AI APIs</H2>
          <Table
            headers={['Method', 'Endpoint', 'تفصیل']}
            rows={[
              ['POST', '/ai/gemini/chat', 'AI chat (Gemini)'],
              ['POST', '/ai/chat/transcribe', 'Voice transcription'],
              ['POST', '/ai/gemini/parse-prescription', 'Transcript parsing'],
            ]}
          />

          <InfoCard variant='tip' title='Response Format'>
            تمام API responses ایک ہی structure follow کرتے ہیں:{' '}
            <Code>{`{ success, message, data, statusCode }`}</Code>. ہمیشہ{' '}
            <Code>success === true</Code> چیک کریں پھر data استعمال کریں۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            This page documents all available REST API endpoints in The Care
            Nexus. The base URL for all endpoints in development is{' '}
            <Code>http://localhost:5000/api</Code>. In production, replace with
            your deployed backend URL.
          </P>

          <P>
            All protected endpoints require a valid JWT token in{' '}
            <Code>Authorization: Bearer &lt;token&gt;</Code>.
          </P>

          <H2>Authentication</H2>
          <Table
            headers={['Method', 'Endpoint', 'Auth', 'Description']}
            rows={[
              ['POST', '/auth/register', 'None', 'Create account'],
              ['POST', '/auth/login', 'None', 'Login user'],
              ['POST', '/auth/logout', 'Bearer', 'Invalidate session'],
              ['POST', '/auth/refresh', 'None', 'Refresh token'],
              ['POST', '/auth/forgot-password', 'None', 'Send reset email'],
              ['POST', '/auth/reset-password/:token', 'None', 'Reset password'],
              ['GET', '/auth/verify/:token', 'None', 'Verify email'],
            ]}
          />

          <H2>Patient Endpoints</H2>
          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              ['GET', '/patient/dashboard', 'Dashboard stats'],
              ['GET', '/patient/profile', 'Get profile'],
              ['PUT', '/patient/profile', 'Update profile'],
              ['GET', '/patient/appointments', 'List appointments'],
              ['POST', '/patient/appointments', 'Book appointment'],
              ['PUT', '/patient/appointments/:id/cancel', 'Cancel appointment'],
              ['GET', '/patient/records', 'Medical records'],
              ['GET', '/patient/records/:id', 'Record detail'],
              ['GET', '/patient/family', 'Family members'],
              ['POST', '/patient/family', 'Add family member'],
              ['PUT', '/patient/family/:memberId', 'Update family member'],
              ['DELETE', '/patient/family/:memberId', 'Delete family member'],
              ['GET', '/patient/family/:memberId/records', 'Family records'],
            ]}
          />

          <H2>Doctor Endpoints</H2>
          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              ['GET', '/doctor/patients', 'Patient list'],
              ['POST', '/doctor/patients', 'Add patient'],
              ['GET', '/doctor/patients/:id', 'Patient detail'],
              ['DELETE', '/doctor/patients/:id', 'Remove patient'],
              ['GET', '/doctor/appointments', 'Appointments queue'],
              ['PUT', '/doctor/appointments/:id', 'Update status'],
              ['GET', '/doctor/prescriptions', 'Prescription history'],
              ['POST', '/doctor/prescriptions', 'Create prescription'],
              ['PUT', '/doctor/prescriptions/:id', 'Edit prescription'],
              ['DELETE', '/doctor/prescriptions/:id', 'Delete prescription'],
              ['GET', '/doctor/schedule', 'Get schedule'],
              ['PUT', '/doctor/schedule', 'Update schedule'],
              ['GET', '/doctor/revenue', 'Revenue data'],
            ]}
          />

          <H2>Clinic Admin Endpoints</H2>
          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              ['GET', '/clinic/analytics/overview', 'KPIs'],
              ['GET', '/clinic/analytics/patient-flow', 'Patient flow'],
              ['GET', '/clinic/analytics/revenue', 'Revenue analytics'],
              ['GET', '/clinic/doctors', 'Doctors list'],
              ['POST', '/clinic/doctors', 'Invite doctor'],
              ['DELETE', '/clinic/doctors/:id', 'Remove doctor'],
              ['GET', '/clinic/doctors/:id/stats', 'Doctor stats'],
              ['GET', '/clinic/appointments', 'All appointments'],
              ['GET', '/clinic/settings', 'Clinic settings'],
              ['PUT', '/clinic/settings', 'Update settings'],
              ['GET', '/clinic/staff', 'Staff list'],
              ['POST', '/clinic/staff', 'Create staff'],
              ['PUT', '/clinic/staff/:id', 'Update staff'],
              ['DELETE', '/clinic/staff/:id', 'Delete staff'],
            ]}
          />

          <H2>AI Endpoints</H2>
          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              ['POST', '/ai/gemini/chat', 'AI chat'],
              ['POST', '/ai/chat/transcribe', 'Voice transcription'],
              ['POST', '/ai/gemini/parse-prescription', 'Parse prescription'],
            ]}
          />

          <InfoCard variant='tip' title='Response envelope'>
            All responses follow:{' '}
            <Code>{`{ success, message, data, statusCode }`}</Code>
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
