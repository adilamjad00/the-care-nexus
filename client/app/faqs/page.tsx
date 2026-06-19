'use client';

import { Header } from '@/components/home/Header';
import { Footer } from '@/components/home/Footer';
import { HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from 'next-intl';

export default function FAQPage() {
  const locale = useLocale();
  const isUrdu = locale === 'ur';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = isUrdu
    ? [
        {
          question: 'میں اپائنٹمنٹ کیسے بک کر سکتا/سکتی ہوں؟',
          answer:
            'اپنے پیشنٹ ڈیش بورڈ میں لاگ ان کریں، مطلوبہ ڈاکٹر منتخب کریں اور دستیاب ٹائم سلاٹس میں سے اپنی سہولت کے مطابق اپائنٹمنٹ بک کریں۔ آپ کو فوری کنفرمیشن موصول ہو جائے گی۔',
        },
        {
          question: 'کیا میرا ذاتی اور میڈیکل ڈیٹا محفوظ ہے؟',
          answer:
            'جی ہاں، آپ کا تمام ڈیٹا جدید انکرپشن، محفوظ سرورز اور محدود رسائی (role-based access control) کے ذریعے مکمل طور پر محفوظ رکھا جاتا ہے۔',
        },
        {
          question: 'کیا وائس اسسٹنٹ یا وائس فیچر دستیاب ہے؟',
          answer:
            'جی ہاں، ڈاکٹرز کے لیے وائس اسسٹڈ سسٹم دستیاب ہے جس کی مدد سے وہ آسانی سے پریسکرپشن تیار کر سکتے ہیں اور ورک فلو کو زیادہ تیز بنا سکتے ہیں۔',
        },
        {
          question:
            'کیا میں اپنی پچھلی میڈیکل ہسٹری اور پریسکرپشنز دیکھ سکتا/سکتی ہوں؟',
          answer:
            'جی ہاں، آپ کی تمام اپائنٹمنٹس، پریسکرپشنز اور میڈیکل ریکارڈز محفوظ طریقے سے آپ کے اکاؤنٹ میں اسٹور کیے جاتے ہیں جنہیں آپ کسی بھی وقت اپنے پیشنٹ ڈیش بورڈ سے دیکھ سکتے ہیں۔',
        },
        {
          question: 'میں اپائنٹمنٹ کو کیسے ری شیڈول یا کینسل کر سکتا/سکتی ہوں؟',
          answer:
            'آپ اپنے ڈیش بورڈ کے ذریعے مقررہ وقت سے پہلے اپائنٹمنٹ کو آسانی سے ری شیڈول یا کینسل کر سکتے ہیں۔ تبدیلی کے بعد سسٹم خودکار طور پر اپ ڈیٹ اور اطلاع فراہم کرتا ہے۔',
        },
        {
          question:
            'کیا اس پلیٹ فارم کو استعمال کرنے کے لیے کوئی سافٹ ویئر انسٹال کرنا ضروری ہے؟',
          answer:
            'نہیں، اس پلیٹ فارم کو استعمال کرنے کے لیے کسی بھی سافٹ ویئر کی ضرورت نہیں ہے۔ یہ مکمل طور پر ویب بیسڈ ہے اور موبائل، ٹیبلٹ اور ڈیسک ٹاپ پر تمام جدید براؤزرز میں کام کرتا ہے۔',
        },
      ]
    : [
        {
          question: 'How can I book an appointment?',
          answer:
            'Log in to your patient dashboard, choose a doctor, and select an available time slot that suits you. Once confirmed, your appointment will be scheduled instantly with full details.',
        },
        {
          question: 'Is my personal and medical data secure?',
          answer:
            'Yes, all data is fully protected using modern encryption, secure cloud infrastructure, and role-based access control to ensure complete privacy and safety.',
        },
        {
          question: 'Is a voice-assisted feature available?',
          answer:
            'Yes, doctors can use a voice-assisted workflow to create prescriptions efficiently, reducing manual effort and improving consultation speed and accuracy.',
        },
        {
          question: 'Can I view my previous medical history and prescriptions?',
          answer:
            'Yes, all your past appointments, prescriptions, and medical records are securely stored in your account and can be accessed anytime from your patient dashboard for easy reference.',
        },
        {
          question: 'How do I reschedule or cancel an appointment?',
          answer:
            'You can easily reschedule or cancel an appointment from your dashboard before the scheduled time. Any updates will be instantly reflected and notifications will be sent accordingly.',
        },
        {
          question: 'Do I need to install any software to use the platform?',
          answer:
            'No installation is required. The platform is fully web-based and works smoothly on all modern browsers across mobile, tablet, and desktop devices.',
        },
      ];

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />

      <main className='flex-1'>
        <div className='max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20 mb-8'>
          {/* HERO SECTION */}
          <section className='text-center mb-28 py-12'>
            <div className='inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6'>
              <HelpCircle className='w-4 h-4' />
              {isUrdu ? 'مدد سینٹر' : 'Help Center'}
            </div>

            <h1 className='text-5xl md:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto'>
              {isUrdu
                ? 'اکثر پوچھے جانے والے سوالات'
                : 'Frequently Asked Questions'}
            </h1>

            <p className='mt-8 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed'>
              {isUrdu
                ? 'یہاں آپ کو پلیٹ فارم سے متعلق عام سوالات کے واضح اور آسان جوابات ملیں گے تاکہ آپ کو ہر چیز بہتر طور پر سمجھ آئے۔'
                : 'Find clear and simple answers to common questions about the platform and its features to help you understand everything easily.'}
            </p>
          </section>

          {/* FAQ SECTION */}
          <section className='max-w-3xl mx-auto py-12'>
            <div className='space-y-4'>
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className='bg-primary/5 border border-black/5 rounded-2xl overflow-hidden'
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className='w-full flex items-center justify-between px-6 py-5 text-left hover:bg-primary/5 transition'
                    >
                      <span className='font-bold text-text-primary'>
                        {faq.question}
                      </span>
                      <span className='text-primary font-black'>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>

                    {isOpen && (
                      <div className='px-6 pb-5 text-text-secondary leading-relaxed'>
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* QUICK INFO CARDS SECTION */}
          <section className='grid md:grid-cols-3 gap-8  py-12'>
            <div className='bg-primary/5 border border-primary/10 rounded-3xl p-8 text-center'>
              <h3 className='text-4xl font-black text-primary'>24/7</h3>
              <p className='mt-2 text-text-secondary'>
                {isUrdu ? 'سپورٹ دستیاب' : 'Support Available'}
              </p>
            </div>

            <div className='bg-white border border-black/5 rounded-3xl p-8 text-center'>
              <h3 className='text-4xl font-black text-primary'>100%</h3>
              <p className='mt-2 text-text-secondary'>
                {isUrdu ? 'ڈیجیٹل سسٹم' : 'Digital System'}
              </p>
            </div>

            <div className='bg-primary/5 border border-primary/10 rounded-3xl p-8 text-center'>
              <h3 className='text-4xl font-black text-primary'>Fast</h3>
              <p className='mt-2 text-text-secondary'>
                {isUrdu ? 'جواب دہی' : 'Response Time'}
              </p>
            </div>
          </section>

          {/* CTA SECTION */}
          <section className=' text-center bg-primary/5 border border-primary/10 rounded-3xl py-12'>
            <h2 className='text-4xl font-black text-text-primary'>
              {isUrdu ? 'مزید مدد چاہیے؟' : 'Still Need Help?'}
            </h2>

            <p className='mt-4 text-text-secondary max-w-xl mx-auto'>
              {isUrdu
                ? 'ہماری ٹیم آپ کی مدد کے لیے ہمیشہ موجود ہے۔'
                : 'Our support team is always here to assist you anytime.'}
            </p>

            <button className='mt-8 px-8 py-3 rounded-xl bg-primary text-white font-semibold'>
              {isUrdu ? 'رابطہ کریں' : 'Contact Support'}
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
