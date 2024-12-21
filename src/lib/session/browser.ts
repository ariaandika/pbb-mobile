import type { Io } from "./io"
import { unauthorize } from "./io"

const KEY = "session";

export default {
  async loadSession() {
    const localSession = localStorage.getItem(KEY);
    if (!localSession) {
      return unauthorize()
    }
    try {
      return JSON.parse(atob(localSession));
    } catch (err) {
      await this.removeSession()
      return unauthorize()
    }
  },

  async saveSession(session) {
    localStorage.setItem(KEY, btoa(JSON.stringify(session)));
  },

  async removeSession() {
    localStorage.removeItem(KEY);
  },

  async login(name, passwd) {
    await new Promise(res => setTimeout(res,400))
    if (name.toLowerCase() == "john") {
      return { name: "John", phone: "089636632567", role: "bendahara" }
    }
    if (name.toLowerCase() == "robin") {
      return { name: "John", phone: "089636632567", role: "anggota" }
    }
    throw new Error("nama atau password salah")
  },

} satisfies Io
