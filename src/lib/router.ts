import { SvelteURL } from "svelte/reactivity";
import { getContext } from "svelte";

declare global {
  interface WindowEventMap {
    "router:popstate": CustomEvent<{ target: URL }>
    "router:goto": CustomEvent<{ url: URL }>
    "router:replace": CustomEvent<{ url: URL }>
  }
}

export const CTX = Symbol("router");
export const GOTO = "router:goto";
export const REPLACE = "router:replace";
export const POPSTATE = "router:popstate";

export function setup(context: Map<any,any>) {
  const router = new SvelteURL(location.href);

  window.addEventListener(GOTO, ({ detail }) => {
    router.href = detail.url.href;
  })

  window.addEventListener(REPLACE, ({ detail }) => {
    router.href = detail.url.href;
  })

  window.addEventListener("popstate", () => {
    if (!window.dispatch(POPSTATE)) {
      return
    }
    router.href = location.href
  })

  window.addEventListener("click", e => {
    let target = e.target as HTMLElement;
    let anchor = target.closest("a");

    if (anchor) {
      e.preventDefault();
      goto(anchor.href)
    }

    if (target.closest('[data-back]')) {
      e.preventDefault();
      history.back()
    }

  })

  context.set(CTX, router)
}

/** if target is equal to current url, nothing is performed */
export function goto(target: string | URL) {
  const url = new URL(target,location.origin)
  if (url.href == location.href) {
    return;
  }
  history.pushState(null, "", url)
  window.dispatch(GOTO, { url })
}

/** same as goto but does not create a navigation stack */
export function replace(target: string | URL) {
  const url = new URL(target,location.origin)
  if (url.href == location.href) {
    return;
  }
  history.replaceState(null, "", url)
  window.dispatch(REPLACE, { url })
}

export function context(): URL {
  return getContext(CTX)
}

type OnPopStateProps = Parameters<typeof window.addEventListener<"router:popstate">>;

export function onPopState(fn: OnPopStateProps[1], opt?: OnPopStateProps[2]) {
  window.addEventListener(POPSTATE, fn, opt);
  return window.removeEventListener(POPSTATE, fn);
}

export default {
  CTX, GOTO, onPopState,
  setup, goto, context,
}

