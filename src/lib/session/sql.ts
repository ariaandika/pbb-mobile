import { unauthorize, type Io, type Session, type User } from "./io"
import bcrypt from "../bcrypt";
import db from "../db";

export default {
  async login(name, passwd) {
    const [user] = await db.select<User[]>(
      "select * from users where name = $1",
      [name]
    );

    if (!user) {
      throw new Error("nama atau password salah")
    }

    if (!(await bcrypt.verify(passwd, user.password!))) {
      throw new Error("nama atau password salah")
    }

    return user;
  },

  async saveSession(session) {
    await db.execute(
      "insert into sessions (id,name,role) values ($1,$2,$3)",
      [session.id,session.name,session.role]
    )
  },

  async loadSession() {
    const [session] = await db.select<Session[]>("select * from sessions");
    if (session) {
      return session
    } else {
      return unauthorize()
    }
  },

  async removeSession() {
    await db.execute("delete from sessions")
  },

} satisfies Io;

