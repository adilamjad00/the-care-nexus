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

export default function DeploymentPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Deployment'
      titleUr='تعیناتی'
      description='Deploy The Care Nexus to Vercel (frontend) and Render (backend) for production.'
      breadcrumbs={[
        { label: 'Architecture', href: '/docs/architecture/system-design' },
        { label: 'Deployment' },
      ]}
      lastUpdated='June 2026'
      readingTime='7 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس کا پروڈکشن deployment دو حصوں پر مشتمل ہوتا ہے: فرنٹ
            اینڈ Vercel پر deploy کیا جاتا ہے جبکہ بیک اینڈ Render یا Railway پر
            چلایا جاتا ہے۔ ڈیٹا بیس MongoDB Atlas اور Redis (Upstash) پر host
            ہوتا ہے۔
          </P>

          <H2>فرنٹ اینڈ — Vercel</H2>

          <H3>Setup</H3>
          <UL>
            <LI>GitHub repository کو Vercel سے connect کریں</LI>
            <LI>
              Root directory کو <Code>client/</Code> set کریں
            </LI>
            <LI>Framework: Next.js (auto-detected)</LI>
            <LI>
              Production environment variables Vercel dashboard میں add کریں
            </LI>
          </UL>

          <H3>Environment Variables (Frontend)</H3>
          <CodeBlock label='Vercel Environment Variables'>
            {`NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-api.onrender.com
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_secret
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=production_secret`}
          </CodeBlock>

          <H2>بیک اینڈ — Render</H2>

          <H3>Setup</H3>
          <UL>
            <LI>Render پر Web Service create کریں</LI>
            <LI>GitHub repository connect کریں</LI>
            <LI>
              Root directory: <Code>api/</Code>
            </LI>
            <LI>
              Build command: <Code>npm install</Code>
            </LI>
            <LI>
              Start command: <Code>node index.js</Code>
            </LI>
            <LI>تمام environment variables add کریں</LI>
          </UL>

          <H3>Environment Variables (Backend)</H3>
          <CodeBlock label='Render Environment Variables'>
            {`NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
FRONTEND_URL=https://your-app.vercel.app
REDIS_URL=upstash_redis_url
JWT_SECRET=your_secret`}
          </CodeBlock>

          <H2>Deployment Checklist</H2>

          <Table
            headers={['چیک', 'ویریفیکیشن طریقہ']}
            rows={[
              [
                'Frontend چل رہا ہے',
                'Vercel URL کھولیں اور homepage load دیکھیں',
              ],
              ['Backend health', "GET /api/health → { status: 'ok' }"],
              ['Authentication', 'Register + login successful ہونا چاہیے'],
              ['Socket.IO', 'Message real-time appear ہونا چاہیے'],
              ['Google OAuth', 'Google login redirect صحیح کام کرے'],
              ['File upload', 'Image upload → Cloudinary URL show ہو'],
              ['AI system', 'Chat → Gemini response آئے'],
            ]}
          />

          <InfoCard variant='warning' title='CORS ضروری تبدیلی'>
            Deployment کے بعد backend میں CORS update کرنا ضروری ہے تاکہ صرف
            production Vercel domain allow ہو۔ FRONTEND_URL بھی production URL
            پر update کر کے backend redeploy کریں۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Care Nexus production deployment uses a split-hosting model: the
            Next.js frontend deploys to Vercel's global edge network for fast
            international delivery, and the Express.js backend deploys to Render
            or Railway for persistent Node.js hosting with always-on WebSocket
            support. MongoDB Atlas and Upstash Redis are fully managed cloud
            services that require no server configuration.
          </P>

          <H2>Frontend — Vercel</H2>

          <H3>Setup</H3>
          <UL>
            <LI>Connect your GitHub repository to Vercel</LI>
            <LI>
              Set the root directory to <Code>client/</Code>
            </LI>
            <LI>Framework preset: Next.js (auto-detected)</LI>
            <LI>Add production environment variables in Vercel dashboard</LI>
          </UL>

          <H3>Required Environment Variables (Vercel)</H3>
          <CodeBlock label='Vercel Environment Variables'>
            {`NEXT_PUBLIC_API_URL=https://your-api.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-api.onrender.com
GOOGLE_CLIENT_ID=your_production_client_id
GOOGLE_CLIENT_SECRET=your_production_client_secret
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your_production_nextauth_secret`}
          </CodeBlock>

          <H2>Backend — Render</H2>

          <H3>Setup</H3>
          <UL>
            <LI>Create a new Web Service on Render</LI>
            <LI>Connect your GitHub repository</LI>
            <LI>
              Root directory: <Code>api/</Code>
            </LI>
            <LI>
              Build command: <Code>npm install</Code>
            </LI>
            <LI>
              Start command: <Code>node index.js</Code>
            </LI>
            <LI>Add all production environment variables</LI>
          </UL>

          <H3>Required Environment Variables (Render)</H3>
          <CodeBlock label='Render Environment Variables'>
            {`NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://...
FRONTEND_URL=https://your-app.vercel.app
# ... all other api/.env variables`}
          </CodeBlock>

          <H2>Post-Deployment Checklist</H2>

          <Table
            headers={['Check', 'How to Verify']}
            rows={[
              [
                'Frontend loads',
                'Open https://your-app.vercel.app — landing page renders',
              ],
              [
                'Backend health',
                "GET https://your-api.onrender.com/api/health → { status: 'ok' }",
              ],
              ['Auth works', 'Register → login → session persists'],
              ['Socket.IO works', 'Chat message appears instantly'],
              ['Google OAuth', 'Login redirects correctly and returns'],
              ['File upload', 'Cloudinary image URL appears'],
              ['AI features', 'Gemini responds in chat'],
            ]}
          />

          <InfoCard variant='warning' title='CORS update required'>
            After deploying, update backend CORS to allow only your production
            frontend domain and redeploy the API server.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
