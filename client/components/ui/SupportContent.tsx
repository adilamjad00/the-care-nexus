"use client";

import { HelpCircle, Mail, Phone, Clock } from "lucide-react";
import { useLocale } from "next-intl";

export default function SupportContent() {
  const locale = useLocale();
  const isUrdu = locale === "ur";

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 mt-20 mb-8">

      {/* HERO SECTION */}
      <section className="text-center mb-24">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-4 py-2 text-sm font-semibold text-primary mb-6">
          <HelpCircle className="w-4 h-4" />
          {isUrdu ? "سپورٹ سینٹر" : "Support Center"}
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-text-primary tracking-tight max-w-4xl mx-auto">
          {isUrdu
            ? "ہم آپ کی کس طرح مدد کر سکتے ہیں؟"
            : "How can we help you?"}
        </h1>

        <p className="mt-8 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          {isUrdu
            ? "ہماری ٹیم آپ کو پلیٹ فارم کے استعمال، آن بورڈنگ اور تکنیکی مسائل میں مکمل مدد فراہم کرتی ہے۔"
            : "Our support team helps with onboarding, usage guidance, and technical troubleshooting."}
        </p>
      </section>

      {/* SUPPORT OPTIONS */}
      <section className="grid md:grid-cols-3 gap-8 mb-24 pt-12">

        {/* Email */}
        <div className="bg-white p-8 rounded-3xl border border-black/5 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <h3 className="text-lg font-black text-text-primary">
            {isUrdu ? "ای میل سپورٹ" : "Email Support"}
          </h3>

          <p className="text-text-secondary mt-3 text-sm">
            {isUrdu
              ? "ہم عام طور پر 24 گھنٹوں میں جواب دیتے ہیں۔"
              : "We usually respond within 24 hours."}
          </p>

          <a
            href="mailto:support@carenexus.com"
            className="text-primary font-semibold mt-4 inline-block hover:underline"
          >
            support@carenexus.com
          </a>
        </div>

        {/* Phone */}
        <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 text-center">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
            <Phone className="w-6 h-6 text-primary" />
          </div>

          <h3 className="text-lg font-black text-text-primary">
            {isUrdu ? "فون سپورٹ" : "Phone Support"}
          </h3>

          <p className="text-text-secondary mt-3 text-sm">
            {isUrdu
              ? "کلینک سیٹ اپ اور آن بورڈنگ کے لیے براہ راست مدد۔"
              : "Direct help for onboarding and clinic setup."}
          </p>

          <a
            href="tel:+923241441444"
            className="text-primary font-semibold mt-4 inline-block hover:underline"
          >
            +92324-1441444
          </a>
        </div>

        {/* Hours */}
        <div className="bg-white p-8 rounded-3xl border border-black/5 text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Clock className="w-6 h-6 text-primary" />
          </div>

          <h3 className="text-lg font-black text-text-primary">
            {isUrdu ? "اوقاتِ کار" : "Working Hours"}
          </h3>

          <p className="text-text-secondary mt-3 text-sm">
            {isUrdu
              ? "پیر تا جمعہ، صبح 9 تا شام 6 (PKT)"
              : "Mon - Fri, 9 AM - 6 PM (PKT)"}
          </p>
        </div>

      </section>

      {/* WHY WE CAN HELP */}
      <section className="mb-16 py-6 max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-black text-text-primary">
          {isUrdu ? "صارف سپورٹ سینٹر" : "User Support Center"}
        </h2>

        <p className="text-lg leading-8 text-text-secondary max-w-6xl">
          {isUrdu
            ? "یہ سپورٹ سینٹر آپ کی مدد کے لیے تیار کیا گیا ہے تاکہ آپ پلیٹ فارم سے متعلق کسی بھی مسئلے، سوال یا رہنمائی کو آسانی سے حل کر سکیں۔ یہاں آپ کو اہم معلومات، عمومی سوالات اور سسٹم کے استعمال سے متعلق مکمل رہنمائی فراہم کی جاتی ہے۔"
            : "This support center is designed to help you resolve any issues, questions, or guidance related to the platform. Here you will find important information, frequently asked questions, and complete guidance for using the system effectively."}
        </p>
      </section>





      {/* CTA SECTION */}
      <section className="text-center bg-primary/5 border border-primary/10 rounded-3xl py-16">

        <h2 className="text-4xl font-black text-text-primary">
          {isUrdu ? "مدد درکار ہے؟" : "Need Immediate Help?"}
        </h2>

        <p className="mt-4 text-text-secondary max-w-xl mx-auto">
          {isUrdu
            ? "ہماری سپورٹ ٹیم آپ کے لیے ہر وقت موجود ہے۔"
            : "Our support team is always ready to assist you."}
        </p>

        <button className="mt-8 px-8 py-3 rounded-xl bg-primary text-white font-semibold">
          {isUrdu ? "رابطہ کریں" : "Contact Support"}
        </button>

      </section>

    </div>
  );
}