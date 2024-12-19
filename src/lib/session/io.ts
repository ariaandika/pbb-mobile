import type { Session } from "../session.svelte";
export type { Session } from "../session.svelte";
import browser from "./browser";

export interface Io {
  loadSession(): Promise<Session>;
  saveSession(session: Session): Promise<void>;
  removeSession(): Promise<void>;
  login(name: string, passwd: string): Promise<Session>;
}

export default window.envfrom<Io>("Session", { browser })
