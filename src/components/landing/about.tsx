"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLocale } from "next-intl";

const milestones = [
  { year: "2002", en: "The Beginning", ar: "البداية", enDesc: "A small printing shop with a big dream — that's where Glory Agency was born in the heart of the city.", arDesc: "مطبعة صغيرة بحلم كبير — هكذا ولدت وكالة جلوري في قلب المدينة." },
  { year: "2008", en: "The Expansion", ar: "التوسع", enDesc: "From printing to branding. We added design services and grew our team of creatives.", arDesc: "من الطباعة إلى بناء العلامات التجارية. أضفنا خدمات التصميم ووسعنا فريق المبدعين." },
  { year: "2015", en: "Digital Transformation", ar: "التحول الرقمي", enDesc: "The digital wave hit and we rode it. Websites, social media, digital advertising — we mastered it all.", arDesc: "جاءت الموجة الرقمية وركبناها. المواقع، السوشيال ميديا، الإعلانات الرقمية — أتقناها جميعاً." },
  { year: "2020", en: "The Pivot", ar: "التحول", enDesc: "When the world changed, we evolved. Remote work, AI tools, and a new vision for the future of advertising and marketing.", arDesc: "عندما تغير العالم، تطورنا. العمل عن بعد، أدوات الذكاء الاصطناعي، ورؤية جديدة لمستقبل الدعاية والإعلان والتسويق." },
  { year: "2024+", en: "Glory Agency", ar: "وكالة جلوري", enDesc: "Today we're a full-service advertising & marketing powerhouse — blending creativity, technology, and strategy to build your glory.", arDesc: "اليوم نحن وكالة دعاية وإعلان وتسويق متكاملة — نمزج بين الإبداع، التكنولوجيا، والاستراتيجية لنبني مجدك." },
];

const storyParagraphs = {
  en: [
    "It started with a single printing machine in a small workshop back in 2002. A man with a vision — to bring quality, creativity, and trust to every piece of paper that left his shop.",
    "Word spread fast. Soon, local businesses weren't just asking for prints — they wanted design, identity, a story. So we grew. We learned. We hired artists, thinkers, and dreamers.",
    "By 2015, the world had gone digital, and so had we. Websites, apps, social media campaigns — Glory Agency became the bridge between traditional craftsmanship and modern technology.",
    "Today, we are Glory Agency. A full-house creative agency that handles everything from a business card to a full brand ecosystem. We don't just make things look good — we make them work.",
    "This is our story. And if you're reading this, maybe it's time to write yours with us.",
  ],
  ar: [
    "بدأت القصة بآلة طباعة واحدة في ورشة صغيرة عام 2002. رجل برؤية — لتقديم الجودة، الإبداع، والثقة في كل ورقة تخرج من مطبعته.",
    "انتشر الخبر بسرعة. سرعان ما لم يطلب منه العملاء المحليون الطباعة فقط — بل أرادوا تصميماً، هوية، قصة. فكبرنا. تعلمنا. وظفنا فنانين، مفكرين، وحالمين.",
    "بحلول 2015، أصبح العالم رقمياً، وكذلك نحن. مواقع، تطبيقات، حملات سوشيال ميديا — أصبحت وكالة جلوري الجسر بين الحرفية التقليدية والتكنولوجيا الحديثة.",
    "اليوم، نحن وكالة جلوري. وكالة إبداعية متكاملة تتعامل مع كل شيء من بطاقة العمل إلى نظام العلامة التجارية الكامل. لا نجعل الأشياء تبدو جميلة فحسب — بل نجعلها تعمل.",
    "هذه قصتنا. وإن كنت تقرأ هذا، ربما حان الوقت لتكتب قصتك معنا.",
  ],
};

function TypewriterText({ text, speed = 40, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(prev => prev + text[idx]);
        setIdx(idx + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [idx, text, speed, onComplete]);

  return (
    <span>
      {displayed}
      {idx < text.length && <span className="inline-block w-0.5 h-5 bg-[#FCF6BA] ml-1 animate-pulse" />}
    </span>
  );
}

function StorySection({ locale, onReady }: { locale: string; onReady: () => void }) {
  const paragraphs = locale === "ar" ? storyParagraphs.ar : storyParagraphs.en;
  const [paraIdx, setParaIdx] = useState(0);
  const [paraDone, setParaDone] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      setParaIdx(0);
      setParaDone(true);
    }
  }, [inView]);

  useEffect(() => {
    if (!paraDone) return;
    if (paraIdx < paragraphs.length) {
      // Auto-advance to next paragraph after current one finishes
    }
  }, [paraIdx, paraDone, paragraphs.length]);

  if (!inView) return <div ref={ref} className="h-96" />;

  return (
    <div ref={ref} className="relative">
      <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#BF953F] via-[#FCF6BA] to-transparent" />
      <div className="space-y-8">
        {paragraphs.slice(0, paraIdx + 1).map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: i * 0.2 }}
            className="text-lg leading-relaxed text-gray-300"
            style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
          >
            {i === paraIdx ? (
              <TypewriterText
                text={p}
                speed={30}
                onComplete={() => {
                  if (paraIdx < paragraphs.length - 1) {
                    setTimeout(() => setParaIdx(paraIdx + 1), 1000);
                  } else {
                    onReady();
                  }
                }}
              />
            ) : (
              p
            )}
          </motion.p>
        ))}
      </div>
    </div>
  );
}

export function About({ visible }: { visible: boolean }) {
  const locale = useLocale();
  const [storyDone, setStoryDone] = useState(false);
  const [showMilestones, setShowMilestones] = useState(false);

  const handleStoryReady = () => {
    setStoryDone(true);
    setTimeout(() => setShowMilestones(true), 500);
  };

  if (!visible) return null;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#BF953F]/5 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#FCF6BA]/5 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          {/* Story Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {locale === "ar" ? "قصتنا" : "Our Story"}
            </h2>
            <p className="text-[#BF953F] text-sm tracking-widest uppercase mb-12">
              {locale === "ar" ? "من 2002 إلى اليوم" : "From 2002 to Today"}
            </p>
            <StorySection locale={locale} onReady={handleStoryReady} />
          </div>

          {/* Milestones Timeline */}
          {showMilestones && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl font-bold text-white mb-12 text-center">
                <span className="bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] bg-clip-text text-transparent">
                  {locale === "ar" ? "محطات رئيسية" : "Key Milestones"}
                </span>
              </h3>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#BF953F] via-[#FCF6BA] to-[#B38728] hidden md:block" />

                <div className="space-y-12">
                  {milestones.map((m, i) => (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.15 }}
                      className={`relative flex flex-col md:flex-row items-center gap-6 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      {/* Year badge */}
                      <div className="z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#BF953F] to-[#B38728] text-sm font-bold text-black shadow-lg shadow-[#BF953F]/20">
                        {m.year}
                      </div>

                      {/* Content */}
                      <div className={`flex-1 rounded-xl border border-white/5 bg-[#121212]/80 p-6 backdrop-blur-sm hover:border-[#BF953F]/30 transition-all ${i % 2 === 0 ? "md:text-left" : "md:text-right"}`}
                        style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
                      >
                        <h4 className="text-lg font-semibold text-[#FCF6BA] mb-2">
                          {locale === "ar" ? m.ar : m.en}
                        </h4>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {locale === "ar" ? m.arDesc : m.enDesc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
