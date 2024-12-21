
<script lang="ts">
    import { fade, fly } from "svelte/transition";
  import transactionIo from "../lib/transaction/io"
  import { icons, logger } from "../lib/util";

  let seedPromise = Promise.resolve();

  async function reseed() {
    seedPromise = (async () => {
      await transactionIo.clear();
      await transactionIo.mock();
    })();
  }

  function gencls(sym: Symbol, force?: boolean) {
    return (force ?? logger.isError(sym)) ?
      "text-red-600 bg-red-600/40" : ""
  }

</script>


<section transition:fade class="fixed-fullscreen bg-black/20">&ThickSpace;</section>

<section
  id="all-headbar"
  class="fixed w-screen top-0 flex items-center justify-between variant-gray shadow-lg z-vault"
  transition:fly={{ x: window.innerWidth, opacity: 1 }}
>
  <button data-back class="px-3 py-2 btn-ghost btn-decor">{@html icons.chev_left}</button>
  <div class="px-3 py-2 font-bold">Debug</div>
  <div class="px-3 py-2 btn-ghost btn-decor text-transparent pointer-events-none">
    {@html icons.chev_left}
  </div>
</section>


<section
  transition:fly={{ x: window.innerWidth, opacity: 1 }}
  class="fixed top-0 left-0 w-screen h-screen pb-4 bg-dim overflow-x-hidden overflow-y-auto"
>
  <!--  -->
  <section class="container mx-auto grid gap-2 px-2 py-4 pt-16 flex flex-col ">
    {#await seedPromise}
      loading...
    {:then}
      <button class="btn btn-primary btn-decor" onclick={reseed}>re-seed</button>
    {:catch err}
      <div class="font-bold {gencls(Symbol("_"), true)}">{err.message ?? err}</div>
    {/await}

    {#each logger.logs.toReversed() as [sym, msg]}
      <div class="font-bold {gencls(sym)}">{msg}</div>
    {/each}
  </section>
</section>

