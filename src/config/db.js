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
  await dbPool.query(`
      CREATE TABLE IF NOT EXISTS ledgers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL,
      group_id UUID NOT NULL,
      ledger_name VARCHAR(150) NOT NULL,
      alias_name VARCHAR(150),
      opening_balance NUMERIC(15,2) DEFAULT 0,
      balance_type VARCHAR(2)
        CHECK(balance_type IN ('Dr','Cr')),
      gst_number VARCHAR(20),
      pan_number VARCHAR(20),
      phone VARCHAR(20),
      email VARCHAR(120),
      address TEXT,
      is_system BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT TRUE,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_company
        FOREIGN KEY(company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_group
        FOREIGN KEY(group_id)
        REFERENCES ledger_groups(id),

      CONSTRAINT unique_ledger_name
        UNIQUE(company_id, ledger_name)
      )
    `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS units (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID NOT NULL,
        unit_name VARCHAR(100) NOT NULL,
        unit_symbol VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY(company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE
      )  
    `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS stock_groups (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL,
      group_name VARCHAR(100) NOT NULL,
      parent_group_id UUID NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

      FOREIGN KEY(parent_group_id)
        REFERENCES stock_groups(id)
        ON DELETE SET NULL,
      CONSTRAINT unique_stock_group
      UNIQUE(company_id, group_name)
        
      )  
    `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS stock_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL,
      stock_group_id UUID NOT NULL,
      unit_id UUID NOT NULL,
      item_name VARCHAR(150) NOT NULL,
      sku VARCHAR(100),
      purchase_price NUMERIC(15,2) DEFAULT 0,
      selling_price NUMERIC(15,2) DEFAULT 0,
      opening_stock NUMERIC(15,2) DEFAULT 0,
      minimum_stock NUMERIC(15,2) DEFAULT 0,
      current_stock NUMERIC(15,2) DEFAULT 0,
      gst_percent NUMERIC(5,2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

      FOREIGN KEY(stock_group_id)
          REFERENCES stock_groups(id),

      FOREIGN KEY(unit_id)
          REFERENCES units(id),
      CONSTRAINT unique_sku_per_company
      UNIQUE(company_id, sku)
        
      )  
    `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS vouchers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL,
      voucher_no VARCHAR(30) NOT NULL,

      voucher_type VARCHAR(20) NOT NULL
        CHECK (voucher_type IN ('Purchase', 'Sales')),

      financial_year VARCHAR(9) NOT NULL,

      voucher_date DATE NOT NULL,

      party_ledger_id UUID NOT NULL,

      narration TEXT,

      total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,

      status VARCHAR(15) NOT NULL DEFAULT 'Posted'
        CHECK (status IN ('Draft', 'Posted', 'Cancelled')),

      created_by UUID NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

      CONSTRAINT fk_party_ledger
        FOREIGN KEY (party_ledger_id)
        REFERENCES ledgers(id),

      CONSTRAINT fk_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id),

      CONSTRAINT uq_voucher_number
        UNIQUE (
            company_id,
            voucher_type,
            financial_year,
            voucher_no
        )
       
      )  
    `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS voucher_sequences (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID NOT NULL,
      voucher_type VARCHAR(20) NOT NULL
        CHECK (voucher_type IN ('Purchase', 'Sales')),
      financial_year VARCHAR(9) NOT NULL,
      last_number INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE,

      CONSTRAINT unique_sequence
        UNIQUE(company_id, voucher_type, financial_year)
      )  
    `);
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS voucher_items  (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      voucher_id UUID NOT NULL,
      stock_item_id  UUID NOT NULL,
       quantity NUMERIC(15,2) NOT NULL,

      rate NUMERIC(15,2) NOT NULL,

      discount_percent NUMERIC(5,2) DEFAULT 0,

      discount_amount NUMERIC(15,2) DEFAULT 0,

      taxable_amount NUMERIC(15,2) DEFAULT 0,

      gst_percent NUMERIC(5,2) DEFAULT 0,

      gst_amount NUMERIC(15,2) DEFAULT 0,

      line_total NUMERIC(15,2) DEFAULT 0,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(voucher_id)
        REFERENCES vouchers(id)
        ON DELETE CASCADE,

      FOREIGN KEY(stock_item_id)
        REFERENCES stock_items(id)
      )  
    `);
  console.log("Database tables initialized successfully");
}
