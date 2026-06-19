'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import { P, H2, UL, LI, Table, InfoCard } from '../../components/DocProse';

export default function StaffManagementPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Staff Management'
      titleUr='عملہ انتظام'
      description='Manage receptionists, support staff, and doctor assignments within your clinic.'
      breadcrumbs={[
        {
          label: 'Clinic Administration',
          href: '/docs/clinic-administration/dashboard',
        },
        { label: 'Staff Management' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            کلینک ایڈمن کلینک کے اندر تمام غیر طبی عملے (Non-Physician Staff) کا
            مکمل انتظام کر سکتا ہے۔ اس میں ریسپشنسٹ، معاون عملہ اور دیگر سپورٹ
            رولز شامل ہوتے ہیں۔
          </P>

          <H2>عملے کی اقسام</H2>
          <UL>
            <LI>
              <strong>کلینک ایڈمن</strong> — مکمل رسائی: تمام سیٹنگز، اینالیٹکس
              اور سسٹم کنٹرول
            </LI>
            <LI>
              <strong>ریسپشنسٹ</strong> — اپائنٹمنٹس دیکھنا، اپڈیٹ کرنا اور واک
              اِن مریض شامل کرنا
            </LI>
            <LI>
              <strong>سپورٹ اسٹاف</strong> — صرف پڑھنے کی اجازت (Read-only)
              اپائنٹمنٹ شیڈول تک رسائی
            </LI>
          </UL>

          <H2>ڈاکٹرز کا انتظام</H2>
          <P>
            ڈاکٹر اسٹاف سے مختلف ہوتے ہیں کیونکہ وہ آزاد رجسٹرڈ صارف ہوتے ہیں۔
            کلینک ایڈمن انہیں صرف ای میل کے ذریعے کلینک سے منسلک کرتا ہے۔ ڈاکٹر
            کا اکاؤنٹ ڈیلیٹ نہیں کیا جاتا بلکہ صرف کلینک سے unlink کیا جاتا ہے،
            تاکہ تمام پرانے ریکارڈ محفوظ رہیں۔
          </P>

          <H2>اہم نوٹ</H2>
          <P>
            کسی بھی اسٹاف اکاؤنٹ کو حذف کرنے کے بجائے عارضی طور پر deactivate
            کرنا بہتر ہے تاکہ بعد میں دوبارہ رسائی دی جا سکے۔
          </P>
        </>
      ) : (
        <>
          <P>
            The Staff Management module gives clinic administrators complete
            control...
          </P>

          <H2>Staff Account Types</H2>
          <UL>
            <LI>
              <strong>Clinic Admin</strong> — Full access...
            </LI>
            <LI>
              <strong>Receptionist</strong> — Manage appointments...
            </LI>
            <LI>
              <strong>Support Staff</strong> — Read-only access...
            </LI>
          </UL>

          <H2>Managing Doctors</H2>
          <P>Doctors are distinct from staff...</P>

          <H2>API Endpoints</H2>
          <Table
            headers={['Method', 'Endpoint', 'Description']}
            rows={[
              ['GET', '/api/clinic/staff', 'List all staff accounts'],
              ['POST', '/api/clinic/staff', 'Create staff account'],
              ['PUT', '/api/clinic/staff/:id', 'Update staff'],
              ['DELETE', '/api/clinic/staff/:id', 'Remove staff'],
              ['GET', '/api/clinic/doctors', 'List doctors'],
              ['POST', '/api/clinic/doctors', 'Invite doctor'],
              ['DELETE', '/api/clinic/doctors/:id', 'Unlink doctor'],
            ]}
          />

          <InfoCard variant='warning' title='Staff account deletion'>
            Deleting a staff account is irreversible...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
