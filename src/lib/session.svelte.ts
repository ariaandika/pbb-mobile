import io from "./session/io"
import { getContext } from "svelte"

declare global {
  interface WindowEventMap {
    "session:login": CustomEvent<{ session: Session }>
  }
}

export const CTX = Symbol("session");
export const LOGIN = "session:login";
export const LOGOUT = "session:logout";

export type Role = "bendahara" | "anggota" | "unauthorized";

export interface Session {
  name: string
  phone: string
  role: Role
}

export class SessionContext {
  value: Session = $state(void 0 as any);

  constructor(session: Session) {
    this.value = session;
  }

  unauthorized() {
    this.value = SessionContext.unauthorized();
  }

  static unauthorized(): Session {
    return { name: "", phone: "", role: "unauthorized" }
  }
}

export async function setup(context: Map<any,any>) {
  const session = new SessionContext(await io.loadSession());

  window.addEventListener(LOGIN, ({ detail }) => {
    session.value = detail.session;
  })

  window.addEventListener(LOGOUT, () => {
    session.unauthorized()
  })

  context.set(CTX, session)
}

export function context(): SessionContext {
  return getContext(CTX)
}

export async function login(name: string, passwd: string) {
  const session = await io.login(name, passwd)
  await io.saveSession(session)
  window.dispatch(LOGIN, { session })
}

export async function logout() {
  await io.removeSession();
  window.dispatch(LOGOUT)
}

export default {
  CTX, LOGIN, LOGOUT,
  setup, context, login, logout,
}

