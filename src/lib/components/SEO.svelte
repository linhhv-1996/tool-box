<script lang="ts">
  import { allTools } from '$lib/config/tools';
    import type { Language } from '$lib/translate/ui';
  
  // Chỉ cần nhận 2 prop này là đủ
  let { lang, toolId = "" } = $props();

  const baseUrl = "https://justlocaltools.com";

  // 1. Tìm tool data từ config
  // Nếu toolId trống => Đây là trang chủ
  let tool = $derived(allTools.find(t => t.id === toolId));

  // 2. Metadata mặc định cho trang chủ (nếu không tìm thấy toolId)
  const homeData = {
    title: { 
        en: "JustLocalTools - Free & Private Online Tools", 
        ja: "JustLocalTools - 無料・安全なブラウザ完結型ツール集" },
    description: { 
      en: "100% client-side tools for PDF, Images, and more. No file uploads, everything stays on your device.", 
      ja: "PDFや画像処理を100%ブラウザ上で。サーバー送信なし、会員登録不要の安全なツール集。" 
    },
    ogTitle: { 
        en: "JustLocalTools: Privacy-first Online Tools", 
        ja: "JustLocalTools: プライバシー重視のオンラインツール" 
    }
  };

  // 3. Sử dụng $derived để phản ứng theo toolId và lang
  let seo = $derived(tool ? tool.seo : homeData);
  let name = $derived(tool ? tool.name[lang as Language] : "JustLocalTools");
  
  let langPath = $derived(lang === 'ja' ? '/ja' : '');
  let currentUrl = $derived(`${baseUrl}${langPath}${toolId ? '/' + toolId : ''}`);
  
  let enUrl = $derived(`${baseUrl}${toolId ? '/' + toolId : ''}`);
  let jaUrl = $derived(`${baseUrl}/ja${toolId ? '/' + toolId : ''}`);
  let ogImageUrl = $derived(`${baseUrl}/og/${toolId || 'home'}.png`);

  // 4. JSON-LD Derived
  let jsonLd = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "operatingSystem": "Any",
    "applicationCategory": "BusinessApplication",
    "url": currentUrl,
    "description": seo.description[lang as Language],
    "applicationSuite": "JustLocalTools",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }));
</script>

<svelte:head>
  <title>{seo.title[lang as Language]} | JustLocalTools</title>
  <meta name="description" content={seo.description[lang as Language]} />

  <link rel="canonical" href={currentUrl} />
  <link rel="alternate" hreflang="en" href={enUrl} />
  <link rel="alternate" hreflang="ja" href={jaUrl} />
  <link rel="alternate" hreflang="x-default" href={enUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={currentUrl} />
  <meta property="og:title" content={seo.ogTitle[lang as Language] || seo.title[lang as Language]} />
  <meta property="og:description" content={seo.description[lang as Language]} />
  <meta property="og:image" content={ogImageUrl} />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seo.ogTitle[lang as Language] || seo.title[lang as Language]} />
  <meta name="twitter:image" content={ogImageUrl} />

  {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
