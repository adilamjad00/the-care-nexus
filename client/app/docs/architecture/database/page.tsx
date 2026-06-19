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

export default function DatabasePage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Database Design'
      titleUr='ڈیٹا بیس ڈیزائن'
      description='MongoDB schema design, collection relationships, and indexing strategy.'
      breadcrumbs={[
        { label: 'Architecture', href: '/docs/architecture/system-design' },
        { label: 'Database' },
      ]}
      lastUpdated='June 2026'
      readingTime='7 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس MongoDB Atlas کو primary database کے طور پر استعمال
            کرتا ہے اور Mongoose ODM کے ذریعے manage کیا جاتا ہے۔ ڈیٹا بیس کا
            ڈیزائن healthcare domain کے core entities پر مبنی ہے جیسے users،
            doctors، patients، clinics، appointments اور prescriptions۔
          </P>

          <H2>اہم کلیکشنز (Core Collections)</H2>

          <Table
            headers={['کلیکشن', 'مقصد', 'اہم فیلڈز']}
            rows={[
              [
                'users',
                'تمام users کی authentication identity',
                'email, password (hashed), role, isVerified, language',
              ],
              [
                'doctors',
                'ڈاکٹر پروفائل (user سے linked)',
                'userId, clinicId, specialization, schedule, licenseNo',
              ],
              [
                'patients',
                'مریض کا پروفائل (user سے linked)',
                'userId, dob, bloodGroup, allergies[]',
              ],
              [
                'clinics',
                'کلینک کی معلومات اور settings',
                'name, address, phone, doctors[], workingHours',
              ],
              [
                'appointments',
                'تمام اپائنٹمنٹس کا ریکارڈ',
                'doctorId, patientId, clinicId, dateTime, status',
              ],
              [
                'prescriptions',
                'Structured نسخے (medicines کے ساتھ)',
                'doctorId, patientId, diagnosis, medicines[], audioUrl',
              ],
              [
                'medicalrecords',
                'مریض کی health history کا ریکارڈ',
                'patientId, prescriptionId, familyMemberId',
              ],
              [
                'familymembers',
                'مریض کے dependents (family)',
                'patientId, name, dob, relationship',
              ],
              [
                'messages',
                'Encrypted chat messages',
                'conversationId, senderId, content (encrypted)',
              ],
              [
                'conversations',
                'Doctor-patient chat rooms',
                'participants[], unreadCount',
              ],
              [
                'notifications',
                'System notifications',
                'userId, type, message, read',
              ],
              [
                'revenueentries',
                'کلینک آمدنی کا ریکارڈ',
                'doctorId, appointmentId, amount, createdAt',
              ],
              [
                'analytics',
                'روزانہ کی aggregated stats',
                'clinicId, date, totalPatients, totalRevenue',
              ],
            ]}
          />

          <H2>اہم تعلقات (Key Relationships)</H2>

          <H3>User → Doctor / Patient</H3>
          <P>
            ہر User document ایک authentication identity ہوتا ہے۔ Doctor اور
            Patient collections الگ رکھے گئے ہیں اور <Code>userId</Code> کے
            ذریعے link ہوتے ہیں۔ اس سے auth system کو role resolve کرنے میں
            آسانی ہوتی ہے اور profile data الگ رہتا ہے۔
          </P>

          <H3>Appointment → Prescription</H3>
          <P>
            ہر appointment کے ساتھ ایک prescription linked ہوتا ہے (1:1
            relationship)۔ دونوں میں <Code>appointmentId</Code> موجود ہوتا ہے،
            جبکہ efficient queries کے لیے <Code>doctorId</Code> اور{' '}
            <Code>patientId</Code> بھی directly store کیے جاتے ہیں۔
          </P>

          <H2>Indexing Strategy</H2>

          <UL>
            <LI>
              Appointments: compound index <Code>(doctorId, dateTime)</Code> —
              queue performance کے لیے
            </LI>
            <LI>
              Appointments: compound index <Code>(patientId, status)</Code> —
              patient view کے لیے
            </LI>
            <LI>
              Prescriptions: index on <Code>patientId</Code> — medical vault
              queries
            </LI>
            <LI>
              Users: unique index on <Code>email</Code> — login optimization
            </LI>
            <LI>
              Messages: compound index <Code>(conversationId, createdAt)</Code>{' '}
              — chat history
            </LI>
          </UL>

          <InfoCard variant='tip' title='Connection pooling'>
            Mongoose connection server startup پر ایک بار initialize کیا جاتا
            ہے۔ Connection pool max 10 size پر set ہے تاکہ concurrent requests
            smoothly handle ہو سکیں۔ High traffic میں pool size بڑھایا جا سکتا
            ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Care Nexus uses MongoDB Atlas as its primary database with
            Mongoose as the ODM layer. The schema is designed around the core
            entities of the healthcare domain: users, clinics, doctors,
            patients, appointments, and prescriptions.
          </P>

          <H2>Core Collections</H2>

          <Table
            headers={['Collection', 'Purpose', 'Key Fields']}
            rows={[
              [
                'users',
                'Authentication identity for all roles',
                'email, password (hashed), role, isVerified, language',
              ],
              [
                'doctors',
                'Doctor profile linked to user',
                'userId, clinicId, specialization, schedule, licenseNo',
              ],
              [
                'patients',
                'Patient profile linked to user',
                'userId, dob, bloodGroup, allergies[]',
              ],
              [
                'clinics',
                'Clinic entity and settings',
                'name, address, phone, doctors[], workingHours',
              ],
              [
                'appointments',
                'All appointment records across the system',
                'doctorId, patientId, clinicId, dateTime, status',
              ],
              [
                'prescriptions',
                'Structured prescriptions with medicines',
                'doctorId, patientId, diagnosis, medicines[], audioUrl',
              ],
              [
                'medicalrecords',
                'Pointer from patient to prescription',
                'patientId, prescriptionId, familyMemberId',
              ],
              [
                'familymembers',
                'Dependents linked to patient accounts',
                'patientId, name, dob, relationship',
              ],
              [
                'messages',
                'Encrypted chat messages',
                'conversationId, senderId, content (encrypted)',
              ],
              [
                'conversations',
                'Chat rooms between doctor-patient pairs',
                'participants[], unreadCount',
              ],
              [
                'notifications',
                'Persistent notification records',
                'userId, type, message, read',
              ],
              [
                'revenueentries',
                'Consultation fee records',
                'doctorId, appointmentId, amount, createdAt',
              ],
              [
                'analytics',
                'Nightly aggregated clinic stats',
                'clinicId, date, totalPatients, totalRevenue',
              ],
            ]}
          />

          <H2>Key Relationships</H2>

          <H3>User → Doctor / Patient</H3>
          <P>
            Each User document represents the authentication identity. Doctor
            and Patient collections extend it via <Code>userId</Code> reference.
            This keeps auth data separate from profile data and simplifies role
            resolution.
          </P>

          <H3>Appointment → Prescription</H3>
          <P>
            Each appointment has a 1:1 relationship with prescription via{' '}
            <Code>appointmentId</Code>. Both entities also store{' '}
            <Code>doctorId</Code> and <Code>patientId</Code> for efficient
            queries without joins.
          </P>

          <H2>Indexing Strategy</H2>

          <UL>
            <LI>
              Appointments: compound index on <Code>(doctorId, dateTime)</Code>
            </LI>
            <LI>
              Appointments: compound index on <Code>(patientId, status)</Code>
            </LI>
            <LI>
              Prescriptions: index on <Code>patientId</Code>
            </LI>
            <LI>
              Users: unique index on <Code>email</Code>
            </LI>
            <LI>
              Messages: compound index on{' '}
              <Code>(conversationId, createdAt)</Code>
            </LI>
          </UL>

          <InfoCard variant='tip' title='Connection pooling'>
            The Mongoose connection is initialized once at startup with a max
            pool size of 10 for efficient request handling. This can be tuned
            for high-traffic deployments.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
