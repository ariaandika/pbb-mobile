<script lang="ts">
  import transaction, { type Summary } from "../../lib/transaction.svelte";
  import { icons } from "../../lib/util";
    import date from "../../lib/date";

  let promise = transaction.promise();

  let summary: Summary = $state.raw([]);

  $effect(() => {
    promise.promise.then(() => {
      summary = transaction.recentSummary2(promise.data);
    })
  })
</script>


<section class="px-4 pb-4 grid gap-2">
  {#await promise.promise}
    <div>loading...</div>
  {:then}
    {@render records()}
  {:catch}
    <div>terjadi kesalahan</div>
  {/await}
</section>


{#snippet records()}
  {@const trs = promise.data.filter(e => summary.find(f => f.label == date.getMonthId(e.time)))}

  {#each trs as { id, name, value, category, kind, time }, i (id)}
    {@const down = kind == "output"}

    <!-- Date Group -->
    {#if i == 0 || time.getMonth() != trs[i - 1].time.getMonth()}
      {@const mon = date.getMonthId(time)}
      {@const year = time.getFullYear()}
      <div class="text-subtext">{mon} {year}</div>
    {/if}

    <!-- Record Container -->
    <div class="flex justify-between items-center p-4 bg-white rounded-md shadow-sm">
      <div class="flex gap-2 items-center">
        <div
          class="*:size-8 aspect-square"
          class:text-green-600={!down}
          class:text-red-600={down}
          class:rotate-z-180={down}
        >
          {@html icons.arr_up}
        </div>

        <div class="grid">
          <div>{name}</div>
          <div class="text-sm text-subtext">{category}</div>
        </div>
      </div>

      <div class="grid text-right">
        <div
          class="flex items-center font-bold"
          class:text-green-600={!down}
          class:text-red-600={down}
        >
          Rp. {value}
        </div>
        <div class="text-sm text-subtext">
          {date.format(time)}
        </div>
      </div>
    </div>
  {:else}
    <button onclick={transaction.mock} class="btn btn-primary btn-decor">
      Mock Data
    </button>
  {/each}
{/snippet}
