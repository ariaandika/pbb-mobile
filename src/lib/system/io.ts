import browser from "./browser";

export interface Io {
  exit(): void;
}

export default window.envfrom("System", { browser })

