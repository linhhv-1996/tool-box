import { allTools } from '$lib/config/tools';

export const GET = async () => {
  const domain = 'https://justlocaltools.com';
  const languages = ['en', 'ja']; // 'en' là mặc định (không prefix), 'ja' là có prefix /ja
  const staticPages = ['', '/privacy', '/terms', '/how-it-works'];


  const excludedToolIds = [
    'remove-background',
    'social-media-resizer',
    'video-to-gif',
    'copy-text-from-image',
    'excel-to-pdf',
    'spreadsheet-to-json'
  ];

  const activeTools = allTools.filter(tool => !excludedToolIds.includes(tool.id));
  const toolPaths = activeTools.map(tool => tool.href);

  const blogFiles = import.meta.glob('../../lib/content/en/blog/*.md');
  const blogSlugs = Object.keys(blogFiles).map((path) => {
    return path.split('/').pop()?.replace('.md', '') || '';
  });
  const blogPaths = blogSlugs.map(slug => `/blog/${slug}`);


  const basePaths = [...staticPages, ...toolPaths, ...blogPaths];


  // Hàm tạo URL chuẩn cho từng ngôn ngữ
  const getUrl = (path: string, lang: string) => {
    if (lang === 'en') return `${domain}${path}`;
    // Nếu lang là 'ja', thêm /ja vào trước path. Lưu ý tránh double slash nếu path là ''
    return `${domain}/ja${path === '' ? '' : path}`;
  };

  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset
      xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xhtml="https://www.w3.org/1999/xhtml"
    >
      ${basePaths.map(path => {
    // Với mỗi path, ta tạo entry cho cả 2 ngôn ngữ
    return languages.map(lang => {
      const loc = getUrl(path, lang);
      const priority = path === '' ? '1.0' : 
                          (toolPaths.includes(path) ? '0.9' : 
                          (path.startsWith('/blog') ? '0.8' : '0.5'));

      return `
            <url>
              <loc>${loc}</loc>
              <changefreq>weekly</changefreq>
              <priority>${priority}</priority>
              ${languages.map(altLang => `
                <xhtml:link
                  rel="alternate"
                  hreflang="${altLang === 'en' ? 'en' : 'ja'}"
                  href="${getUrl(path, altLang)}"
                />`).join('')}
              <xhtml:link
                rel="alternate"
                hreflang="x-default"
                href="${getUrl(path, 'en')}"
              />
            </url>
          `;
    }).join('');
  }).join('')}
    </urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600' // Cache 1 tiếng cho bot
    }
  });
};
