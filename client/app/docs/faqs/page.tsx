'use client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import DocLayout from '../components/DocLayout';
import { P } from '../components/DocProse';
import { ChevronDown, ChevronRight } from 'lucide-react';

const faqs = [
  {
    q: 'What roles are available in The Care Nexus?',
    qUr: 'دی کیئر نیکسس میں کون سے رولز دستیاب ہیں؟',
    a: 'Three roles: Patient (books appointments, views records, chats with doctors), Doctor (manages patients, creates prescriptions, sets schedule), and Clinic Admin (oversees all doctors, staff, and analytics for their clinic).',
    aUr: 'تین رولز ہیں: پیشنٹ (اپائنٹمنٹس بک کرتا ہے، ریکارڈ دیکھتا ہے، ڈاکٹر سے چیٹ کرتا ہے)، ڈاکٹر (مریضوں کا انتظام کرتا ہے، نسخے بناتا ہے، شیڈول سیٹ کرتا ہے)، اور کلینک ایڈمن (تمام ڈاکٹرز، اسٹاف اور اینالٹکس کو منظم کرتا ہے)۔',
  },
  {
    q: 'Can one person have multiple roles?',
    qUr: 'کیا ایک شخص کے پاس ایک سے زیادہ رولز ہو سکتے ہیں؟',
    a: 'No. Each registered account has exactly one role. If you need to operate as both a doctor and a clinic admin, you need two separate accounts registered with different email addresses.',
    aUr: 'نہیں۔ ہر اکاؤنٹ کا صرف ایک ہی رول ہوتا ہے۔ اگر آپ ڈاکٹر اور کلینک ایڈمن دونوں بننا چاہتے ہیں تو آپ کو مختلف ای میلز کے ساتھ دو الگ اکاؤنٹس بنانے ہوں گے۔',
  },
  {
    q: 'Is the voice prescription feature available in Urdu?',
    qUr: 'کیا وائس پریسکرپشن فیچر اردو میں دستیاب ہے؟',
    a: 'Yes. The GROQ transcription API supports Urdu natively. Doctors can dictate prescriptions in Urdu and the system will transcribe and parse them correctly. The entire platform UI is also available in Urdu with RTL layout.',
    aUr: 'جی ہاں۔ GROQ ٹرانسکرپشن API اردو کو سپورٹ کرتا ہے۔ ڈاکٹر اردو میں بول کر نسخہ لکھ سکتے ہیں اور سسٹم اسے درست طریقے سے ٹرانسکرائب اور پارس کرتا ہے۔ پورا پلیٹ فارم UI بھی اردو اور RTL سپورٹ کے ساتھ دستیاب ہے۔',
  },
  {
    q: 'What happens to medical records if a doctor leaves a clinic?',
    qUr: 'اگر کوئی ڈاکٹر کلینک چھوڑ دے تو میڈیکل ریکارڈز کا کیا ہوتا ہے؟',
    a: "All prescriptions and medical records created by that doctor remain permanently in the patient's medical vault. The doctor's account is simply unlinked from the clinic. Historical data is never deleted.",
    aUr: 'اس ڈاکٹر کے بنائے گئے تمام نسخے اور میڈیکل ریکارڈز مریض کے میڈیکل والٹ میں ہمیشہ محفوظ رہتے ہیں۔ ڈاکٹر کا اکاؤنٹ صرف کلینک سے unlink کیا جاتا ہے، لیکن پرانا ڈیٹا کبھی delete نہیں ہوتا۔',
  },
  {
    q: 'How are chat messages secured?',
    qUr: 'چیٹ پیغامات کو کیسے محفوظ بنایا جاتا ہے؟',
    a: 'Chat messages are encrypted with AES-256 before storage in MongoDB. The encryption key is server-side only and never sent to clients. Messages are decrypted server-side before delivery to the correct participant.',
    aUr: 'چیٹ پیغامات MongoDB میں محفوظ ہونے سے پہلے AES-256 سے encrypt کیے جاتے ہیں۔ encryption key صرف server-side پر ہوتی ہے اور کبھی client کو نہیں بھیجی جاتی۔ پیغامات ڈیلیور کرنے سے پہلے server پر decrypt کیے جاتے ہیں۔',
  },
  {
    q: 'Can patients book appointments without a clinic admin account being set up?',
    qUr: 'کیا مریض کلینک ایڈمن کے بغیر اپائنٹمنٹ بک کر سکتے ہیں؟',
    a: 'No. Doctors must be linked to a clinic by a clinic admin. Without a clinic context, doctors do not appear in the booking flow. The setup order is: (1) create clinic admin, (2) set up clinic profile, (3) invite doctors, (4) patients can then book.',
    aUr: 'نہیں۔ ڈاکٹرز کو کلینک ایڈمن کے ذریعے کلینک سے لنک ہونا ضروری ہے۔ بغیر کلینک کے ڈاکٹر بکنگ میں نظر نہیں آتے۔ سیٹ اپ ترتیب یہ ہے: (1) کلینک ایڈمن بنائیں، (2) کلینک پروفائل بنائیں، (3) ڈاکٹرز کو invite کریں، (4) پھر مریض اپائنٹمنٹ بک کر سکتے ہیں۔',
  },
  {
    q: 'How do appointment reminder emails work?',
    qUr: 'اپائنٹمنٹ ریمائنڈر ای میلز کیسے کام کرتی ہیں؟',
    a: "A node-cron job runs every hour and checks for appointments happening in the next 24 hours and 1 hour. It sends email reminders via the SMTP service (Gmail App Password) to the patient's registered email address.",
    aUr: 'Node-cron جاب ہر گھنٹے چلتی ہے اور اگلے 24 گھنٹے اور 1 گھنٹے والی اپائنٹمنٹس چیک کرتی ہے۔ پھر SMTP (Gmail App Password) کے ذریعے مریض کے ای میل پر ریمائنڈر بھیجتی ہے۔',
  },
  {
    q: 'What is the session timeout?',
    qUr: 'سیشن ٹائم آؤٹ کیا ہے؟',
    a: 'Access tokens expire in 15 minutes. Refresh tokens expire in 7 days. As long as the user is active, the frontend automatically refreshes the access token using the refresh token before it expires — so the session feels continuous.',
    aUr: 'Access tokens 15 منٹ بعد expire ہو جاتے ہیں اور refresh tokens 7 دن بعد۔ جب تک user active ہوتا ہے، frontend خود بخود token refresh کر دیتا ہے تاکہ session مسلسل چلتا رہے۔',
  },
  {
    q: 'Can the platform be self-hosted?',
    qUr: 'کیا یہ پلیٹ فارم self-host کیا جا سکتا ہے؟',
    a: 'Yes. The entire stack can be self-hosted. You need a Node.js server for the backend, a Next.js hosting environment for the frontend, MongoDB, and Redis. See the Deployment docs for a step-by-step guide.',
    aUr: 'جی ہاں۔ پورا سسٹم self-host کیا جا سکتا ہے۔ اس کے لیے Node.js backend server، Next.js frontend hosting، MongoDB اور Redis کی ضرورت ہوتی ہے۔ مکمل گائیڈ Deployment docs میں موجود ہے۔',
  },
  {
    q: 'Is Google OAuth required?',
    qUr: 'کیا Google OAuth لازمی ہے؟',
    a: "No. Email/password registration and login work completely independently of Google OAuth. Google OAuth is an optional convenience feature. You only need Google Cloud credentials if you want to enable 'Sign in with Google' buttons.",
    aUr: 'نہیں۔ Email/password login مکمل طور پر Google OAuth کے بغیر بھی کام کرتا ہے۔ Google OAuth صرف ایک optional feature ہے۔ اسے enable کرنے کے لیے Google Cloud credentials درکار ہوتے ہیں۔',
  },
];

function FAQItem({
  q,
  qUr,
  a,
  aUr,
  isUrdu,
}: {
  q: string;
  qUr: string;
  a: string;
  aUr: string;
  isUrdu: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className='border border-[rgba(37,99,235,0.10)] rounded-[14px] overflow-hidden'>
      <button
        onClick={() => setOpen(!open)}
        className='w-full flex items-center justify-between gap-4 px-5 py-4 bg-white hover:bg-[rgba(37,99,235,0.03)] transition-colors text-left'
      >
        <span className='text-[14px] font-semibold text-text-primary leading-snug'>
          {isUrdu ? qUr : q}
        </span>

        {open ? (
          <ChevronDown size={16} className='text-primary shrink-0' />
        ) : (
          <ChevronRight size={16} className='text-text-muted shrink-0' />
        )}
      </button>

      {open && (
        <div className='px-5 pb-4 bg-[rgba(37,99,235,0.02)] border-t border-[rgba(37,99,235,0.08)]'>
          <p className='text-[13.5px] text-text-secondary leading-relaxed pt-3'>
            {isUrdu ? aUr : a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQsPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Frequently Asked Questions'
      titleUr='اکثر پوچھے جانے والے سوالات'
      description='Common questions about setup, features, security, and platform usage.'
      breadcrumbs={[{ label: 'FAQs' }]}
      lastUpdated='June 2026'
      readingTime='8 min read'
    >
      <P>
        {isUrdu
          ? 'جو سوال آپ کو چاہیے وہ نہیں مل رہا؟ سپورٹ پیج پر رابطہ کریں۔'
          : "Can't find what you're looking for? Reach out via the Support page."}
      </P>

      <div className='mt-6 space-y-3'>
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            q={faq.q}
            qUr={faq.qUr}
            a={faq.a}
            aUr={faq.aUr}
            isUrdu={isUrdu}
          />
        ))}
      </div>
    </DocLayout>
  );
}
