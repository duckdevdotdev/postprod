// db.js
import { Pool } from "pg";

const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_DATABASE,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,
  connectionString: process.env.DATABASE_URL, // используйте переменную среды для безопасности
  ssl: {
    rejectUnauthorized: false, // Это может потребоваться, если Neon использует самоподписанные сертификаты
  },
});

export default pool;
