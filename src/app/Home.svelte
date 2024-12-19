<script lang="ts">
  import Chart from "./lib/Chart.svelte";
  import Create from "./Create.svelte";
  import Menu from "./Menu.svelte";
  import All from "./All.svelte";
  import Monthly from "./Monthly.svelte";
  import { Tween } from "svelte/motion";
  import icons from "../lib/icons";
  import router from "../lib/router";
  import session from "../lib/session.svelte";
  import { fly } from "svelte/transition";
  import { onFullScroll, paralax, vault } from "../lib/animation";
  import transaction, { type Summary } from "../lib/transaction.svelte"

  let intl = new Intl.NumberFormat("id-ID");
  let url = router.context()
  let promise = transaction.promise();
  let user = session.context()

  let summary: Summary = $state.raw([]);
  let current = $derived(summary.at(-1)?.total ?? 0);
  let tweenValue = Tween.of(() => current);
  let value = $derived(intl.format(tweenValue.current))

  $effect(() => {
    promise.promise.then(() => {
      const res = transaction.recentSummary2(promise.data);
      const sliced = res.slice(-6);
      summary = sliced
    })
  })
</script>


<section
  id="headbar"
  class="fixed top-0 left-0 w-full z-headbar isolate"
  in:fly={{ y: -32, opacity: 1 }}
>
  <section
    style="z-index: 20"
    class="relative flex items-center justify-between variant-gray shadow-lg "
  >
    <a href="?menu=1" class="px-3 py-2 btn-ghost btn-decor">{@html icons.menu}</a>
    <div class="px-3 py-2 font-bold">Kas Sosial</div>
    <button onclick={session.logout} class="px-3 py-2 btn-ghost btn-decor">{@html icons.user}</button>
  </section>
  <section
    use:onFullScroll={{ id: "home-vault" }}
    style="z-index: 10;"
    class="relative px-4 py-3 variant-primary text-4xl font-bold transition-transform
      -translate-y-full fullscroll:translate-y-0 fullscroll:shadow-lg"
  >
    Rp. {value}
  </section>
</section>

{#if user.value.role == "bendahara"}
<a
  id="floating-action"
  href="?create=1"
  class="
    fixed bottom-8 right-8 w-16 h-16 z-float-action
    grid place-items-center
    btn-primary shadow-lg shadow-black/20 rounded-full cursor-pointer"
>
  {@html icons.plus}
</a>
{/if}

<section
  id="home-vault"
  class="relative fullscreen bg-transparent overflow-x-hidden overflow-y-auto"
  transition:vault={{ scrollEnd: "bounceback", fly: "scroll" }}
  use:paralax={{ id: "home-paralax" }}
>

  <section id="home-paralax" class="relative fullscreen grid place-items-center variant-primary">
    <section class="w-full px-4 pt-6 ">
      <div class="text-xl font-bold">Halo {user.value.name}, saldo kas saat ini:</div>
      <div class="text-6xl font-bold">Rp. {value}</div>
      <!-- {#if true} -->
      <!--   {@const [prev = 0,curr = 0] = summary.slice(-2).map(e => e.total)} -->
      <!--   {@const diff = curr - prev} -->
      <!--   {@const down = diff < 0} -->
      <!--   {@const msg = down ? "menurun" : "meningkat"} -->
      <!--   <div -->
      <!--     class="pt-2 pb-4 font-bold" -->
      <!--     class:text-green-400={!down} -->
      <!--     class:text-red-400={down} -->
      <!--   > -->
      <!--     <div class="px-3 bg-white inline-block rounded-xl"> -->
      <!--       {msg} Rp. {intl.format(diff)} dari sebulan lalu -->
      <!--     </div> -->
      <!--   </div> -->
      <!-- {/if} -->
      <br>
      {#await promise.promise}
        loading...
      {:then}
        <Chart {summary}/>
      {/await}
    </section>
  </section>

  <section class="vault">
    <section class="px-4 pb-4">
      <div class="pb-4 text-lg text-center font-bold">Transaksi Terkini</div>
      <section class="grid gap-2">
        {#await promise.promise}
          <div>loading...</div>
        {:then}
          {@render records()}
        {:catch}
          <div>terjadi kesalahan</div>
        {/await}
      </section>

      <a href="/home/all" class="btn btn-primary btn-decor block w-full my-4 py-3 text-center">
        Tampilkan Semua Transaksi
      </a>
      <div class="h-32"></div>

    </section>
  </section>
</section>

{#if url.searchParams.has("create")}
  <Create onSubmit={tr => promise.add(tr)}/>
{:else if url.searchParams.has("menu")}
  <Menu/>
{/if}

{#if url.pathname == "/home/all"}
  <section class="relative isolate z-vault">
    <All/>
  </section>
{:else if url.pathname == "/home/monthly"}
  <section class="relative isolate z-vault">
    <Monthly/>
  </section>
{/if}

{#snippet records()}
  {@const trs = promise
    .data
    .filter(e => summary.find(f => f.id == ('' + e.time.getMonthId() + e.time.getFullYear())))
  }

  {#each trs as { id, name, value, category, kind, time }, i (id)}
    {@const down = kind == "output"}

    <!-- Date Group -->
    {#if i == 0 || time.getMonth() != trs[i - 1].time.getMonth()}
      {@const mon = time.getMonthId()}
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
          {time.format()}
        </div>
      </div>
    </div>
  {:else}
    <button onclick={transaction.mock} class="btn btn-primary btn-decor">
      Mock Data
    </button>
  {/each}
{/snippet}


