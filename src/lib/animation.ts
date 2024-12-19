import { fly, type TransitionConfig } from "svelte/transition";

// NOTE: SVELTE WILL PUT EMPTY OBJECT ON TRANSITION PARAMETER INSTEAD OF UNDEFINED
// SO ITS TRUTHY EVEN WHEN OPTION NOT GIVEN

function mount(node: HTMLElement) {
  const mounting = node.dataset.mounted == undefined;
  if (mounting) {
    node.dataset.mounted = "";
  }
  return mounting
}

export type VaultProps = {
  /** scroll to position on mount, default to half screen */
  introScroll?: number
  /** opt passed to `ScrollToOptions` */
  // scrollBehavior?: ScrollBehavior
  /**
    * what happen when scrolled to the end
    * - `popstate` goto previous page, the default
    * - `bounceback` to `introScroll`
    */
  scrollEnd?: "popstate" | "bounceback"
  /**
    * at what pixel considered as scrolled end, default to quarter of the screen
    */
  scrollEndThreshold?: number
  /** fly animation behavior, default to transition */
  fly?: "transition" | "scroll"
  flyDirection?: "x" | "y"
}

export function vault(node: HTMLElement, opt: VaultProps = {}) {
  const introScroll = opt.introScroll ?? (window.innerHeight / 2);
  const endThreshold = opt.scrollEndThreshold ?? (window.innerHeight / 4);
  const scrollEnd = opt.scrollEnd ?? "popstate";
  const flyOpt = opt.fly ?? "transition";
  const mounting = mount(node);

  const isScrollEnd = () => node.scrollTop < endThreshold;

  if (mounting) {
    node.scrollTo({ top: introScroll, behavior: (flyOpt == "scroll" ? "smooth" : void 0) })
    node.addEventListener("scrollend", () => {
      if (!isScrollEnd()) {
        return;
      }

      if (scrollEnd == "popstate") {
        history.back()

      } else if (scrollEnd == "bounceback") {
        node.scrollTo({ top: introScroll, behavior: "smooth" })

      }
    })

  }

  if (flyOpt == "scroll") {
    return {
      css: (t) => t == 1 ? "pointer-events: auto" : "pointer-events: none",
    } satisfies TransitionConfig
  }

  const result = fly(node, {
    x: opt.flyDirection == "x" ? -window.innerWidth : void 0,
    y: opt.flyDirection == "x" ? void 0 : window.innerHeight,
    opacity: 1,
  })

  return {
    ...result,
    css: (a,b) => {
      return "pointer-events: none;" + (result.css?.(a,b))
    },
  } satisfies TransitionConfig
}

/** other variant of `vault` */
export function vaultPage(node: HTMLElement) {
  return vault(node, {
    scrollEnd: "bounceback",
    fly: "scroll",
  })
}

/** emit `fullscroll` tailwind variant on screen height scroll */
export function onFullScroll(node: HTMLElement, opt: { id?: string } = {}) {
  const container = opt.id ? document.getElementById(opt.id) : document.body;
  if (!container) {
    return console.warn("no container found, no #" + opt.id)
  }

  let open = false;

  container.addEventListener("scroll", () => requestAnimationFrame(() => {
    if (!open && container.scrollTop > window.innerHeight) {
      node.classList.add("fullscroll")
      open = true;
    } else if (container.scrollTop <= window.innerHeight) {
      node.classList.remove("fullscroll")
      open = false;
    }
  }))
}

export type ParalaxProps = {
  /** target id, default to `paralax` */
  id?: string
  /** scroll multiplier, default to 1/2 */
  scrollScale?: number
  /** nothing executed when scrolled pass screen height, default to true */
  offscreenOptimisation?: boolean
}

/** create paralax effect on scroll */
export function paralax(container: HTMLElement, opt: ParalaxProps = {}) {
  const id = (opt.id ?? "paralax");
  const target = document.querySelector<HTMLElement>('#' + id);

  if (!target) {
    return console.warn("No target for paralax found, no #" + id);
  }

  const onScroll = () => {
    const scroll = container.scrollTop;
    const value = scroll * (opt.scrollScale ?? (1/2));
    const optimize = opt.offscreenOptimisation ?? true;
    if (optimize && scroll >= window.innerHeight) {
      return
    }
    target.style.translate = "0 " + value + "px";
  }

  container.addEventListener("scroll", () => requestAnimationFrame(onScroll));
}

