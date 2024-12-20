<script>
  import { fade } from "svelte/transition";
  import { vault } from "../lib/animation";

  const routes = [
    ["Transaksi", "/home/all"],
    ["Bulanan", "/home/monthly"],
    ["Debug", "/home/debug"],
  ];
</script>


<section class="fixed-fullscreen bg-black/20 z-vault" transition:fade></section>

<section
  id="create-vault"
  class="fixed-fullscreen bg-transparent overflow-x-hidden overflow-y-auto z-vault flex"
  transition:vault={{ flyDirection: "x" }}
>
  <section class="h-screen min-w-64 bg-dim rounded-r-lg overflow-x-hidden">
    <section class="px-4 py-1 variant-gray text-2xl font-bold">
      Menu
    </section>
    <section class="px-2 py-2 flex flex-col gap-2 text-lg">
      {#each routes as [name,href]}
        <a {href} data-replace class="btn btn-ghost btn-decor text-left shadow-none">
          {name}
        </a>
      {/each}
    </section>
  </section>

  <section data-back class="h-screen w-full">&ThickSpace;</section>
</section>

