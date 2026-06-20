const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://glory-digital.vercel.app";

export async function GET() {
  const body = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin paths
Disallow: /en/glory-admin/
Disallow: /ar/glory-admin/
Disallow: /en/client-portal/
Disallow: /ar/client-portal/
Disallow: /en/api/
Disallow: /ar/api/
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
