<script>
  import "../app.css";
  import Header from "$lib/components/Header.svelte";
  import Footer from "$lib/components/Footer.svelte";
</script>

<div class="selection:bg-yellow-200 min-h-screen flex flex-col bg-white text-[#1a1a1a]">
  <Header />
  
  <main class="flex-grow">
    <slot />
  </main>

  <Footer />
</div>
