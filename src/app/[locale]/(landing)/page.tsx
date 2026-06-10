"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useMessages } from "next-intl";
import { Preloader } from "@/components/landing/preloader";
import { Hero } from "@/components/landing/hero";
import { ServicesPodium } from "@/components/landing/podium";
import { About } from "@/components/landing/about";
import { Portfolio } from "@/components/landing/portfolio";
import { Testimonials } from "@/components/landing/testimonials";
import { AITools } from "@/components/landing/ai-tools";
import { ContactForm } from "@/components/landing/contact-form";

export default function LandingPage() {
  const [loading, setLoading] = useState(true);
  const params = useParams<{ locale: string }>();
  const locale = params.locale || "en";

  const t = useTranslations();
  const messages = useMessages();

  const [sections, setSections] = useState({
    hero: true,
    services: true,
    about: true,
    portfolio: true,
    testimonials: true,
    ai_tools: true,
    contact: true,
  });

  return (
    <>
      <Preloader onComplete={() => setLoading(false)} />
      {!loading && (
        <>
          <Hero locale={locale} />
          <ServicesPodium />
          <About
            title={t("about.title")}
            content={t("about.content")}
            visible={sections.about}
          />
          <Portfolio visible={sections.portfolio} />
          <Testimonials visible={sections.testimonials} />
          <AITools visible={sections.ai_tools} />
          <ContactForm locale={locale} messages={messages} />
        </>
      )}
    </>
  );
}
