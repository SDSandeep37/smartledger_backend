import { Pool } from "pg";

//create a connection pool to the database
export const dbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

//table creation if not exist
export async function initialiseDatabaseTable() {
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) DEFAULT 'owner',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await dbPool.query(`
      CREATE TABLE IF NOT EXISTS companies(
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id VARCHAR(255) NOT NULL,
      company_name VARCHAR(150) NOT NULL,
      address TEXT,
      city VARCHAR(80),
      state VARCHAR(80),
      country VARCHAR(80),
      pincode VARCHAR(15),
      gst_number VARCHAR(20),
      pan_number VARCHAR(20),
      financial_year_start DATE,
      financial_year_end DATE,
      phone VARCHAR(20),
      email VARCHAR(120),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id)
      REFERENCES users(id)
      ON DELETE CASCADE
      )
    `);
  console.log("Database tables initialized successfully");
}
