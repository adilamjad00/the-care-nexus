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
} from '../../components/DocProse';

export default function DoctorAIPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='AI Assistant'
      titleUr='اے آئی معاون'
      description='Gemini-powered clinical assistant for drug references, differential diagnosis support, and voice prescription.'
      breadcrumbs={[
        { label: 'Doctor Guide', href: '/docs/doctor-guide/dashboard' },
        { label: 'AI Assistant' },
      ]}
      lastUpdated='June 2026'
      readingTime='6 min read'
    >
      {isUrdu ? (
        <>
          <P>
            ڈاکٹر کا اے آئی معاون گوگل جیمنی پر مبنی ایک کلینیکل سپورٹ سسٹم ہے۔
            یہ ڈاکٹرز کو ادویات کی معلومات، مختلف بیماریوں کی ممکنہ تشخیص
            (differential diagnosis)، اور آواز سے نسخہ بنانے میں مدد فراہم کرتا
            ہے۔ یہ صرف پیشہ ورانہ طبی استعمال کے لیے ڈیزائن کیا گیا ہے۔
          </P>

          <H2>استعمال کی مثالیں</H2>
          <UL>
            <LI>دوائی کی خوراک معلوم کرنا — مثلاً میٹفارمن کی عام خوراک</LI>
            <LI>ادویات کے درمیان تعامل چیک کرنا — مثلاً وارفرین اور اسپرین</LI>
            <LI>ممکنہ بیماریوں کی فہرست — بخار، درد اور خارش کی صورت میں</LI>
            <LI>کلینیکل گائیڈ لائنز — WHO یا دیگر میڈیکل پروٹوکولز</LI>
            <LI>ICD-10 کوڈ تلاش کرنا — بیماریوں کی بین الاقوامی درجہ بندی</LI>
          </UL>

          <H2>آواز سے نسخہ انٹیگریشن</H2>
          <P>
            یہ فیچر ڈاکٹرز کو اجازت دیتا ہے کہ وہ آڈیو فائل اپلوڈ کریں اور سسٹم
            اسے خودکار طور پر ٹرانسکرائب کرے۔ یہ خاص طور پر کلینک کے اختتام پر
            نوٹس یا ریکارڈ بنانے کے لیے مفید ہے۔
          </P>

          <H2>چیٹ کیسے کام کرتا ہے</H2>
          <P>
            ہر میسج کے ساتھ مکمل گفتگو کا ریکارڈ سرور کو بھیجا جاتا ہے تاکہ
            کانٹیکسٹ برقرار رہے۔ سسٹم پرامپٹ سرور سائیڈ پر شامل ہوتا ہے اور فرنٹ
            اینڈ پر ظاہر نہیں ہوتا۔ اے آئی ہمیشہ یہ واضح کرتا ہے کہ یہ صرف معاون
            ٹول ہے اور حتمی طبی فیصلہ ڈاکٹر کا ہوتا ہے۔
          </P>

          <Table
            headers={['اینڈ پوائنٹ', 'ان پٹ', 'آؤٹ پٹ']}
            rows={[
              [
                'POST /api/ai/gemini/chat',
                '{ message, conversationHistory[] }',
                'Markdown جواب',
              ],
              [
                'POST /api/ai/chat/transcribe',
                'آڈیو فائل (زیادہ سے زیادہ 25MB)',
                '{ text, language, success }',
              ],
              [
                'POST /api/ai/gemini/parse-prescription',
                '{ transcript }',
                'ساختی نسخہ (JSON)',
              ],
            ]}
          />

          <InfoCard variant='warning' title='اے آئی کی حدود'>
            یہ سسٹم صرف معاون ٹول ہے، حتمی تشخیص یا طبی فیصلے کا متبادل نہیں۔
            تمام طبی فیصلے ڈاکٹر کی ذمہ داری ہیں۔ جیمنی کے جوابات کسی ریئل ٹائم
            ڈرگ ڈیٹا بیس سے تصدیق شدہ نہیں ہوتے، اس لیے اہم فیصلوں کے لیے مستند
            طبی ذرائع ضرور استعمال کریں۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>
            The AI Assistant for doctors is a clinical decision support tool
            powered by Google Gemini. Unlike the patient-facing assistant which
            answers general health questions, the doctor assistant is configured
            with a clinical system prompt that makes it appropriate for
            professional medical queries — drug interaction checks, dosage
            references, differential diagnosis brainstorming, and clinical
            guideline lookups.
          </P>

          <H2>Use Cases</H2>
          <UL>
            <LI>
              Drug dosage reference — "What is the standard adult dose of
              Metformin for T2DM?"
            </LI>
            <LI>
              Drug interaction check — "Is there an interaction between Warfarin
              and Aspirin?"
            </LI>
            <LI>
              Differential diagnosis support — "Patient presents with fever,
              joint pain, and rash — differentials?"
            </LI>
            <LI>
              Clinical guideline lookup — "Latest WHO treatment protocol for
              uncomplicated malaria"
            </LI>
            <LI>
              ICD-10 code lookup — "What is the ICD-10 code for acute
              appendicitis?"
            </LI>
          </UL>

          <H2>Voice Prescription Integration</H2>
          <P>
            The most-used AI feature is the voice prescription workflow
            (documented fully in the Prescriptions page). The AI assistant page
            also provides a standalone audio upload interface where doctors can
            upload pre-recorded audio files for batch transcription — useful for
            transcribing notes from a clinic session at the end of the day.
          </P>

          <H2>How the Chat Works</H2>
          <P>
            The doctor chat sends the full conversation history on each message
            to maintain context across turns. The system prompt is injected
            server-side and never exposed to the frontend. The model is
            instructed to always clarify it is an AI assistant and that
            responses do not substitute for clinical judgment.
          </P>

          <Table
            headers={['Endpoint', 'Input', 'Output']}
            rows={[
              [
                'POST /api/ai/gemini/chat',
                '{ message, conversationHistory[] }',
                'Markdown-formatted response',
              ],
              [
                'POST /api/ai/chat/transcribe',
                'Audio file (multipart, max 25MB)',
                '{ text, language, success }',
              ],
              [
                'POST /api/ai/gemini/parse-prescription',
                '{ transcript }',
                'Structured prescription JSON',
              ],
            ]}
          />

          <InfoCard variant='warning' title='AI limitations'>
            The AI assistant is a decision support tool, not a diagnostic
            authority. All clinical decisions remain the sole responsibility of
            the licensed medical professional. Gemini responses are not
            validated against real-time drug databases — always cross-reference
            with official pharmaceutical references for critical dosage
            decisions.
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
