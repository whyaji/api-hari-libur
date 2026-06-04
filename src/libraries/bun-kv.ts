import { Database } from "bun:sqlite";

export class BunKv {
  private db: Database;

  constructor(filename = "kv.db") {
    this.db = new Database(filename);
    this.db
      .query(
        `
      CREATE TABLE IF NOT EXISTS kv (
        key TEXT PRIMARY KEY,
        value TEXT,
        expires_at INTEGER
      )
    `,
      )
      .run();
  }

  async get<T>(keyArray: string[]): Promise<{ value: T | null }> {
    const key = keyArray.join(":");
    const row = this.db
      .query("SELECT value, expires_at FROM kv WHERE key = ?")
      .get(key) as {
      value: string;
      expires_at: number | null;
    } | null;

    if (!row) {
      return { value: null };
    }

    if (row.expires_at && Date.now() > row.expires_at) {
      this.db.query("DELETE FROM kv WHERE key = ?").run(key);
      return { value: null };
    }

    return { value: JSON.parse(row.value) as T };
  }

  async set(keyArray: string[], value: any, options?: { expireIn?: number }) {
    const key = keyArray.join(":");
    const expiresAt = options?.expireIn ? Date.now() + options.expireIn : null;
    this.db
      .query(
        "INSERT OR REPLACE INTO kv (key, value, expires_at) VALUES (?, ?, ?)",
      )
      .run(key, JSON.stringify(value), expiresAt);
    return { ok: true };
  }

  close() {
    this.db.close();
  }
}
