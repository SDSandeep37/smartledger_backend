import { dbPool } from "../config/db.js";
import DEFAULT_LEDGERS from "../constants/defaultLedgers.js";

class LedgersModel {
  static async create(ledgerData) {
    try {
      const query = `INSERT INTO ledgers (
      company_id,
      group_id,
      ledger_name,
      alias_name,
      opening_balance,
      balance_type,
      gst_number,
      pan_number,
      phone,
      email,
      address,
      notes
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      RETURNING *`;

      const values = [
        ledgerData.company_id,
        ledgerData.group_id,
        ledgerData.ledger_name,
        ledgerData.alias_name,
        ledgerData.opening_balance,
        ledgerData.balance_type,
        ledgerData.gst_number,
        ledgerData.pan_number,
        ledgerData.phone,
        ledgerData.email,
        ledgerData.address,
        ledgerData.notes,
      ];
      const { rows } = await dbPool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error creating ledger:", error);
      throw error;
    }
  }

  //find all ledgers for a specific company
  static async findAllByCompany(companyId) {
    try {
      const query = `SELECT ledgers.*, ledger_groups.group_name FROM ledgers
      JOIN ledger_groups ON ledgers.group_id = ledger_groups.id
      WHERE ledgers.company_id = $1`;
      const { rows } = await dbPool.query(query, [companyId]);
      return rows;
    } catch (error) {
      console.error("Error finding ledgers:", error);
      throw error;
    }
  }
  //find ledger by id
  static async findById(ledgerId) {
    try {
      const query = `SELECT ledgers.*, ledger_groups.group_name FROM ledgers
      JOIN ledger_groups ON ledgers.group_id = ledger_groups.id
      WHERE ledgers.id = $1`;
      const { rows } = await dbPool.query(query, [ledgerId]);
      return rows[0];
    } catch (error) {
      console.error("Error finding ledger by ID:", error);
      throw error;
    }
  }

  //update ledger by id
  static async updateById(ledgerId, ledgerData) {
    try {
      const query = `UPDATE ledgers SET
      group_id = $1,
      ledger_name = $2,
      alias_name = $3,
      opening_balance = $4,
      balance_type = $5,
      gst_number = $6,
      pan_number = $7,
      phone = $8,
      email = $9,
      address = $10,
      notes = $11
      WHERE id = $12
      RETURNING *`;

      const values = [
        ledgerData.group_id,
        ledgerData.ledger_name,
        ledgerData.alias_name,
        ledgerData.opening_balance,
        ledgerData.balance_type,
        ledgerData.gst_number,
        ledgerData.pan_number,
        ledgerData.phone,
        ledgerData.email,
        ledgerData.address,
        ledgerData.notes,
        ledgerId,
      ];
      const { rows } = await dbPool.query(query, values);
      return rows[0];
    } catch (error) {
      console.error("Error updating ledger:", error);
      throw error;
    }
  }

  //delete ledger by id
  static async deleteById(ledgerId) {
    try {
      const query = `DELETE FROM ledgers WHERE id = $1 RETURNING *`;
      const { rows } = await dbPool.query(query, [ledgerId]);
      return rows[0];
    } catch (error) {
      console.error("Error deleting ledger:", error);
      throw error;
    }
  }

  //check if ledger name already exists for a company
  static async ledgerExist(companyId, ledgerName) {
    try {
      const query = `SELECT * FROM ledgers WHERE company_id = $1 AND LOWER(ledger_name) = LOWER($2)`;
      const { rows } = await dbPool.query(query, [companyId, ledgerName]);
      return rows.length > 0;
    } catch (error) {
      console.error("Error checking ledger name existence:", error);
      throw error;
    }
  }

  //seed default ledgers for a company this will be called when a new company is created
  static async seedDefaultLedgers(connection, companyId) {
    try {
      // fetch the all ledger groups for the company
      const groupQuery = `SELECT id, group_name FROM ledger_groups WHERE company_id = $1`;
      const { rows: groupRows } = await connection.query(groupQuery, [
        companyId,
      ]);
      const groupMap = {};
      groupRows.forEach((group) => {
        groupMap[group.group_name] = group.id;
      });
      console.log("Group Map:", groupMap); // Log the group map to verify its contents
      //insert default ledgers for the company
      for (const ledger of DEFAULT_LEDGERS) {
        const groupId = groupMap[ledger.group_name];
        if (!groupId) {
          // console.warn(`Group "${ledger.group_name}" not found for company ${companyId}. Skipping ledger "${ledger.ledger_name}".`);
          // continue;
          throw new Error(
            `Group "${ledger.group_name}" not found for company ${companyId}. Cannot seed ledger "${ledger.ledger_name}".`,
          );
        }
        const insertQuery = `INSERT INTO ledgers (
          company_id,
          group_id,
          ledger_name,
          alias_name,
          opening_balance,
          balance_type,
          is_system
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        const values = [
          companyId,
          groupId,
          ledger.ledger_name,
          ledger.alias_name,
          ledger.opening_balance,
          ledger.balance_type,
          true,
        ];
        await connection.query(insertQuery, values);
      }
    } catch (error) {
      console.error("Error seeding default ledgers:", error);
      throw error;
    }
  }

  static async getPurchaseLedger(connection, companyId) {
    const { rows } = await connection.query(
      `
    SELECT *
    FROM ledgers
    WHERE company_id = $1
      AND ledger_name = 'Purchases'
    LIMIT 1;
    `,
      [companyId],
    );

    return rows[0];
  }

  static async getSalesLedger(connection, companyId) {
    const { rows } = await connection.query(
      `
    SELECT *
    FROM ledgers
    WHERE company_id = $1
      AND ledger_name = 'Sales'
    LIMIT 1;
    `,
      [companyId],
    );

    return rows[0];
  }
  // search ledger by name
  static async searchLedger(companyId, searchTerm) {
    try {
      const query = `
       SELECT
          id,
          ledger_name
      FROM ledgers
      WHERE company_id = $1
      AND ledger_name ILIKE $2
      LIMIT 10;
    `;
      const values = [companyId, `%${searchTerm}%`];
      const result = await dbPool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error searching leagers:", error);
      throw error;
    }
  }
  /* SELECT
    id,
    ledger_name
FROM ledgers
WHERE company_id = $1
AND ledger_name ILIKE $2
AND group_id IN (
    SELECT id
    FROM ledger_groups
    WHERE group_name IN ('Sundry Creditors','Sundry Debtors')
)
LIMIT 10; */
}

export default LedgersModel;
