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

export default function ApiArchitecturePage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='API Architecture'
      titleUr='اے پی آئی فن تعمیر'
      description='REST API design, request/response structure, error handling, and route organization.'
      breadcrumbs={[
        { label: 'Architecture', href: '/docs/architecture/system-design' },
        { label: 'API' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس کا بیک اینڈ REST API Express.js پر بنایا گیا ہے۔ یہ
            API مستقل (consistent) ریسپانس فارمیٹ، مرکزی error handling، اور JWT
            authentication کے اصولوں پر کام کرتا ہے تاکہ فرنٹ اینڈ ہمیشہ
            predictable data حاصل کرے۔
          </P>

          <H2>ریسپانس فارمیٹ</H2>
          <P>
            تمام API responses (success اور error دونوں) ایک ہی structure میں
            آتے ہیں:
          </P>

          <Table
            headers={['فیلڈ', 'ٹائپ', 'تفصیل']}
            rows={[
              [
                'success',
                'boolean',
                'اگر request کامیاب ہو تو true، ورنہ false',
              ],
              ['message', 'string', 'یوزر کے لیے readable status message'],
              ['data', 'any', 'اصل response payload (error میں null)'],
              ['error', 'string', 'error کی تفصیل (success میں null)'],
              ['statusCode', 'number', 'HTTP status code'],
            ]}
          />

          <H2>Route Structure</H2>
          <UL>
            <LI>
              <Code>/api/auth/*</Code> — login, register اور password recovery
              جیسے public authentication routes
            </LI>
            <LI>
              <Code>/api/doctor/*</Code> — صرف doctor role کے لیے routes
            </LI>
            <LI>
              <Code>/api/patient/*</Code> — صرف patient role کے لیے routes
            </LI>
            <LI>
              <Code>/api/clinic/*</Code> — clinic admin کے لیے management routes
            </LI>
            <LI>
              <Code>/api/ai/*</Code> — AI features (Gemini chat، transcription)
            </LI>
            <LI>
              <Code>/api/chat/*</Code> — chat history اور room management
            </LI>
            <LI>
              <Code>/api/notifications/*</Code> — notifications handling
            </LI>
            <LI>
              <Code>/api/public/*</Code> — public access routes (doctor search
              وغیرہ)
            </LI>
          </UL>

          <H2>Error Handling</H2>
          <P>
            تمام errors ایک global error handler middleware کے ذریعے handle کیے
            جاتے ہیں۔ ہر controller asyncHandler wrapper استعمال کرتا ہے تاکہ
            try/catch بار بار لکھنے کی ضرورت نہ پڑے۔
          </P>

          <P>
            اگر کوئی error ہوتا ہے تو وہ ApiError کے ذریعے status code اور
            message کے ساتھ global handler کو جاتا ہے، جو اسے standard response
            format میں convert کرتا ہے۔
          </P>

          <H2>Validation</H2>
          <P>
            تمام incoming requests Joi schemas کے ذریعے validate کی جاتی ہیں۔
            اگر payload غلط ہو تو API فوراً <Code>400 Bad Request</Code> return
            کرتا ہے تاکہ database تک invalid data نہ پہنچے۔
          </P>

          <InfoCard variant='note' title='API Versioning'>
            فی الحال API version URL میں شامل نہیں ہے، لیکن codebase اس طرح
            structured ہے کہ مستقبل میں <Code>/api/v2</Code> آسانی سے add کیا جا
            سکتا ہے۔ پرانے endpoints کو migration period کے دوران support کیا
            جائے گا۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Care Nexus REST API is built on Express.js following consistent
            conventions for request handling, response formatting, and error
            management. Every API response uses the <Code>ApiResponse</Code>{' '}
            utility wrapper to ensure a predictable shape that the frontend can
            reliably parse.
          </P>

          <H2>Response Format</H2>
          <P>All API responses — success and error — follow this structure:</P>

          <Table
            headers={['Field', 'Type', 'Description']}
            rows={[
              [
                'success',
                'boolean',
                'true for 2xx responses, false for errors',
              ],
              ['message', 'string', 'Human-readable status message'],
              ['data', 'any', 'Response payload (null on errors)'],
              ['error', 'string', 'Error description (null on success)'],
              ['statusCode', 'number', 'HTTP status code mirrored in body'],
            ]}
          />

          <H2>Route Organization</H2>
          <UL>
            <LI>
              <Code>/api/auth/*</Code> — Public authentication routes (login,
              register, forgot password)
            </LI>
            <LI>
              <Code>/api/doctor/*</Code> — Doctor-only routes (requires doctor
              role JWT)
            </LI>
            <LI>
              <Code>/api/patient/*</Code> — Patient-only routes (requires
              patient role JWT)
            </LI>
            <LI>
              <Code>/api/clinic/*</Code> — Clinic admin routes (requires
              clinic_admin role JWT)
            </LI>
            <LI>
              <Code>/api/ai/*</Code> — AI features (Gemini chat, transcription,
              parsing)
            </LI>
            <LI>
              <Code>/api/chat/*</Code> — Chat REST fallback (rooms list, message
              history)
            </LI>
            <LI>
              <Code>/api/notifications/*</Code> — Notification CRUD for all
              authenticated roles
            </LI>
            <LI>
              <Code>/api/public/*</Code> — Unauthenticated public routes (clinic
              listing, doctor search)
            </LI>
          </UL>

          <H2>Error Handling</H2>
          <P>
            A global error handler middleware catches all unhandled errors
            thrown in controllers. Controllers use the <Code>asyncHandler</Code>{' '}
            wrapper to remove repetitive try/catch blocks.
          </P>

          <P>
            Custom <Code>ApiError</Code> objects carry HTTP status codes and
            messages, which are transformed into the standard API response
            format by the global handler.
          </P>

          <H2>Validation</H2>
          <P>
            All incoming request bodies are validated using Joi schemas before
            reaching the controller. Invalid requests return{' '}
            <Code>400 Bad Request</Code> with a clear validation message.
          </P>

          <InfoCard variant='note' title='API versioning'>
            The API is currently unversioned in the URL, but structured to
            support
            <Code>/api/v2</Code> in the future without breaking existing
            clients.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
