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

export default function SystemDesignPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='System Design'
      titleUr='سسٹم ڈیزائن'
      description='Architecture overview, service boundaries, and request flow through The Care Nexus platform.'
      breadcrumbs={[
        { label: 'Architecture', href: '/docs/architecture/system-design' },
        { label: 'System Design' },
      ]}
      lastUpdated='June 2026'
      readingTime='8 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس ایک تین پرتوں (three-tier) والی ویب ایپلیکیشن ہے جو
            کلائنٹ، سرور اور ڈیٹا لیئر پر مشتمل ہے۔ یہ سسٹم ایک واضح separation
            of concerns کے ساتھ بنایا گیا ہے تاکہ اسکیل، مینٹیننس اور پرفارمنس
            بہتر رہے۔
          </P>

          <H2>آرکیٹیکچر لیئرز</H2>

          <H3>کلائنٹ لیئر</H3>
          <P>
            ڈاکٹر، مریض اور کلینک ایڈمن کے تین پورٹل ایک ہی Next.js ایپ میں
            موجود ہیں۔ ہر پورٹل کا اپنا layout ہے جو رول کے مطابق access کو
            control کرتا ہے۔ جہاں ممکن ہو وہاں Server Components استعمال ہوتے
            ہیں تاکہ SEO اور initial load بہتر ہو، جبکہ interactive حصوں کے لیے
            Client Components استعمال کیے جاتے ہیں۔
          </P>

          <H3>API گیٹ وے لیئر</H3>
          <P>
            Express.js سرور تمام API requests کا مرکزی دروازہ ہے۔ یہ JWT کے
            ذریعے authentication کرتا ہے، requests کو controllers تک پہنچاتا ہے
            اور Socket.IO کو بھی اسی HTTP server پر manage کرتا ہے۔ API ایک
            versioned structure <Code>/api/v1/</Code> استعمال کرتی ہے۔ CORS صرف
            whitelisted frontend domains کے لیے allow کیا گیا ہے۔
          </P>

          <H3>سروس لیئر</H3>
          <P>
            Business logic مختلف modules میں تقسیم ہے جیسے: <Code>auth</Code>,{' '}
            <Code>doctor</Code>, <Code>patient</Code>, <Code>clinic</Code>,{' '}
            <Code>ai</Code>, <Code>chat</Code> اور <Code>notification</Code>۔
            Controllers صرف request handle کرتے ہیں جبکہ external services (AI،
            email، notifications) service layer میں abstract کی گئی ہیں تاکہ
            system modular رہے۔
          </P>

          <H3>ڈیٹا لیئر</H3>
          <P>
            MongoDB Atlas primary database ہے جو Mongoose کے ذریعے استعمال ہوتا
            ہے۔ Upstash Redis session storage (JWT refresh tokens)، rate
            limiting اور chat caching (last 50 messages) کے لیے استعمال ہوتا ہے۔
            Redis serverless-friendly REST SDK کے ذریعے connect ہوتا ہے۔
          </P>

          <H2>ریئل ٹائم آرکیٹیکچر</H2>
          <P>
            Socket.IO اسی Express server پر چلتا ہے۔ یہ userId-to-socketId
            mapping maintain کرتا ہے تاکہ real-time messaging اور notifications
            possible ہوں۔ جب user connect ہوتا ہے تو اس کا userId JWT سے extract
            کر کے memory map میں store کیا جاتا ہے، اور disconnect پر remove کر
            دیا جاتا ہے۔
          </P>

          <Table
            headers={['مسئلہ', 'حل']}
            rows={[
              [
                'Horizontal scaling',
                'Socket.IO کے لیے Redis pub/sub adapter استعمال کیا جاتا ہے',
              ],
              [
                'Chat history load',
                'Initial load REST API سے اور live messages Socket سے',
              ],
              [
                'Offline notifications',
                'Database میں store کر کے reconnect پر fetch کیا جاتا ہے',
              ],
              ['Rate limiting', 'Redis-based sliding window per userId'],
            ]}
          />

          <InfoCard variant='note' title='Monorepo structure'>
            client/ اور api/ دونوں ایک ہی repository میں موجود ہیں۔ دونوں
            independently deploy ہوتے ہیں — Vercel frontend کو deploy کرتا ہے
            اور Render backend کو۔ یہ structure development کو آسان اور
            deployment کو flexible بناتا ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Care Nexus is designed as a three-tier web application following
            a clean client-server separation. The frontend (Next.js) and backend
            (Express.js) are deployed independently, communicate via a versioned
            REST API, and share a Socket.IO connection for real-time features.
            This separation allows the frontend to be deployed on Vercel's
            global edge network while the backend runs on a persistent Node.js
            server on Render or Railway.
          </P>

          <H2>Architecture Layers</H2>

          <H3>Client Layer</H3>
          <P>
            Three logical portals (Doctor, Patient, Clinic Admin) are all served
            from the same Next.js application using App Router route groups.
            Each portal has its own layout with role-protected routing. Pages
            use React Server Components where possible for SEO and fast initial
            load, with Client Components for interactive sections (dashboards,
            forms, real-time UI).
          </P>

          <H3>API Gateway Layer</H3>
          <P>
            The Express.js server acts as the single entry point for all client
            requests. It handles authentication via JWT middleware, routes
            requests to the appropriate controller, and manages the Socket.IO
            server on the same HTTP server instance. The API follows RESTful
            conventions with a <Code>/api/v1/</Code> prefix structure. CORS is
            configured to accept requests only from the whitelisted frontend
            URL.
          </P>

          <H3>Service Layer</H3>
          <P>
            Business logic is organized into controller modules per domain:{' '}
            <Code>auth</Code>, <Code>doctor</Code>, <Code>patient</Code>,{' '}
            <Code>clinic</Code>, <Code>ai</Code>, <Code>chat</Code>,{' '}
            <Code>notification</Code>. Controllers call service modules (email,
            AI, notification) which abstract third-party API interactions. This
            keeps controllers thin and services testable.
          </P>

          <H3>Data Layer</H3>
          <P>
            MongoDB Atlas serves as the primary datastore via Mongoose ODM.
            Upstash Redis handles session storage (JWT refresh tokens), rate
            limiting state, and the last-50-messages chat cache. Redis is
            accessed via the official Upstash REST SDK which works in serverless
            and edge environments without persistent connections.
          </P>

          <H2>Real-Time Architecture</H2>
          <P>
            Socket.IO is initialized on the same HTTP server instance as
            Express. The socket server maintains in-memory maps of
            userId-to-socketId to enable direct user targeting (notifications,
            chat messages). When a user connects, their userId is extracted from
            the auth token sent during the handshake and stored in the map. On
            disconnect, the entry is removed.
          </P>

          <Table
            headers={['Concern', 'Solution']}
            rows={[
              [
                'Horizontal scaling',
                'Redis pub/sub adapter for Socket.IO (multi-instance support)',
              ],
              [
                'Chat history load',
                'REST API initial load + Socket.IO live updates',
              ],
              [
                'Offline notifications',
                'DB-persisted notifications fetched on reconnect',
              ],
              ['Rate limiting', 'Redis sliding window counter per userId'],
            ]}
          />

          <InfoCard variant='note' title='Monorepo structure'>
            The client/ and api/ directories exist in a single repository but
            are deployed independently. Vercel handles frontend deployment,
            while Render handles backend deployment. This keeps development
            simple while allowing scalable production separation.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
