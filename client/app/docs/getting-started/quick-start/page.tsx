'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import {
  P,
  H2,
  H3,
  UL,
  LI,
  CodeBlock,
  InfoCard,
  Code,
} from '../../components/DocProse';

export default function QuickStartPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Quick Start'
      titleUr='فوری آغاز'
      description='Get The Care Nexus running locally in under 10 minutes.'
      descriptionUr='دی کیئر نیکسس کو لوکل سسٹم پر 10 منٹ سے بھی کم وقت میں چلائیں۔'
      breadcrumbs={[
        {
          label: 'Getting Started',
          href: '/docs/getting-started/introduction',
        },
        { label: 'Quick Start' },
      ]}
      lastUpdated='June 2026'
      readingTime='7 min read'
    >
      {isUrdu ? (
        <>
          <P>
            اس گائیڈ میں آپ سیکھیں گے کہ کس طرح ریپوزیٹری کو کلون کرنا ہے،
            environment variables سیٹ کرنے ہیں، اور بیک اینڈ اور فرنٹ اینڈ دونوں
            کو لوکل سسٹم پر چلانا ہے۔ اس کے لیے آپ کے پاس Node.js، MongoDB
            Atlas، Redis (Upstash)، اور دیگر ضروری سروسز کے اکاؤنٹس ہونا ضروری
            ہیں۔
          </P>

          <H2>1. کلون اور انسٹالیشن</H2>

          <P>
            سب سے پہلے ریپوزیٹری کو کلون کریں اور دونوں پروجیکٹس (API اور
            client) کی dependencies انسٹال کریں۔
          </P>

          <H2>2. بیک اینڈ Environment Variables</H2>

          <P>
            <Code>api/.env</Code> فائل بنائیں اور نیچے دی گئی ویلیوز کو اپنی
            credentials کے مطابق سیٹ کریں:
          </P>

          <H3>JWT Secrets بنانا</H3>

          <P>
            JWT کے لیے secure keys جنریٹ کرنے کے لیے نیچے دیا گیا کمانڈ استعمال
            کریں:
          </P>

          <H2>3. فرنٹ اینڈ Environment Variables</H2>

          <P>
            فرنٹ اینڈ کے لیے <Code>client/.env.local</Code> فائل بنائیں اور تمام
            ضروری API URLs اور authentication keys شامل کریں۔
          </P>

          <H2>4. ڈیولپمنٹ سرورز چلانا</H2>

          <P>
            ایک ٹرمینل میں بیک اینڈ اور دوسرے میں فرنٹ اینڈ سرور چلائیں۔ اگر سب
            کچھ صحیح کنفیگر ہوا ہے تو آپ کا پروجیکٹ لوکل ہوسٹ پر چل جائے گا۔
          </P>

          <InfoCard variant='tip' title='سیٹ اپ چیک کریں'>
            براؤزر میں http://localhost:3000 کھولیں — آپ کو ہوم پیج نظر آئے گا۔
            http://localhost:5000/api/health کھول کر API health response چیک
            کریں۔ اگر MongoDB connect نہیں ہو رہا تو MONGO_URI اور Atlas IP
            whitelist چیک کریں۔
          </InfoCard>

          <H2>5. پہلا اکاؤنٹ بنانا</H2>

          <UL>
            <LI>
              /register پر جا کر Patient اکاؤنٹ بنائیں اور ای میل verify کریں
            </LI>
            <LI>
              Clinic Admin اکاؤنٹ بنائیں اور پہلی بار لاگ اِن پر کلینک سیٹ اپ
              کریں
            </LI>
            <LI>Doctor اکاؤنٹ بنائیں اور اسے کلینک کے ساتھ attach کریں</LI>
            <LI>Patient کے طور پر لاگ اِن کریں اور اپائنٹمنٹ بک کریں</LI>
            <LI>
              Doctor لاگ اِن کرے گا تو اپائنٹمنٹ اس کی queue میں نظر آئے گی
            </LI>
          </UL>

          <H2>6. Google OAuth سیٹ اپ</H2>

          <P>
            Google Cloud Console میں OAuth credentials بنائیں۔ اگر یہ سیٹ اپ
            نہیں ہوگا تو Google login کام نہیں کرے گا، لیکن email/password login
            بغیر کسی مسئلے کے کام کرے گا۔
          </P>

          <UL>
            <LI>
              Authorized JavaScript origin: <Code>http://localhost:3000</Code>
            </LI>
            <LI>
              Authorized redirect URI:{' '}
              <Code>http://localhost:3000/api/auth/callback/google</Code>
            </LI>
          </UL>
        </>
      ) : (
        <>
          {/* English unchanged */}
          <P>This guide walks you through cloning the repository...</P>

          <H2>1. Clone and Install</H2>

          <CodeBlock label='terminal'>
            {`git clone https://github.com/your-org/the-care-nexus.git
cd care-nexus

# Install backend dependencies
cd api && npm install

# Install frontend dependencies
cd ../client && npm install`}
          </CodeBlock>

          <H2>2. Backend Environment Variables</H2>

          <P>
            Create <Code>api/.env</Code>...
          </P>

          <CodeBlock label='api/.env'>
            {`PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/carenexus
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here
JWT_SECRET=<64-char random hex>
JWT_REFRESH_SECRET=<64-char random hex>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GOOGLE_CLIENT_ID=your_client_id`}
          </CodeBlock>

          <H3>Generate JWT secrets</H3>

          <CodeBlock label='terminal'>
            {`node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`}
          </CodeBlock>

          <H2>3. Frontend Environment Variables</H2>

          <CodeBlock label='client/.env.local'>
            {`NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<32-char base64 string>`}
          </CodeBlock>

          <H2>4. Start Development Servers</H2>

          <CodeBlock label='terminal'>
            {`# Terminal 1 — Backend
cd api && npm run dev
# → Server running on port 5000

# Terminal 2 — Frontend
cd client && npm run dev
# → Ready at http://localhost:3000`}
          </CodeBlock>

          <InfoCard variant='tip' title='Verify the setup'>
            Open http://localhost:3000 — you should see the landing page...
          </InfoCard>

          <H2>5. Create Your First Accounts</H2>

          <UL>
            <LI>Create a Patient account</LI>
            <LI>Create a Clinic Admin account</LI>
            <LI>Create a Doctor account</LI>
            <LI>Book appointment and test workflow</LI>
            <LI>Doctor sees appointment in queue</LI>
          </UL>

          <H2>6. Google OAuth Setup</H2>

          <P>Configure Google OAuth credentials in Google Cloud Console...</P>

          <UL>
            <LI>
              Authorized JavaScript origin: <Code>http://localhost:3000</Code>
            </LI>
            <LI>
              Authorized redirect URI:{' '}
              <Code>http://localhost:3000/api/auth/callback/google</Code>
            </LI>
          </UL>
        </>
      )}
    </DocLayout>
  );
}
