'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import {
  P,
  H2,
  UL,
  LI,
  Table,
  InfoCard,
  Code,
  CodeBlock,
} from '../../components/DocProse';

export default function EncryptionPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Encryption'
      titleUr='خفیہ کاری'
      description='AES-256 message encryption, bcrypt password hashing, and JWT token security.'
      breadcrumbs={[
        { label: 'Security', href: '/docs/security/privacy' },
        { label: 'Encryption' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس میں حساس ڈیٹا کے تحفظ کے لیے متعدد لیئرز کی خفیہ کاری
            (encryption) استعمال کی گئی ہے۔ اس میں میسجز کے لیے AES-256، پاس
            ورڈز کے لیے bcrypt hashing، اور authentication کے لیے JWT ٹوکنز شامل
            ہیں۔
          </P>

          <H2>پیغامات کی خفیہ کاری (AES-256)</H2>
          <P>
            تمام چیٹ پیغامات کو ڈیٹا بیس میں محفوظ کرنے سے پہلے AES-256-CBC کے
            ذریعے انکرپٹ کیا جاتا ہے۔ <code>messageCrypto.js</code> یوٹیلٹی اس
            عمل کو handle کرتی ہے، جس میں لکھتے وقت encryption اور پڑھتے وقت
            decryption کیا جاتا ہے۔
          </P>

          <P>
            encryption key ایک 32-byte secret ہوتا ہے جو{' '}
            <code>MESSAGE_ENCRYPTION_KEY</code> environment variable سے حاصل کیا
            جاتا ہے۔ یہ کلید کبھی بھی کلائنٹ تک نہیں جاتی۔
          </P>

          <H2>پاس ورڈ ہیشنگ (bcrypt)</H2>
          <P>
            صارف کے پاس ورڈ کبھی بھی plain text میں محفوظ نہیں کیے جاتے۔
            رجسٹریشن کے وقت پاس ورڈ کو bcrypt کے ذریعے 12 rounds کے ساتھ hash
            کیا جاتا ہے۔ لاگ اِن کے وقت <code>compare</code> فنکشن استعمال ہوتا
            ہے تاکہ hash کو verify کیا جا سکے۔
          </P>

          <P>
            Password reset tokens کو بھی SHA-256 سے hash کیا جاتا ہے تاکہ اگر
            database leak ہو بھی جائے تو tokens استعمال نہ کیے جا سکیں۔
          </P>

          <H2>JWT ٹوکن سیکیورٹی</H2>
          <P>
            Access tokens HS256 الگورتھم کے ساتھ sign کیے جاتے ہیں اور 15 منٹ
            بعد expire ہو جاتے ہیں۔ Refresh tokens 7 دن کے لیے valid ہوتے ہیں۔
            Refresh tokens Redis میں محفوظ کیے جاتے ہیں تاکہ session revoke کرنا
            آسان ہو۔
          </P>

          <H2>ٹرانسپورٹ سیکیورٹی</H2>
          <P>
            تمام production traffic HTTPS پر چلتا ہے۔ Frontend (Vercel) اور
            backend (Render) دونوں پر SSL enforced ہے۔ Socket.IO بھی production
            میں WSS (secure WebSocket) استعمال کرتا ہے۔
          </P>

          <InfoCard variant='tip' title='Key rotation'>
            JWT secrets اور encryption keys کو وقتاً فوقتاً rotate کرنا ایک
            بہترین security practice ہے۔ JWT secret rotate کرنے سے تمام existing
            sessions ختم ہو جاتے ہیں اور users کو دوبارہ login کرنا پڑتا ہے۔
            Encryption key rotate کرنے کے لیے existing messages کو دوبارہ
            encrypt کرنے کی migration درکار ہوتی ہے۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The Care Nexus implements multiple layers of encryption to protect
            sensitive data both in transit and at rest. The three main
            cryptographic mechanisms are AES-256 for message content, bcrypt for
            password hashing, and signed JWTs for authentication tokens.
          </P>

          <H2>Message Encryption (AES-256)</H2>
          <P>
            All chat messages are encrypted before storage using AES-256-CBC.
            The <Code>messageCrypto.js</Code> utility handles encryption on
            write and decryption on read. The encryption key is a 32-byte secret
            derived from the <Code>MESSAGE_ENCRYPTION_KEY</Code> environment
            variable — it never leaves the server. Clients always receive
            plaintext messages after server-side decryption; the encryption is
            transparent to the UI.
          </P>

          <CodeBlock label='messageCrypto.js — encryption pattern'>
            {`const crypto = require('crypto');
const ALGO = 'aes-256-cbc';
const KEY  = Buffer.from(process.env.MESSAGE_ENCRYPTION_KEY, 'hex');

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(payload) {
  const [ivHex, encHex] = payload.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGO, KEY, iv);
  return Buffer.concat([
    decipher.update(Buffer.from(encHex, 'hex')),
    decipher.final()
  ]).toString();
}`}
          </CodeBlock>

          <H2>Password Hashing (bcrypt)</H2>
          <P>
            User passwords are never stored in plaintext. On registration, the
            password is hashed using bcrypt with a work factor of 12 rounds
            before being saved to MongoDB. On login, bcrypt's{' '}
            <Code>compare</Code> function verifies the submitted password
            against the stored hash — the original password is never
            reconstructed or logged.
          </P>

          <P>
            Password reset tokens are SHA-256 hashed before storage, ensuring
            they cannot be reused even if the database is compromised.
          </P>

          <H2>JWT Token Security</H2>
          <P>
            Access tokens are signed using HS256 with a strong secret and expire
            in 15 minutes. Refresh tokens last 7 days and are stored in Redis,
            allowing instant session invalidation by deleting the Redis key.
          </P>

          <H2>Transport Security</H2>
          <P>
            All production traffic is served over HTTPS with enforced SSL.
            Socket.IO connections also run over WSS (WebSocket Secure) in
            production environments.
          </P>

          <InfoCard variant='tip' title='Key rotation'>
            JWT secrets and encryption keys should be rotated periodically.
            Rotating JWT secrets invalidates all active sessions. Rotating
            encryption keys requires re-encrypting stored messages via a
            migration process.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
