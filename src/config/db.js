import { Pool } from "pg";

import pg from "pg";
const { types } = pg;
// OID 1082 = DATE
types.setTypeParser(1082, (value) => value);
//to fix 2026-06-25T18:30:00.000Z to 2026-06-25

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
      user_id UUID NOT NULL,
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
  await dbPool.query(`
      CREATE TABLE IF NOT EXISTS ledger_groups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL,
      group_name VARCHAR(100) NOT NULL,
      nature VARCHAR(30) NOT NULL CHECK (
        nature IN (
            'Assets',
            'Liabilities',
            'Income',
            'Expenses'
        )
      ),
      parent_group_id UUID NULL,
      is_system BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_parent_group
        FOREIGN KEY (parent_group_id)
        REFERENCES ledger_groups(id)
        ON DELETE SET NULL,

      CONSTRAINT unique_group_per_company
        UNIQUE(company_id, group_name)
      )
    `);
  console.log("Database tables initialized successfully");
}
