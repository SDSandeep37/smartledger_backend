import { dbPool } from "../config/db.js";

class VoucherModel {
  // Create Voucher

  static async create(connection, voucherDetails, userId) {
    // console.log("user id from voucher model", userId);
    const {
      company_id,
      voucher_no,
      voucher_type,
      financial_year,
      voucher_date,
      party_ledger_id,
      narration,
      total_amount,
      status,
    } = voucherDetails;

    const query = `
      INSERT INTO vouchers (
        company_id,
        voucher_no,
        voucher_type,
        financial_year,
        voucher_date,
        party_ledger_id,
        narration,
        total_amount,
        status,
        created_by
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
      )
      RETURNING *;
    `;

    const values = [
      company_id,
      voucher_no,
      voucher_type,
      financial_year,
      voucher_date,
      party_ledger_id,
      narration || null,
      total_amount || 0,
      status || "Posted",
      userId,
    ];
    try {
      const { rows } = await connection.query(query, values);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update Voucher
  static async update(voucherId, voucherDetails) {
    const { voucher_date, party_ledger_id, narration, total_amount, status } =
      voucherDetails;

    const query = `
      UPDATE vouchers
      SET
        voucher_date = $1,
        party_ledger_id = $2,
        narration = $3,
        total_amount = $4,
        status = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *;
    `;

    const values = [
      voucher_date,
      party_ledger_id,
      narration,
      total_amount,
      status,
      voucherId,
    ];
    try {
      const { rows } = await dbPool.query(query, values);

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get Voucher By ID
  static async getById(voucherId) {
    const query = `
      SELECT
        vouchers.*,
        ledgers.ledger_name AS party_name,
        users.name AS created_by_name
      FROM vouchers
      JOIN ledgers
        ON ledgers.id = vouchers.party_ledger_id
      JOIN users
        ON users.id = vouchers.created_by
      WHERE vouchers.id = $1;
    `;
    try {
      const { rows } = await dbPool.query(query, [voucherId]);

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get All Vouchers Of Company
  static async getByCompany(companyId) {
    const query = `
      SELECT
        vouchers.*,
        ledgers.ledger_name AS party_name
      FROM vouchers
      JOIN ledgers
        ON ledgers.id = vouchers.party_ledger_id
      WHERE vouchers.company_id = $1
      ORDER BY
        vouchers.voucher_date DESC,
        vouchers.id DESC;
    `;
    try {
      const { rows } = await dbPool.query(query, [companyId]);

      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Delete Voucher
  static async delete(connection, voucherId) {
    const query = `
      DELETE FROM vouchers
      WHERE id = $1
      RETURNING *;
    `;
    try {
      const { rows } = await connection.query(query, [voucherId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Check Duplicate Voucher Number
  static async voucherExists(companyId, voucherType, financialYear, voucherNo) {
    const query = `
      SELECT id
      FROM vouchers
      WHERE
        company_id = $1
        AND voucher_type = $2
        AND financial_year = $3
        AND voucher_no = $4;
    `;

    try {
      const { rows } = await dbPool.query(query, [
        companyId,
        voucherType,
        financialYear,
        voucherNo,
      ]);

      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Search Voucher by voucher number or ledger_name
  static async search(companyId, keyword) {
    const query = `
      SELECT
        vouchers.id,
        vouchers.voucher_no,
        vouchers.voucher_type,
        vouchers.voucher_date,
        vouchers.total_amount,
        vouchers.status,
        ledgers.ledger_name AS party_name
      FROM vouchers
      JOIN ledgers
        ON ledgers.id = vouchers.party_ledger_id
      WHERE
        vouchers.company_id = $1
        AND (
          vouchers.voucher_no ILIKE $2
          OR ledgers.ledger_name ILIKE $2
        )
      ORDER BY
        vouchers.voucher_date DESC;
    `;
    try {
      const { rows } = await dbPool.query(query, [companyId, `%${keyword}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  // // Get Latest Voucher Number
  // static async getLastVoucher(companyId, voucherType, financialYear) {
  //   const query = `
  //     SELECT voucher_no
  //     FROM vouchers
  //     WHERE
  //       company_id = $1
  //       AND voucher_type = $2
  //       AND financial_year = $3
  //     ORDER BY id DESC
  //     LIMIT 1;
  //   `;

  //   const { rows } = await dbPool.query(query, [
  //     companyId,
  //     voucherType,
  //     financialYear,
  //   ]);

  //   return rows[0] || null;
  // }
}

export default VoucherModel;
