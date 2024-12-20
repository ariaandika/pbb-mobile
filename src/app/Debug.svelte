
<script lang="ts">
  import transactionIo from "../lib/transaction/io"
  import { logger } from "../lib/util";

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



<section class="container mx-auto grid gap-2 px-2 py-4">
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

