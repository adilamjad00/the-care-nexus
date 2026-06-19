'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import { P, H2, H3, UL, LI, InfoCard, Table } from '../../components/DocProse';

export default function IntroductionPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Introduction to The Care Nexus'
      titleUr='دی کیئر نیکسس کا تعارف'
      description='A voice-enabled, AI-powered healthcare SaaS platform connecting patients, doctors, and clinic administrators.'
      descriptionUr='ایک جدید وائس سے چلنے والا اور اے آئی پر مبنی ہیلتھ کیئر SaaS پلیٹ فارم جو مریضوں، ڈاکٹروں اور کلینک منتظمین کو ایک ہی نظام میں جوڑتا ہے۔'
      breadcrumbs={[
        {
          label: 'Getting Started',
          href: '/docs/getting-started/introduction',
        },
        { label: 'Introduction' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس ایک جدید، پروڈکشن لیول ویب بیسڈ ہیلتھ کیئر SaaS پلیٹ
            فارم ہے جو صحت کے شعبے میں موجود بکھرے ہوئے سسٹمز کے مسئلے کو حل
            کرنے کے لیے بنایا گیا ہے۔ یہ پلیٹ فارم کلینکس، ڈاکٹروں اور مریضوں کے
            درمیان موجود خلا کو ختم کر کے ایک متحد اور ذہین نظام فراہم کرتا ہے۔
          </P>

          <P>
            اس میں تین بنیادی پورٹلز شامل ہیں: مریض، ڈاکٹر اور کلینک ایڈمن۔ ہر
            پورٹل اپنے صارف کی ضروریات کے مطابق مخصوص فیچرز فراہم کرتا ہے، جیسے
            اپائنٹمنٹ مینجمنٹ، میڈیکل ریکارڈ، نسخے اور ریونیو اینالٹکس۔
          </P>

          <P>
            یہ پلیٹ فارم Google Gemini اور GROQ AI کے ساتھ انٹیگریٹڈ ہے، جو آواز
            کو ٹیکسٹ میں تبدیل کر کے خودکار طور پر ساختہ (structured) طبی
            معلومات میں بدل دیتا ہے۔
          </P>

          <H2>یہ کس طرح مختلف ہے</H2>

          <P>
            زیادہ تر ہیلتھ کیئر سسٹمز ایڈمن سینٹرک ہوتے ہیں، جبکہ یہ پلیٹ فارم
            ڈاکٹر کے ورک فلو کو مرکز میں رکھتا ہے۔ وائس پریسکرپشن فیچر ڈاکٹروں
            کو یہ سہولت دیتا ہے کہ وہ قدرتی انداز میں بولیں، اور سسٹم خود بخود
            اسے مریض کے لیے مکمل نسخے میں تبدیل کر دے۔
          </P>

          <H2>پلیٹ فارم کا فلسفہ</H2>

          <UL>
            <LI>
              ڈیفالٹ طور پر دو لسانی سپورٹ — انگریزی اور اردو (RTL کے ساتھ)
            </LI>
            <LI>
              رول بیسڈ ایکسیس کنٹرول — ہر صارف کو صرف ضروری معلومات نظر آتی ہیں
            </LI>
            <LI>ریئل ٹائم سسٹم — چیٹ اور نوٹیفکیشن Socket.IO کے ذریعے</LI>
            <LI>AI بطور مددگار — فیصلہ ہمیشہ ڈاکٹر کے ہاتھ میں رہتا ہے</LI>
            <LI>موبائل فرینڈلی — ہر ڈیوائس پر مکمل سپورٹ</LI>
          </UL>

          <H2>یہ کس کے لیے ہے</H2>

          <Table
            headers={['صارف', 'بنیادی استعمال', 'اہم فیچر']}
            rows={[
              [
                'مریض',
                'اپائنٹمنٹ بک کرنا اور ریکارڈ دیکھنا',
                'AI ہیلتھ اسسٹنٹ اور فیملی مینجمنٹ',
              ],
              [
                'ڈاکٹر',
                'مریضوں اور نسخوں کا انتظام',
                'وائس پریسکرپشن اور شیڈول مینجمنٹ',
              ],
              [
                'کلینک ایڈمن',
                'آپریشنز اور آمدنی کا انتظام',
                'اینالٹکس ڈیش بورڈ اور اسٹاف مینجمنٹ',
              ],
            ]}
          />

          <InfoCard variant='tip' title='شروع کیسے کریں'>
            Quick Start گائیڈ پر جائیں تاکہ آپ 10 منٹ کے اندر مکمل سسٹم لوکل
            مشین پر چلا سکیں۔
          </InfoCard>

          <H3>ٹیکنالوجی بنیاد</H3>

          <P>
            یہ پلیٹ فارم Next.js، React اور Tailwind CSS پر بنایا گیا ہے۔ بیک
            اینڈ Node.js اور Express پر مبنی ہے، جبکہ ڈیٹا MongoDB Atlas میں
            محفوظ کیا جاتا ہے۔ Redis سیشن اور کیشنگ کے لیے استعمال ہوتا ہے۔ ریئل
            ٹائم فیچرز Socket.IO کے ذریعے فراہم کیے جاتے ہیں اور AI لیئر Google
            Gemini اور GROQ API استعمال کرتی ہے۔
          </P>
        </>
      ) : (
        <>
          {/* English unchanged */}
          <P>
            The Care Nexus is a modern, production-grade web-based healthcare
            SaaS platform designed to solve the fragmentation problem in
            healthcare delivery. Clinics, doctors, and patients today operate in
            siloed systems — appointment books are separate from medical
            records, prescriptions are handwritten, and follow-up care is
            manual. The Care Nexus unifies all of these workflows into a single,
            intelligent platform accessible from any browser.
          </P>

          <P>
            At its core, the platform provides three dedicated portals tailored
            to each user type. Patients can book appointments, view their full
            medical history, manage family member health records, and consult an
            AI health assistant. Doctors receive a streamlined queue management
            system, voice-powered prescription creation using Google Gemini AI,
            and real-time communication tools. Clinic administrators gain
            complete oversight: staff management, revenue analytics, doctor
            performance metrics, and appointment flow dashboards.
          </P>

          <H2>What Makes It Different</H2>

          <P>
            Most healthcare management systems are designed for administrators,
            not for the clinical workflow itself. The Care Nexus inverts this —
            the doctor experience is first-class. The voice prescription system
            is the standout feature: a doctor speaks naturally, the GROQ API
            transcribes the audio in Urdu or English, Gemini then parses it into
            a structured prescription with medicines, dosages, frequency, and
            diagnosis — all editable before saving. This eliminates the single
            biggest time sink in a doctor's day: paperwork.
          </P>

          <H2>Platform Philosophy</H2>

          <UL>
            <LI>
              Bilingual by default — English and Urdu with full RTL layout
              switching
            </LI>
            <LI>
              Role-based access control — each user sees only what they need
            </LI>
            <LI>
              Real-time first — Socket.IO powers live notifications and chat
            </LI>
            <LI>
              AI-augmented, not AI-replaced — doctors stay in control of every
              decision
            </LI>
            <LI>Mobile-responsive — works on phones, tablets, and desktops</LI>
          </UL>

          <H2>Who It's For</H2>

          <Table
            headers={['User Type', 'Primary Use', 'Key Feature']}
            rows={[
              [
                'Patient',
                'Book appointments, view records',
                'AI health assistant, family management',
              ],
              [
                'Doctor',
                'Manage patients and prescriptions',
                'Voice prescription, schedule management',
              ],
              [
                'Clinic Admin',
                'Oversee operations and revenue',
                'Analytics dashboard, staff management',
              ],
            ]}
          />

          <InfoCard variant='tip' title='Getting Started'>
            Head to the Quick Start guide to get the full platform running
            locally in under 10 minutes.
          </InfoCard>

          <H3>Technology Foundation</H3>

          <P>
            Built on Next.js 15 with the App Router, React 19, and Tailwind CSS
            v4 on the frontend. The backend is a Node.js + Express.js REST API
            backed by MongoDB Atlas for primary storage and Upstash Redis for
            sessions and caching. Real-time features are handled by Socket.IO.
            The AI layer uses Google Gemini API for chatbot and prescription
            parsing, and GROQ API for fast audio transcription.
          </P>
        </>
      )}
    </DocLayout>
  );
}
