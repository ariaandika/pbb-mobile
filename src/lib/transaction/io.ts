import type { Transaction, TransactionCreate } from "../transaction.svelte"
export type { Transaction, TransactionCreate } from "../transaction.svelte"
import { platform } from "../util";
import browser from "./browser";

export interface Io {
  get(id: number): Promise<Transaction | undefined>;
  list(): Promise<Transaction[]>;
  add(tr: TransactionCreate): Promise<void>;
  mock(): Promise<void>
  clear(): Promise<void>;
}

export default platform.from<Io>("Session", { browser })
