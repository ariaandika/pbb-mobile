import type { Transaction, TransactionCreate } from "../transaction.svelte"
export type { Transaction, TransactionCreate } from "../transaction.svelte"
import browser from "./browser";

export interface Io {
  get(id: number): Promise<Transaction | undefined>;
  list(): Promise<Transaction[]>;
  add(tr: TransactionCreate): Promise<void>;
  mock(): Promise<void>
}

export default window.envfrom<Io>("Session", { browser })
