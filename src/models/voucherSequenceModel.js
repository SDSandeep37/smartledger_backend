import { dbPool } from "../config/db.js";

class VoucherSequenceModel {
  /**
   * Atomically generates the next sequence number for a voucher.
   * Must be called inside a database transaction.
   */
  static async getNextNumber(
    connection,
    companyId,
    voucherType,
    financialYear,
  ) {
    try {
      const query = `
        INSERT INTO voucher_sequences (
          company_id,
          voucher_type,
          financial_year,
          last_number
        )
        VALUES ($1, $2, $3, 1)

        ON CONFLICT (company_id, voucher_type, financial_year)
        DO UPDATE
        SET
          last_number = voucher_sequences.last_number + 1,
          updated_at = CURRENT_TIMESTAMP

        RETURNING last_number;
      `;

      const values = [companyId, voucherType, financialYear];

      const { rows } = await connection.query(query, values);

      return rows[0].last_number;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Returns the current sequence without incrementing it.
   * Useful for reports or debugging.
   */
  static async getCurrentNumber(companyId, voucherType, financialYear) {
    try {
      const query = `
        SELECT last_number
        FROM voucher_sequences
        WHERE
          company_id = $1
          AND voucher_type = $2
          AND financial_year = $3;
      `;

      const { rows } = await dbPool.query(query, [
        companyId,
        voucherType,
        financialYear,
      ]);

      return rows.length ? rows[0].last_number : 0;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset sequence if required
   */
  // static async resetSequence(
  //   companyId,
  //   voucherType,
  //   financialYear,
  // ) {
  //   try {
  //     const query = `
  //       UPDATE voucher_sequences
  //       SET
  //         last_number = 0,
  //         updated_at = CURRENT_TIMESTAMP
  //       WHERE
  //         company_id = $1
  //         AND voucher_type = $2
  //         AND financial_year = $3
  //       RETURNING *;
  //     `;

  //     const { rows } = await dbPool.query(query, [
  //       companyId,
  //       voucherType,
  //       financialYear,
  //     ]);

  //     return rows[0];
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default VoucherSequenceModel;
