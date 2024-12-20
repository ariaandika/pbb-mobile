<script>
  import List from "./lib/List.svelte";
  import { icons } from "../lib/util";
  import { fade, fly } from "svelte/transition";

</script>


<section transition:fade class="fixed-fullscreen bg-black/20">&ThickSpace;</section>

<section
  id="all-headbar"
  class="fixed w-screen top-0 flex items-center justify-between variant-gray shadow-lg z-vault"
  transition:fly={{ x: window.innerWidth, opacity: 1 }}
>
  <button data-back class="px-3 py-2 btn-ghost btn-decor">{@html icons.chev_left}</button>
  <div class="px-3 py-2 font-bold">Semua Transaksi</div>
  <div class="px-3 py-2 btn-ghost btn-decor text-transparent pointer-events-none">
    {@html icons.chev_left}
  </div>
</section>

<section
  transition:fly={{ x: window.innerWidth, opacity: 1 }}
  class="fixed-fullscreen bg-dim overflow-x-hidden overflow-y-auto"
>
  <section class="py-4">&ThickSpace;</section>
  <List/>
</section>

