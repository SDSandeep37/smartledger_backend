import { dbPool } from "../config/db.js";

class VoucherEntryModel {
  // Create Ledger Entry
  static async create(connection, entryDetails) {
    const { voucher_id, ledger_id, debit, credit } = entryDetails;

    try {
      const query = `
        INSERT INTO voucher_entries (
          voucher_id,
          ledger_id,
          debit,
          credit
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *;
      `;

      const values = [voucher_id, ledger_id, debit || 0, credit || 0];

      const { rows } = await connection.query(query, values);

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get Entries Of Voucher
  static async getByVoucher(voucherId) {
    try {
      const query = `
        SELECT
          ve.*,
          l.ledger_name
        FROM voucher_entries ve
        JOIN ledgers l
          ON l.id = ve.ledger_id
        WHERE ve.voucher_id = $1
        ORDER BY ve.id;
      `;

      const { rows } = await dbPool.query(query, [voucherId]);

      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete Entries
  static async deleteByVoucher(connection, voucherId) {
    try {
      await connection.query(
        `
        DELETE FROM voucher_entries
        WHERE voucher_id = $1;
        `,
        [voucherId],
      );

      return true;
    } catch (error) {
      throw error;
    }
  }
}

export default VoucherEntryModel;
