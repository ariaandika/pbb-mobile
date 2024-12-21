import type { Io, Transaction } from "./io"
import db from "../db";

export default {
  async add(tr) {
    await db.execute(
      "insert into transactions (name,kind,value,category) values ($1,$2,$3,$4)",
      [tr.name, tr.kind, tr.value, tr.category]
    );
  },

  async get(id) {
    const [tr] = await db.select<Transaction[]>(
      "select * from transactions where id = $1",
      [id]
    );

    return tr
  },

  async list() {
    return await db.select("select * from transactions")
  },

  async mock() {
    throw new Error('transactions mock is manual');
  },

  async clear() {
    await db.execute("delete from transactions");
  },

} satisfies Io;

