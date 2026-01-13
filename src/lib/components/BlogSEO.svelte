<script lang="ts">
  import { page } from "$app/state";
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";

  const baseUrl = "https://justlocaltools.com";

  // Lấy data từ SvelteKit
  let data = $derived(page.data);
  let meta = $derived(data.meta || {});
  let lang = $derived(data.lang || DEFAULT_LANG);
  let slug = $derived(data.slug || "");

  // 2. Hàm tạo URL theo ngôn ngữ (Helper function)
  const getUrl = (l: string, s: string) => {
    const path = l === DEFAULT_LANG ? "" : `/${l}`;
    return `${baseUrl}${path}/blog/${s}`;
  };

  // 3. Tự động tạo danh sách các thẻ alternate
  let alternates = $derived(
    SUPPORTED_LANGS.map((l) => ({
      href: getUrl(l, slug),
      hreflang: l,
    })),
  );

  let currentUrl = $derived(getUrl(lang, slug));
  let xDefaultUrl = $derived(getUrl(DEFAULT_LANG, slug));

  // Dữ liệu SEO
  let title = $derived(meta.title || "Blog");
  let description = $derived(meta.description || "");
  let date = $derived(meta.date || "2026-01-01");
  let ogImage = $derived(meta.ogImage || `${baseUrl}/og/home.png`);

  let jsonLd = $derived(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: title,
      description: description,
      datePublished: date,
      url: currentUrl,
      image: ogImage,
      author: { "@type": "Organization", name: "JustLocalTools" },
    }),
  );
</script>

<svelte:head>
  <title>{title} | JustLocalTools</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={currentUrl} />

  {#each alternates as alt}
    <link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
  {/each}
  <link rel="alternate" hreflang="x-default" href={xDefaultUrl} />

  <meta property="og:type" content="article" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={currentUrl} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
