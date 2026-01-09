<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";

  const siteName = "JustLocalTools";
  const domain = "https://justlocaltools.com";
  const defaultOgImage = `${domain}/og-image.png`;

</script>

<svelte:head>
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:image" content={defaultOgImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/png" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={defaultOgImage} />
</svelte:head>

<div class="selection:bg-yellow-200 min-h-screen flex flex-col bg-white text-[#1a1a1a]">
  <Header />
  
  <main class="flex-grow">
    <slot />
  </main>

  <Footer />
</div>
