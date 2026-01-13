<script lang="ts">
  import { allTools } from '$lib/config/tools';
  import type { Language } from '$lib/translate/ui';
  import { DEFAULT_LANG, SUPPORTED_LANGS } from "$lib/config/constant";

  // Lấy dữ liệu từ props (Svelte 5)
  let { lang, toolId = "" } = $props();

  const baseUrl = "https://justlocaltools.com";

  // 1. Tìm thông tin tool (nếu có)
  let tool = $derived(allTools.find(t => t.id === toolId));

  // 2. Metadata cho trang chủ (Fallback khi không phải trang tool cụ thể)
  const homeData = {
    title: { 
      en: "JustLocalTools - Free & Private Online Tools", 
      ja: "JustLocalTools - 無料・安全なブラウザ完結型ツール集",
      ko: "JustLocalTools - 무료 PDF 합치기 · 용량 줄이기 · 개인정보 보호 도구" 
    },
    description: { 
      en: "100% client-side tools for PDF, Images, and more. No file uploads, everything stays on your device.", 
      ja: "PDFや画像処理を100%ブラウザ上で. サーバー送信なし、会員登録不要の安全なツール集。",
      ko: "PDF 합치기, 압축, 이미지 변환 등 모든 작업을 서버 업로드 없이 100% 브라우저에서 안전하게 처리하세요."
    },
    ogTitle: { 
      en: "JustLocalTools: Privacy-first Online Tools", 
      ja: "JustLocalTools: プライバシー重視のオンラインツール",
      ko: "JustLocalTools: 개인정보 걱정 없는 무료 온라인 도구"
    }
  };

  // 3. Logic Derived - Tự động tính toán dựa trên state
  let currentLang = $derived(lang as Language);
  let seo = $derived(tool ? tool.seo : homeData);
  let name = $derived(tool ? tool.name[currentLang] : "JustLocalTools");
  
  // Hàm helper để tạo URL đúng chuẩn cho từng ngôn ngữ
  const constructUrl = (l: string, id: string) => {
    const langPath = l === DEFAULT_LANG ? '' : `/${l}`;
    const toolSlug = id ? `/${id}` : '';
    return `${baseUrl}${langPath}${toolSlug}`;
  };

  // URL hiện tại của trang
  let currentUrl = $derived(constructUrl(lang, toolId));

  // Tạo danh sách alternates tự động từ SUPPORTED_LANGS config
  let alternateLinks = $derived(
    SUPPORTED_LANGS.map(l => ({
      href: constructUrl(l, toolId),
      hreflang: l
    }))
  );

  let xDefaultUrl = $derived(constructUrl(DEFAULT_LANG, toolId));
  let ogImageUrl = $derived(`${baseUrl}/og/${toolId || 'home'}.png`);

  // 4. JSON-LD (Schema.org)
  let jsonLd = $derived(JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "operatingSystem": "Any",
    "applicationCategory": "BusinessApplication",
    "url": currentUrl,
    "description": seo.description[currentLang],
    "applicationSuite": "JustLocalTools",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  }));
</script>

<svelte:head>
  <title>{seo.title[currentLang]} | JustLocalTools</title>
  <meta name="description" content={seo.description[currentLang]} />
  <link rel="canonical" href={currentUrl} />

  {#each alternateLinks as alt}
    <link rel="alternate" hreflang={alt.hreflang} href={alt.href} />
  {/each}
  <link rel="alternate" hreflang="x-default" href={xDefaultUrl} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={currentUrl} />
  <meta property="og:title" content={seo.ogTitle?.[currentLang] || seo.title[currentLang]} />
  <meta property="og:description" content={seo.description[currentLang]} />
  <meta property="og:image" content={ogImageUrl} />
  <meta property="og:site_name" content="JustLocalTools" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={seo.ogTitle?.[currentLang] || seo.title[currentLang]} />
  <meta name="twitter:description" content={seo.description[currentLang]} />
  <meta name="twitter:image" content={ogImageUrl} />

  {@html `<script type="application/ld+json">${jsonLd}<\/script>`}
</svelte:head>
