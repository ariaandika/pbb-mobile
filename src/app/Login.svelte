<script lang="ts">
  import session from "../lib/session.svelte";
  import { paralax, vaultPage } from "../lib/animation";

  let promise = $state(Promise.resolve(void 0 as any));

  function form(node: HTMLFormElement) {
    node.addEventListener("submit", e => {
      e.preventDefault();
      const data = new FormData(node);
      promise = session.login(
        data.get("name")! as string,
        data.get("password")! as string
      );
    })
  }

</script>

<section
  id="login-paralax"
  class="fixed-fullscreen grid place-items-center variant-primary"
>
  <div class="text-6xl font-bold">Kas Sosial</div>
</section>

<section
  id="login-vault"
  class="fullscreen bg-transparent overflow-x-hidden overflow-y-auto"
  transition:vaultPage
  use:paralax={{ scrollScale: -(1/2), id: "login-paralax" }}
>

  <section class="relative h-screen bg-transparent"></section>

  <section class="vault">
    <form use:form method="POST" class="relative px-4 grid gap-4">
      <div class="mb-8 text-center text-4xl font-bold">Login untuk melanjutkan</div>

      <input name="name" class="input" placeholder="nama">
      <input class="input" placeholder="password" type="password">
      <button class="btn btn-primary btn-decor">Login</button>

      {#await promise}
        <div class="text-subtext">loading...</div>
      {:catch error}
        {#if error}
          <div class="text-red-600">
            {"message" in error ? error.message : error}
          </div>
        {/if}
      {/await}

    </form>
  </section>

</section>

