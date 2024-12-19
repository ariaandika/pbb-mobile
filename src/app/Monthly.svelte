<script lang="ts">
  import ChartPie from "./lib/ChartPie.svelte";
  import transaction, { type Summary } from "../lib/transaction.svelte";
  import icons from "../lib/icons";
  import { fade, fly } from "svelte/transition";

  let intl = new Intl.NumberFormat("id-ID");

  let promise = transaction.promise();

  let summary: Summary = $state.raw([]);

  $effect(() => {
    promise.promise.then(() => {
      summary = transaction.recentSummary2(promise.data).toReversed();
    })
  })

</script>


<section transition:fade class="fixed-fullscreen bg-black/20">&ThickSpace;</section>

<section
  id="all-headbar"
  class="fixed w-screen top-0 flex items-center justify-between variant-gray shadow-lg z-vault"
  transition:fly={{ x: window.innerWidth, opacity: 1 }}
>
  <button data-back class="px-3 py-2 btn-ghost btn-decor">{@html icons.chev_left}</button>
  <div class="px-3 py-2 font-bold">Laporan Bulanan</div>
  <div class="px-3 py-2 btn-ghost btn-decor text-transparent pointer-events-none">
    {@html icons.chev_left}
  </div>
</section>

<section
  transition:fly={{ x: window.innerWidth, opacity: 1 }}
  class="fixed top-0 left-0 w-screen h-screen pb-4 bg-dim overflow-x-hidden overflow-y-auto"
>
  <section class="py-4">&ThickSpace;</section>

  <section class="px-4 my-2">
    <div class="flex gap-2 items-center">
      <div style="display: inline-block;" class="w-4 h-4 bg-green-600 rounded-sm">&ThickSpace;</div>
      <div>pemasukan,</div>
      <div style="display: inline-block;" class="w-4 h-4 bg-red-600 rounded-sm">&ThickSpace;</div>
      <div>pengeluaran</div>
    </div>
  </section>

  <section class="px-4 grid gap-2">
    {#each summary as { id, input, output, label, total }, i (id)}
      {@const prev = summary[i + 1]?.total ?? 0}
      {@const diff = total - prev}
      {@const eq = diff == 0}
      {@const down = diff < 0}
      <section style="grid-template-columns: 3fr 1fr;" class="grid bg-white p-4 rounded-lg shadow-lg">

        <div class="flex flex-col gap-2">
          <div class="font-bold">{label} {id.slice(-4)}</div>
          <div>Saldo: Rp. {intl.format(total)}</div>
          <div
            class="flex items-center gap-2 font-bold"
            class:text-gray-600={eq}
            class:text-green-600={!eq && !down}
            class:text-red-600={!eq && down}
          >
            <div
              class="*:size-6 inline-block"
              class:rotate-z-180={!eq && down}
              class:rotate-z-90={eq}
            >
              {@html icons.arr_up}
            </div>
            Rp. {diff}
          </div>
        </div>

        <section class="flex justify-end">
          <ChartPie {input} {output}/>
        </section>

      </section>
    {/each}
  </section>

</section>



