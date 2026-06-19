'use client';
import { useLocale } from 'next-intl';
import DocLayout from '../../components/DocLayout';
import { P, H2, UL, LI, Table, InfoCard } from '../../components/DocProse';

export default function FeatureMessagingPage() {
  const isUrdu = useLocale() === 'ur';

  return (
    <DocLayout
      title='Messaging Feature'
      titleUr='پیغام رسانی کی خصوصیت'
      description='Real-time encrypted direct messaging between patients and doctors.'
      breadcrumbs={[
        { label: 'Features', href: '/docs/features/appointments' },
        { label: 'Messaging' },
      ]}
      lastUpdated='June 2026'
      readingTime='4 min read'
    >
      {isUrdu ? (
        <>
          <P>
            دی کیئر نیکسس میں پیغام رسانی کی خصوصیت مریض اور ڈاکٹر کے درمیان
            محفوظ اور رئیل ٹائم رابطے کی سہولت فراہم کرتی ہے۔ یہ نظام Socket.IO
            پر مبنی ہے اور فوری پیغامات کی ترسیل کو یقینی بناتا ہے۔
          </P>

          <H2>خصوصیات</H2>
          <UL>
            <LI>Socket.IO کے ذریعے رئیل ٹائم میسجنگ</LI>
            <LI>ٹائپنگ انڈیکیٹر (ڈاکٹر لکھ رہا ہے وغیرہ)</LI>
            <LI>آن لائن/آف لائن اسٹیٹس</LI>
            <LI>ان ریڈ میسج کاؤنٹر</LI>
            <LI>پہلا پیغام بھیجتے ہی خودکار چیٹ روم بن جاتا ہے</LI>
            <LI>AES-256 کے ذریعے محفوظ شدہ پیغامات</LI>
            <LI>تیز لوڈنگ کے لیے Redis میں آخری 50 پیغامات</LI>
            <LI>پرانے پیغامات REST API کے ذریعے دستیاب</LI>
          </UL>

          <H2>چیٹ لسٹ</H2>
          <P>
            چیٹ سائڈبار میں تمام گفتگوئیں آخری پیغام کے وقت کے مطابق دکھائی جاتی
            ہیں۔ ہر چیٹ میں دوسرے شخص کا نام، تصویر، آخری پیغام کا خلاصہ اور ان
            ریڈ کاؤنٹر شامل ہوتا ہے۔
          </P>

          <InfoCard variant='info' title='میسج کی اقسام'>
            فی الحال صرف ٹیکسٹ پیغامات سپورٹ کیے جاتے ہیں۔ مستقبل میں تصاویر اور
            فائل شیئرنگ شامل کی جائے گی۔
          </InfoCard>
        </>
      ) : (
        <>
          <P>The messaging feature provides direct, private communication...</P>

          <H2>Features</H2>
          <UL>
            <LI>Real-time message delivery via Socket.IO</LI>
            <LI>Typing indicators</LI>
            <LI>Online/offline status</LI>
            <LI>Unread message badges</LI>
            <LI>Auto conversation creation</LI>
            <LI>AES-256 encryption</LI>
            <LI>Redis caching for fast load</LI>
            <LI>REST fallback history</LI>
          </UL>

          <H2>Conversation List</H2>
          <P>The chat sidebar shows all active conversations sorted...</P>

          <InfoCard variant='info' title='Message types'>
            Currently only text messages are supported...
          </InfoCard>
        </>
      )}
    </DocLayout>
  );
}
