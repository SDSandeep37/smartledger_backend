import { dbPool } from "../config/db.js";

import VoucherModel from "../models/voucherModel.js";
import VoucherItemModel from "../models/voucherItemModel.js";
import VoucherSequenceModel from "../models/voucherSequenceModel.js";
import StockItemsModel from "../models/stockItemsModel.js";
import VoucherEntryModel from "../models/voucherEntriesModel.js";
import LedgersModel from "../models/ledgersModel.js";

const VOUCHER_PREFIX = {
  Purchase: "PUR",
  Sales: "SAL",
};

class VoucherService {
  // Generate Voucher Number
  static async generateVoucherNumber(
    connection,
    companyId,
    voucherType,
    financialYear,
  ) {
    const nextNumber = await VoucherSequenceModel.getNextNumber(
      connection,
      companyId,
      voucherType,
      financialYear,
    );

    const prefix = VOUCHER_PREFIX[voucherType];

    return `${prefix}-${String(nextNumber).padStart(6, "0")}`;
  }

  // Create Purchase/Sales Voucher
  static async createVoucher(voucherData, userId) {
    const connection = await dbPool.connect();

    try {
      await connection.query("BEGIN");

      const {
        company_id,
        voucher_type,
        financial_year,
        voucher_date,
        party_ledger_id,
        narration,
        items,
      } = voucherData;
      const created_by = userId;
      if (!items || items.length === 0) {
        throw new Error("Voucher must contain at least one item.");
      }

      // Generate Voucher Number
      const voucher_no = await this.generateVoucherNumber(
        connection,
        company_id,
        voucher_type,
        financial_year,
      );

      let voucherTotal = 0;

      // Calculate all item totals on backend
      const processedItems = items.map((item) => {
        const quantity = Number(item.quantity);
        const rate = Number(item.rate);

        const grossAmount = quantity * rate;

        const discountPercent = Number(item.discount_percent || 0);
        const discountAmount = (grossAmount * discountPercent) / 100;

        const taxableAmount = grossAmount - discountAmount;

        const gstPercent = Number(item.gst_percent || 0);

        const gstAmount = (taxableAmount * gstPercent) / 100;

        const lineTotal = taxableAmount + gstAmount;

        voucherTotal += lineTotal;

        return {
          ...item,
          quantity,
          rate,
          grossAmount,
          discountPercent,
          discountAmount,
          taxableAmount,
          gstPercent,
          gstAmount,
          lineTotal,
        };
      });

      // Create Voucher Header
      const voucher = await VoucherModel.create(
        connection,
        {
          company_id,
          voucher_no,
          voucher_type,
          financial_year,
          voucher_date,
          party_ledger_id,
          narration,
          total_amount: voucherTotal,
        },
        userId,
      );

      // Save Voucher Items & Update Stock
      for (const item of processedItems) {
        await VoucherItemModel.create(connection, {
          voucher_id: voucher.id,
          stock_item_id: item.stock_item_id,
          quantity: item.quantity,
          rate: item.rate,
          discount_percent: item.discountPercent,
          discount_amount: item.discountAmount,
          taxable_amount: item.taxableAmount,
          gst_percent: item.gstPercent,
          gst_amount: item.gstAmount,
          line_total: item.lineTotal,
        });

        const stockChange =
          voucher_type === "Purchase" ? item.quantity : -item.quantity;

        await StockItemsModel.updateStockItemCurrentStock(
          connection,
          item.stock_item_id,
          stockChange,
        );
      }
      // Create Ledger Entries
      if (voucher_type === "Purchase") {
        const purchaseLedger = await LedgersModel.getPurchaseLedger(
          connection,
          company_id,
        );

        if (!purchaseLedger) {
          throw new Error("Purchase Account ledger not found.");
        }

        // Purchase Account Dr
        await VoucherEntryModel.create(connection, {
          voucher_id: voucher.id,
          ledger_id: purchaseLedger.id,
          debit: voucherTotal,
          credit: 0,
        });

        // Supplier Cr
        await VoucherEntryModel.create(connection, {
          voucher_id: voucher.id,
          ledger_id: party_ledger_id,
          debit: 0,
          credit: voucherTotal,
        });
      } else {
        const salesLedger = await LedgersModel.getSalesLedger(
          connection,
          company_id,
        );

        if (!salesLedger) {
          throw new Error("Sales Account ledger not found.");
        }

        // Customer Dr
        await VoucherEntryModel.create(connection, {
          voucher_id: voucher.id,
          ledger_id: party_ledger_id,
          debit: voucherTotal,
          credit: 0,
        });

        // Sales Account Cr
        await VoucherEntryModel.create(connection, {
          voucher_id: voucher.id,
          ledger_id: salesLedger.id,
          debit: 0,
          credit: voucherTotal,
        });
      }
      await connection.query("COMMIT");

      return voucher;
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
  }

  // Delete Voucher
  static async deleteVoucher(voucherId) {
    // console.log(
    //   "voucherId from deleteVoucher() of voucher  service",
    //   voucherId,
    // );
    const connection = await dbPool.connect();

    try {
      await connection.query("BEGIN");

      const voucher = await VoucherModel.getById(voucherId);

      if (!voucher) {
        throw new Error("Voucher not found.");
      }

      const items = await VoucherItemModel.getByVoucher(voucherId);

      for (const item of items) {
        const stockChange =
          voucher.voucher_type === "Purchase" ? -item.quantity : item.quantity;

        await StockItemsModel.updateStockItemCurrentStock(
          connection,
          item.stock_item_id,
          stockChange,
        );
      }

      await VoucherItemModel.deleteByVoucher(connection, voucherId);

      await VoucherModel.delete(connection, voucherId);

      await connection.query("COMMIT");

      return true;
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default VoucherService;
