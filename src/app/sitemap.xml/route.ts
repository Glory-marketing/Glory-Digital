const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://glory-digital.vercel.app";

const locales = ["en", "ar"] as const;

interface RouteEntry {
  path: string;
  changefreq?: string;
  priority?: string;
}

const routes: RouteEntry[] = [
  { path: "", changefreq: "weekly", priority: "1.0" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/portfolio", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/quote", changefreq: "monthly", priority: "0.6" },
  { path: "/scheduling", changefreq: "monthly", priority: "0.5" },
];

export async function GET() {
  const urls = routes.flatMap((route) =>
    locales.map((locale) => {
      const loc = `${BASE_URL}/${locale}${route.path}`;
      const links = locales
        .map((l) => `      <xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}${route.path}" />`)
        .join("\n");
      return `  <url>
    <loc>${loc}</loc>
    <changefreq>${route.changefreq || "monthly"}</changefreq>
    <priority>${route.priority || "0.5"}</priority>
${links}
  </url>`;
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
