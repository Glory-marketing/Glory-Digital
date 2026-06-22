import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glory-digital.vercel.app";
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#BF953F"/><stop offset="50%" stop-color="#FCF6BA"/><stop offset="100%" stop-color="#B38728"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#0B0B0B"/><text x="32" y="44" text-anchor="middle" fill="url(#g)" font-family="Arial,sans-serif" font-weight="bold" font-size="32">G</text></svg>`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Glory Agency (Advertising & Marketing)",
  alternateName: "وكالة جلوري (دعاية وإعلان وتسويق)",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description: "Premium advertising, marketing, design & development for brands that demand excellence",
  address: {
    "@type": "PostalAddress",
    addressCountry: "EG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+20-112-332-8964",
    contactType: "customer service",
    availableLanguage: ["English", "Arabic"],
  },
  sameAs: [],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Glory Agency (Advertising & Marketing)",
    template: "%s | Glory Agency",
  },
  description: "Premium advertising, marketing, design & development for brands that demand excellence — وكالة جلوري للدعاية والإعلان والتسويق",
  keywords: ["advertising agency", "marketing agency", "digital marketing", "branding", "printing", "وكالة جلوري", "دعاية وإعلان", "تسويق إلكتروني"],
  icons: {
    icon: `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`,
  },
  openGraph: {
    title: "Glory Agency (Advertising & Marketing)",
    description: "Premium advertising, marketing, design & development for brands that demand excellence",
    images: ["/og-image.png"],
    type: "website",
    locale: "en_US",
    siteName: "Glory Agency",
    alternateLocale: "ar_EG",
  },
  alternates: {
    languages: {
      en: `${siteUrl}/en`,
      ar: `${siteUrl}/ar`,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
  other: {
    "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
