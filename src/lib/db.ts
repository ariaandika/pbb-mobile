import Database from '@tauri-apps/plugin-sql';

let db = void 0 as any as Database;

export async function setup() {
  db = await Database.load('sqlite:database.db');
}

export default db;
