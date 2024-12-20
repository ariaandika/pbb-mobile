import type { Io, Transaction } from "./io"

const KEY = "transaction";

export default {
  async get(id) {
    const data = await this.list();
    return data.find(e => e.id == id);
  },

  async list() {
    const localSession = localStorage.getItem(KEY);
    if (!localSession) {
      return []
    }
    try {
      const data = JSON.parse(localSession) as Transaction[];
      data.forEach(e => {
        e.time = new Date(e.time);
      })
      return data;
    } catch (err) {
      console.error(err)
      return []
    }
  },

  async add(tr) {
    await new Promise(res => setTimeout(res,400));
    const data = await this.list();
    data.sort((a,b) => a.id - b.id);
    data.push({
      id: (data.at(-1)?.id ?? -1) + 1,
      ...tr,
      time: new Date(),
    });
    data.reverse();
    localStorage.setItem(KEY, JSON.stringify(data))
  },

  async mock() {
    function date(i: number) {
      const now = new Date();
      now.setFullYear(now.getFullYear() - 1)
      now.setDate((now.getDate() + i*(now.getMonth() - 1)))
      return now
    }

    const data = Array(32).fill(0).map((_,_i) => {
      const i = _i + 1;
      return {
        id: i,
        name: "Bayar Bensin",
        kind: i % 4 == 0 ? "output" : "input",
        category: "bensin",
        value: ((7 * i) % 55) * 1000,
        time: date(i),
      } satisfies Transaction
    }).toReversed();

    data.push({
      id: 0,
      name: "Masukan Awal",
      kind: "input",
      category: "kas awal",
      value: 500000,
      time: date(0),
    });

    localStorage.setItem(KEY, JSON.stringify(data));
  },

  async clear() {
    localStorage.removeItem(KEY)
  },

} satisfies Io
