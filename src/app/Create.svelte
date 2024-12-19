<script lang="ts">
  import type { TransactionCreate } from "../lib/transaction.svelte";
  import icons from "../lib/icons";
  import { vault } from "../lib/animation";
  import { fade } from "svelte/transition";

  let { onSubmit }: { onSubmit(tr: any): Promise<void> } = $props();

  let promise = $state(Promise.resolve());

  let form = (node: HTMLFormElement) => {
    node.addEventListener("submit", e => {
      e.preventDefault();

      promise = (async () => {
        const data: TransactionCreate = Object.fromEntries(new FormData(node)) as any;
        data.value = parseInt(data.value as any)
        await onSubmit(data);
        history.back();
      })();
    })
  }

</script>

<section class="fixed-fullscreen bg-black/20 z-vault" transition:fade></section>

<section
  id="create-vault"
  class="fixed-fullscreen bg-transparent overflow-x-hidden overflow-y-auto z-vault"
  transition:vault
>
  <section data-back class="relative h-screen bg-transparent">&ThickSpace;</section>

  <!-- NOTE: method="post" and method="POST" is world wide different -->
  <form use:form method="POST" class="vault flex flex-col gap-4 px-4">
    <div class="absolute w-full flex items-center text-2xl text-subtext">
      <button data-back type="button" class="">{@html icons.chev_left}</button>
      &ThickSpace;
    </div>

    <h2 class="text-2xl text-center font-bold">Tambah Transaksi</h2>

    <div class="grid grid-cols-2 gap-2">
      {@render select("input")}
      {@render select("output")}
    </div>

    <input name="name" placeholder="nama" class="input" required>
    <input name="value" placeholder="jumlah" type="number" class="input" required>
    <input name="category" placeholder="kategori" class="input" required>
    <button class="btn btn-primary btn-decor">Submit</button>
    {#await promise}
      <div class="text-subtext">loading...</div>
    {:catch err}
      <div class="text-red-600">{err.message}</div>
    {/await}
  </form>
</section>


{#snippet select(kind: "input" | "output")}
  <label
    class="has-[:checked]:outline-2 flex gap-2 px-4 py-3 outline-primary rounded-md bg-white cursor-pointer"
  >
    <input
      checked={kind == "input"}
      type="radio"
      name="kind"
      value={kind}
      class="hidden peer"
    >

    <div class="w-6 grid place-items-center aspect-square bg-dim rounded-full peer-[:checked]:bg-primary">
      <div class="w-3 aspect-square bg-white rounded-full"></div>
    </div>

    <div class="font-bold">{kind == "input" ? "Pemasukan" : "Pengeluaran"}</div>
  </label>
{/snippet}


