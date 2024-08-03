// db.js
import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sms-feedback',
  password: 'zombi119',
  port: 5432,
});

export default pool;
