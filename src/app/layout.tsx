import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glory For Marketing",
  description: "Premium marketing, design & development for brands that demand excellence",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
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
