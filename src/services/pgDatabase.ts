import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Needed for Supabase connections
});

// Test the database connection on initialization
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err);
  } else {
    console.log('PostgreSQL database connected:', res.rows[0].now);
  }
});

/**
 * Execute a SQL query using the connection pool
 * @param text - The SQL query text
 * @param params - The query parameters
 * @returns Promise with the query result
 */
export const query = async (text: string, params?: (string | number | boolean | null | Date | (string | number | boolean | null)[])[]) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

/**
 * Get a client from the pool for transactions
 * @returns Promise with the client and a done callback
 */
export const getClient = async () => {
  const client = await pool.connect();
  const originalRelease = client.release;

  // Override the release method to log when the client is returned to the pool
  client.release = () => {
    client.release = originalRelease;
    return client.release();
  };

  return client;
};

/**
 * Execute a transaction with a client
 * @param callback - Function that receives a client and executes queries
 * @returns Promise with the transaction result
 */
export const transaction = async <T>(callback: (client: PoolClient) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Export the pool in case direct access is needed
export default pool;
