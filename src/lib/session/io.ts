import type { Session, User } from "../session.svelte";
export type { Session, User } from "../session.svelte";
import browser from "./browser";
import sql from "./sql";
import { platform } from "../util";

export function unauthorize(): Session {
  return {
    name: "",
    phone: "",
    role: "unauthorized"
  }
}

export interface Io {
  loadSession(): Promise<Session>;
  saveSession(session: Session): Promise<void>;
  removeSession(): Promise<void>;
  login(name: string, passwd: string): Promise<User>;
}

export default platform.from<Io>("Session", { browser, sql })
