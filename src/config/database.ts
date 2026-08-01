import { createPool, Pool, PoolOptions } from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

const poolConfig: PoolOptions = {
  host: process.env.DB_HOST || "",
  port: Number(process.env.DB_PORT) || 3306,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const pool: Pool = createPool(poolConfig);
