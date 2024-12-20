<script lang="ts">
  import Home from "./Home.svelte";
  import Login from "./Login.svelte";
  import router from "../lib/router";
  import session from "../lib/session.svelte";
  // import system from "../lib/system";

  let url = router.context();
  let sessionData = session.context();
  let user = $derived(sessionData.value);

  // router.onPopState(e => {
  //   if (e.detail.target.pathname.split("/").length <= 2) {
  //     e.preventDefault()
  //     system.exit()
  //   }
  // });

  $inspect("Router",url);
  $inspect("User",user);

  $effect(() => {
    let path = url.pathname;

    if (path == "/") {
      path = "/login"
    }

    if (path == "/login" && user.role != "unauthorized") {
      path = "/home"
    }

    if (path.startsWith("/home") && user.role == "unauthorized") {
      path = "/login"
    }

    router.goto(path);
  })
</script>

{#if url.pathname.startsWith("/home")}
  <Home/>
{:else if url.pathname == "/login"}
  <Login/>
{:else if url.pathname == "/exit"}
  Program Exited
{:else}
  Loading...
{/if}
