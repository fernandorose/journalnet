import { Pool } from "pg";
import { EnvInitCfg } from "./env.cfg";

export class PostgresClient {
  private static pool: Pool;

  static getPool(): Pool {
    if (!this.pool) {
      this.pool = new Pool({
        user: EnvInitCfg.instance.env.PG_USER,
        host: EnvInitCfg.instance.env.PG_HOST,
        database: EnvInitCfg.instance.env.PG_DATABASE,
        password: EnvInitCfg.instance.env.PG_PASSWORD,
        port: Number(EnvInitCfg.instance.env.PG_PORT) || 5432,
      });

      this.pool.on("error", (err) => {
        console.error("Unexpected PG error", err);
        process.exit(1);
      });
    }

    return this.pool;
  }
}
