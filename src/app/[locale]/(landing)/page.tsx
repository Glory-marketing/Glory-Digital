"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useMessages } from "next-intl";
import { Preloader } from "@/components/landing/preloader";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Testimonials } from "@/components/landing/testimonials";
import { AITools } from "@/components/landing/ai-tools";
import { ContactForm } from "@/components/landing/contact-form";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const params = useParams<{ locale: string }>();
  const locale = params.locale || "en";

  const messages = useMessages();

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      {!loading && (
        <>
          <Hero locale={locale} />
          <About visible={true} />
          <Testimonials visible={true} />
          <AITools visible={true} />
          <ContactForm locale={locale} messages={messages} />
        </>
      )}
    </>
  );
}
