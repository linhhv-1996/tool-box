import { allTools } from '$lib/config/tools';

export const GET = async () => {
  const domain = 'https://justlocaltools.com';
  const staticPages = ['', '/privacy', '/terms', '/how-it-works'];
  const toolPages = allTools.map(tool => tool.href);
  
  const pages = [...staticPages, ...toolPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
      xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
      xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
      xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
      xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
    >
      ${pages
        .map(page => `
          <url>
            <loc>${domain}${page}</loc>
            <changefreq>weekly</changefreq>
            <priority>${page === '' ? '1.0' : (toolPages.includes(page) ? '0.9' : '0.5')}</priority>
          </url>
        `)
        .join('')}
    </urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};
