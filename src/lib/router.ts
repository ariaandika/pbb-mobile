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

  window.addEventListener("popstate", ({ state }) => {
    const popStateEvent = new CustomEvent(POPSTATE, {
      detail: {
        target: new URL(location.href)
      }
    })

    if (!window.dispatchEvent(popStateEvent)) {
      return
    }

    if (state != null) {
      router.href = location.href
    }
  })

  window.addEventListener("click", e => {
    let target = e.target as HTMLElement;
    let anchor = target.closest("a");

    if (anchor) {
      e.preventDefault();
      (anchor.dataset.replace != undefined ? replace : goto)
      (anchor.href);
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
  window.dispatchEvent(new CustomEvent(GOTO, { detail: { url } }))
}

/** same as goto but does not create a navigation stack */
export function replace(target: string | URL) {
  const url = new URL(target,location.origin)
  if (url.href == location.href) {
    return;
  }
  history.replaceState(null, "", url)
  window.dispatchEvent(new CustomEvent(REPLACE, { detail: { url } }))
}

export function context(): URL {
  return getContext(CTX)
}

type PopStateEvent = WindowEventMap["router:popstate"];

export function onPopState(fn: (e: PopStateEvent) => any) {
  window.addEventListener(POPSTATE, fn);
  return window.removeEventListener(POPSTATE, fn);
}

export default {
  CTX, GOTO, onPopState,
  setup, goto, replace, context,
}

