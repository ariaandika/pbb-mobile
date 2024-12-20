import { getContext, hasContext, setContext } from "svelte";
import io from "./transaction/io";
import date from "./date";

declare global {
  interface WindowEventMap {
    "tr:add": CustomEvent<{ tr: Transaction }>
  }
}

export const CTX = Symbol("transaction");
export const ADD = "tr:add";

// NOTE: do not use io inside event handler, because error cannot be propagated

// NOTE: ther is no such api to determine the state of a Promise, user must track the state themself

// in the simplest form of Promise, there are 3 possible state which changes one way in order
//
// in the most complex form of Promise, there are 3 separate state that is required to keep track of:
//
// - pending: boolean, is the data already fetched at least once ?
// - loading: boolean, is currently fetching new data ?
// - error: Error, is there an Error ?

// in the simplest form of async UI, we only have 1 component that handle all state
//
// in the most complex form of async UI, we have 3 component that represent each state

export interface Transaction extends TransactionCreate {
  id: number
  time: Date
}

export interface TransactionCreate {
  name: string
  value: number
  category: string
  kind: "input" | "output"
}

export class TransactionContext {
  data: Transaction[] = $state.raw([]);
}

export class TransactionPromise {
  context: TransactionContext;
  promise: Promise<void> = $state(void 0 as any);

  get data() {
    return this.context.data;
  }

  constructor() {
    if (!hasContext(CTX)) {
      setup()
    }
    this.context = getContext(CTX);
    this.refresh()
  }

  refresh() {
    this.promise = this.load()
  }

  async load() {
    const data = await io.list();
    this.context.data = data;
  }

  async add(data: TransactionCreate) {
    await io.add(data)
    this.refresh();
  }
}

/** can be called lazily */
function setup() {
  const tx = new TransactionContext();
  setContext(CTX, tx);
}

export function promise() {
  return new TransactionPromise()
}

export async function mock() {
  await io.mock()
}


export type Summary = ReturnType<typeof recentSummary2>;

export function recentSummary2(data: Transaction[]) {
  let current = 0
  const results = [];

  for (const tr of data.toReversed()) {
    if (results.length == 0) {
      results.push({
        id: '' + date.getMonthId(tr.time) + tr.time.getFullYear(),
        label: date.getMonthId(tr.time),
        input: 0,
        output: 0,
        total: 0,
      })
    }

    if (date.getMonthId(tr.time) !== results.at(-1)!.label) {
      results.at(-1)!.total = current;
      results.push({
        id: '' + date.getMonthId(tr.time) + tr.time.getFullYear(),
        label: date.getMonthId(tr.time),
        input: 0,
        output: 0,
        total: 0,
      })
    }

    const isInput = tr.kind == "input";

    current += (isInput ? 1 : -1) * tr.value;

    if (isInput) {
      results.at(-1)!.input += tr.value;
    } else {
      results.at(-1)!.output += tr.value;
    }
  }

  results.at(-1)!.total = current;

  return results;
}

/** monthly data generator */
function* monthly(data: Transaction[]) {
  let i = 0;
  let monthly = [] as Transaction[];

  while (i < data.length) {
    const current = data[i];
  }

  yield monthly;
}

export default {
  promise, mock, recentSummary2
}

