import { dbPool } from "../config/db.js";

class VoucherItemModel {
  // Create Voucher Item
  static async create(connection, itemDetails) {
    const {
      voucher_id,
      stock_item_id,
      quantity,
      rate,
      discount_percent,
      discount_amount,
      taxable_amount,
      gst_percent,
      gst_amount,
      line_total,
    } = itemDetails;

    try {
      const query = `
        INSERT INTO voucher_items (
          voucher_id,
          stock_item_id,
          quantity,
          rate,
          discount_percent,
          discount_amount,
          taxable_amount,
          gst_percent,
          gst_amount,
          line_total
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
        )
        RETURNING *;
      `;

      const values = [
        voucher_id,
        stock_item_id,
        quantity,
        rate,
        discount_percent || 0,
        discount_amount || 0,
        taxable_amount || 0,
        gst_percent || 0,
        gst_amount || 0,
        line_total || 0,
      ];

      const { rows } = await connection.query(query, values);

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Get All Items Of Voucher
  static async getByVoucher(voucherId) {
    try {
      const query = `
        SELECT
          vi.*,
          si.item_name,
          si.sku,
          u.unit_name,
          u.unit_symbol
        FROM voucher_items vi
        JOIN stock_items si
          ON si.id = vi.stock_item_id
        JOIN units u
          ON u.id = si.unit_id
        WHERE vi.voucher_id = $1
        ORDER BY vi.id;
      `;

      const { rows } = await dbPool.query(query, [voucherId]);

      return rows;
    } catch (error) {
      throw error;
    }
  }

  // Update Voucher Item
  static async update(itemId, itemDetails) {
    const {
      quantity,
      rate,
      discount_percent,
      discount_amount,
      taxable_amount,
      gst_percent,
      gst_amount,
      line_total,
    } = itemDetails;

    try {
      const query = `
        UPDATE voucher_items
        SET
          quantity = $1,
          rate = $2,
          discount_percent = $3,
          discount_amount = $4,
          taxable_amount = $5,
          gst_percent = $6,
          gst_amount = $7,
          line_total = $8
        WHERE id = $9
        RETURNING *;
      `;

      const values = [
        quantity,
        rate,
        discount_percent,
        discount_amount,
        taxable_amount,
        gst_percent,
        gst_amount,
        line_total,
        itemId,
      ];

      const { rows } = await dbPool.query(query, values);

      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Delete All Items Of Voucher
  static async deleteByVoucher(connection, voucherId) {
    try {
      const query = `
        DELETE FROM voucher_items
        WHERE voucher_id = $1;
      `;

      await connection.query(query, [voucherId]);

      return true;
    } catch (error) {
      throw error;
    }
  }

  // Delete Single Voucher Item
  static async delete(itemId) {
    try {
      const { rows } = await dbPool.query(
        `
        DELETE FROM voucher_items
        WHERE id = $1
        RETURNING *;
        `,
        [itemId],
      );

      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default VoucherItemModel;
