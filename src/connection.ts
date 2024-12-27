import dotenv from 'dotenv';
dotenv.config();

import pg from 'pg';
const { Pool } = pg;

const pool = new Pool ({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: 'localhost',
  database: process.env.DB_NAME,
  port: 5432,
})


const connectDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to the PostgreSQL database');
    } catch (err) {
        console.log('Database connection error:', err);
        process.exit(1);
        
    }
};


export { pool, connectDb };