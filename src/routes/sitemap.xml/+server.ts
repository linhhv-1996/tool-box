export const prerender = true;

import { SUPPORTED_LANGS, DEFAULT_LANG } from '$lib/config/constant';
import { allTools } from '$lib/config/tools';

export const GET = async () => {
  const domain = 'https://justlocaltools.com';

  // 1. Danh sách các trang tĩnh
  const staticPages = ['', '/privacy', '/terms', '/how-it-works'];

  // 2. Lấy danh sách Tools (loại bỏ tool bị loại)
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

  // 3. Lấy danh sách Blog (Dùng bản en làm chuẩn slug)
  const blogFiles = import.meta.glob('../../lib/content/en/blog/*.md');
  const blogSlugs = Object.keys(blogFiles)
    .map(path => path.split('/').pop()?.replace('.md', ''))
    .filter(Boolean);
  const blogPaths = blogSlugs.map(slug => `/blog/${slug}`);

  // Gom tất cả path gốc (không có prefix ngôn ngữ)
  const basePaths = [...staticPages, ...toolPaths, ...blogPaths];

  // Helper: Tạo URL đầy đủ dựa trên path và lang
  const getFullUrl = (path: string, lang: string) => {
    // Nếu là ngôn ngữ mặc định (en), không thêm prefix
    const prefix = lang === DEFAULT_LANG ? '' : `/${lang}`;
    // Đảm bảo không có 2 dấu gạch chéo ở đầu (ví dụ //privacy)
    const cleanPath = path === '/' ? '' : path; 
    return `${domain}${prefix}${cleanPath}`;
  };

  // 4. Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${basePaths.map(path => {
  // Tính priority dựa trên loại path
  const priority =
    path === '' ? '1.0' :
    toolPaths.includes(path) ? '0.9' :
    path.startsWith('/blog') ? '0.8' : '0.5';

  // Với mỗi path, tạo entry cho TẤT CẢ các ngôn ngữ hỗ trợ
  return SUPPORTED_LANGS.map(currentLang => {
    return `
  <url>
    <loc>${getFullUrl(path, currentLang)}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
    ${SUPPORTED_LANGS.map(lang => `
    <xhtml:link
      rel="alternate"
      hreflang="${lang}"
      href="${getFullUrl(path, lang)}"
    />`).join('')}
    <xhtml:link
      rel="alternate"
      hreflang="x-default"
      href="${getFullUrl(path, DEFAULT_LANG)}"
    />
  </url>`;
  }).join('');
}).join('')}
</urlset>`.trim();

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
};
