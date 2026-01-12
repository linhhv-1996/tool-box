export const prerender = true;

import { allTools } from '$lib/config/tools';

export const GET = async () => {
  const domain = 'https://justlocaltools.com';

  // Ngôn ngữ: en (default, không prefix) & ja (/ja)
  const languages = ['en', 'ja'];

  // Static pages
  const staticPages = ['', '/privacy', '/terms', '/how-it-works'];

  // Tool bị loại
  const excludedToolIds = [
    'remove-background',
    'social-media-resizer',
    'video-to-gif',
    'copy-text-from-image',
    'excel-to-pdf',
    'spreadsheet-to-json'
  ];

  // Tools
  const activeTools = allTools.filter(
    tool => !excludedToolIds.includes(tool.id)
  );
  const toolPaths = activeTools.map(tool => tool.href);

  // Blog
  const blogFiles = import.meta.glob('../../lib/content/en/blog/*.md');
  const blogSlugs = Object.keys(blogFiles)
    .map(path => path.split('/').pop()?.replace('.md', ''))
    .filter(Boolean);

  const blogPaths = blogSlugs.map(slug => `/blog/${slug}`);

  // All paths
  const basePaths = [...staticPages, ...toolPaths, ...blogPaths];

  // Build URL theo ngôn ngữ
  const getUrl = (path: string, lang: string) => {
    if (lang === 'en') return `${domain}${path}`;
    return `${domain}/ja${path === '' ? '' : path}`;
  };

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${basePaths.map(path => {
  const priority =
    path === '' ? '1.0' :
    toolPaths.includes(path) ? '0.9' :
    path.startsWith('/blog') ? '0.8' : '0.5';

  return `
  <url>
    <loc>${getUrl(path, 'en')}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>

    <xhtml:link
      rel="alternate"
      hreflang="en"
      href="${getUrl(path, 'en')}"
    />
    <xhtml:link
      rel="alternate"
      hreflang="ja"
      href="${getUrl(path, 'ja')}"
    />
    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${getUrl(path, 'en')}"
    />
  </url>`;
}).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};
