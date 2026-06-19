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

export default function PatientMessagingPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Messaging'
      titleUr='پیغام رسانی'
      description='Real-time secure messaging between patients and doctors via Socket.IO.'
      descriptionUr='Socket.IO کے ذریعے مریض اور ڈاکٹروں کے درمیان محفوظ اور رئیل ٹائم پیغام رسانی۔'
      breadcrumbs={[
        { label: 'Patient Guide', href: '/docs/patient-guide/dashboard' },
        { label: 'Messaging' },
      ]}
      lastUpdated='June 2026'
      readingTime='5 min read'
    >
      {isUrdu ? (
        <>
          <P>
            پیغام رسانی کا نظام مریض اور ڈاکٹر کے درمیان محفوظ اور رئیل ٹائم چیٹ
            فراہم کرتا ہے۔ یہ Socket.IO پر مبنی ہے جس کے ذریعے پیغامات فوری طور
            پر بھیجے اور موصول کیے جاتے ہیں۔
          </P>

          <P>
            تمام پیغامات MongoDB میں محفوظ ہوتے ہیں جبکہ Redis آخری 50 پیغامات
            کو تیزی سے لوڈ کرنے کے لیے کیش کرتا ہے۔ ہر گفتگو ایک مخصوص مریض اور
            ڈاکٹر کے درمیان ایک الگ روم میں ہوتی ہے۔
          </P>

          <H2>یہ نظام کیسے کام کرتا ہے</H2>
          <P>
            جب مریض پہلی بار ڈاکٹر کے ساتھ چیٹ کھولتا ہے، تو سسٹم چیک کرتا ہے کہ
            آیا پہلے سے کوئی روم موجود ہے یا نہیں۔ اگر نہیں ہوتا تو پہلا پیغام
            بھیجنے پر خودکار طور پر نیا روم بن جاتا ہے۔
          </P>

          <H3>Socket Events</H3>
          <Table
            headers={['ایونٹ', 'سمت', 'ڈیٹا']}
            rows={[
              ['join-room', 'کلائنٹ → سرور', '{ roomId }'],
              ['send-message', 'کلائنٹ → سرور', '{ roomId, content, type }'],
              ['receive-message', 'سرور → کلائنٹ', '{ message object }'],
              ['typing', 'کلائنٹ → سرور', '{ roomId, userId }'],
              ['stop-typing', 'کلائنٹ → سرور', '{ roomId }'],
              ['user-online', 'سرور → کلائنٹ', '{ userId, isOnline }'],
              ['disconnect', 'سرور → کلائنٹ', 'کنکشن ختم ہونے پر خودکار'],
            ]}
          />

          <H2>پیغامات کی محفوظی (Storage)</H2>
          <P>
            ہر پیغام MongoDB میں محفوظ کیا جاتا ہے تاکہ کنکشن ختم ہونے کے باوجود
            ڈیٹا ضائع نہ ہو۔ چیٹ کھولنے پر پہلے REST API سے پرانے پیغامات لوڈ
            کیے جاتے ہیں، پھر Socket.IO کے ذریعے نئے پیغامات لائیو آتے ہیں۔
          </P>

          <H2>ان ریڈ نوٹیفکیشن</H2>
          <P>
            ہر چیٹ میں ان ریڈ کاؤنٹ رکھا جاتا ہے جو اس وقت بڑھتا ہے جب دوسرا
            صارف آن لائن نہ ہو۔ جیسے ہی صارف چیٹ کھولتا ہے، یہ کاؤنٹ صفر ہو جاتا
            ہے۔
          </P>

          <InfoCard variant='note' title='پیغام کی سیکیورٹی'>
            تمام پیغامات AES-256 encryption کے ذریعے محفوظ کیے جاتے ہیں اور
            encryption keys کبھی بھی کلائنٹ کو نہیں دی جاتیں۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The messaging system provides secure, real-time direct messaging
            between patients and their doctors. It is built on Socket.IO for
            live delivery with MongoDB as the persistent message store and Redis
            caching the last 50 messages per conversation room for fast initial
            load. Messages are end-to-end scoped to a 1-to-1 room between a
            specific patient and doctor pair.
          </P>

          <H2>How It Works</H2>
          <P>
            When a patient opens the chat with a doctor for the first time, the
            system checks whether a conversation room already exists for that
            patient-doctor pair. If not, a new room is created automatically on
            first message send. This auto-creation means there is no "start
            conversation" button — the patient simply types and sends, and the
            room handles itself.
          </P>

          <H3>Socket Events</H3>
          <Table
            headers={['Event', 'Direction', 'Payload']}
            rows={[
              ['join-room', 'Client → Server', '{ roomId }'],
              ['send-message', 'Client → Server', '{ roomId, content, type }'],
              ['receive-message', 'Server → Client', '{ message object }'],
              ['typing', 'Client → Server', '{ roomId, userId }'],
              ['stop-typing', 'Client → Server', '{ roomId }'],
              ['user-online', 'Server → Client', '{ userId, isOnline }'],
              ['disconnect', 'Server → Client', 'Auto on connection drop'],
            ]}
          />

          <H2>Message Persistence</H2>
          <P>
            Every message sent through Socket.IO is also persisted to MongoDB
            via the <Code>Message</Code> model. This ensures messages are not
            lost if either party disconnects. When a conversation is opened, the
            client first calls <Code>GET /api/chat/rooms/:id/messages</Code> to
            load historical messages, then subscribes to the Socket.IO room for
            new incoming messages — creating a seamless handoff between REST
            history and live stream.
          </P>

          <H2>Unread Badges</H2>
          <P>
            The <Code>unreadCount</Code> field on each conversation document is
            incremented server-side every time a message is sent to an offline
            recipient. When the recipient opens the conversation, a read receipt
            event resets the counter to zero. The sidebar and topbar badge
            display this count using RTK Query polling every 30 seconds as a
            fallback in case the socket event is missed.
          </P>

          <InfoCard variant='note' title='Message encryption'>
            Message content is stored encrypted in MongoDB using AES-256. The
            encryption key is derived from environment variables and is never
            sent to the client. See the Encryption docs for full details.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
