<script lang="ts">
  import { page } from '$app/state';

  // Tự động lấy data từ hàm load của +page.ts
  let data = $derived(page.data);
  let meta = $derived(data.meta || {});
  let lang = $derived(data.lang || 'en');
  let slug = $derived(data.slug || '');

  const baseUrl = "https://justlocaltools.com";

  // Logic tính toán URL
  let langPath = $derived(lang === 'ja' ? '/ja' : '');
  let currentUrl = $derived(`${baseUrl}${langPath}/blog/${slug}`);
  
  // URL cho các thẻ alternate (đa ngôn ngữ)
  let enUrl = $derived(`${baseUrl}/blog/${slug}`);
  let jaUrl = $derived(`${baseUrl}/ja/blog/${slug}`);

  // Dữ liệu SEO từ meta
  let title = $derived(meta.title || "Blog");
  let description = $derived(meta.description || "");
  let date = $derived(meta.date || "2026-01-01");
  let ogImage = $derived(meta.ogImage || `${baseUrl}/og/home.png`);

  let jsonLd = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "datePublished": date,
    "url": currentUrl,
    "image": ogImage,
    "author": { "@type": "Organization", "name": "JustLocalTools" }
  }));
</script>

<svelte:head>
  <title>{title} | JustLocalTools</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={currentUrl} />
  
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="ja" href={jaUrl} />
  <link rel="alternate" hreflang="x-default" href={enUrl} />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={currentUrl} />
    <meta property="og:site_name" content="JustLocalTools" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />
  
  {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
