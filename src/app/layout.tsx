import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://glory-digital.vercel.app";
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#BF953F"/><stop offset="50%" stop-color="#FCF6BA"/><stop offset="100%" stop-color="#B38728"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#0B0B0B"/><text x="32" y="44" text-anchor="middle" fill="url(#g)" font-family="Arial,sans-serif" font-weight="bold" font-size="32">G</text></svg>`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Glory For Marketing",
  description: "Premium marketing, design & development for brands that demand excellence",
  icons: {
    icon: `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`,
  },
  openGraph: {
    title: "Glory For Marketing",
    description: "Premium marketing, design & development for brands that demand excellence",
    images: ["/og-image.png"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
