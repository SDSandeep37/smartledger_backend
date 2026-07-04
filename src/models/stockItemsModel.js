import { dbPool } from "../config/db.js";

class StockItemsModel {
  static async createStockItem(stockItem) {
    const {
      company_id,
      stock_group_id,
      unit_id,
      item_name,
      sku,
      purchase_price,
      selling_price,
      opening_stock,
      current_stock,
      minimum_stock,
      gst_percent,
    } = stockItem;
    try {
      const query = `
      INSERT INTO stock_items (
        company_id,
        stock_group_id,
        unit_id,
        item_name,
        sku,
        purchase_price,
        selling_price,
        opening_stock,
        current_stock,
        minimum_stock,
        gst_percent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
    `;
      const values = [
        company_id,
        stock_group_id,
        unit_id,
        item_name,
        sku,
        purchase_price || 0,
        selling_price || 0,
        opening_stock || 0,
        current_stock || opening_stock || 0,
        minimum_stock || 0,
        gst_percent || 0,
      ];
      const result = await dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error creating stock item:", error);
      throw error;
    }
  }

  //update stock item
  static async updateStockItem(stockItem, stockItemId) {
    const {
      stock_group_id,
      unit_id,
      item_name,
      sku,
      purchase_price,
      selling_price,
      opening_stock,
      current_stock,
      minimum_stock,
      gst_percent,
    } = stockItem;
    try {
      const query = `
      UPDATE stock_items
      SET
        stock_group_id = $1,
        unit_id = $2,
        item_name = $3,
        sku = $4,
        purchase_price = $5,
        selling_price = $6,
        opening_stock = $7,
        current_stock = $8,
        minimum_stock = $9,
        gst_percent = $10
      WHERE id = $11
      RETURNING *
    `;
      const values = [
        stock_group_id,
        unit_id,
        item_name,
        sku,
        purchase_price || 0,
        selling_price || 0,
        opening_stock || 0,
        current_stock || opening_stock || 0,
        minimum_stock || 0,
        gst_percent || 0,
        stockItemId,
      ];
      const result = await dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error updating stock item:", error);
      throw error;
    }
  }
  //get item by id
  static async getStockItemById(stockItemId) {
    try {
      const query = `
       SELECT stock_items.*,stock_groups.group_name,units.unit_name,units.unit_symbol
        FROM stock_items 
        LEFT JOIN stock_groups 
          ON stock_items.stock_group_id = stock_groups.id
        JOIN units
          ON stock_items.unit_id = units.id
        WHERE stock_items.id = $1;
    `;
      const values = [stockItemId];
      const result = await dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching stock item by ID:", error);
      throw error;
    }
  }

  //get all stock items by company id
  static async getAllStockItemsByCompanyId(companyId) {
    try {
      const query = `
      SELECT stock_items.*,stock_groups.group_name,units.unit_name,units.unit_symbol
      FROM stock_items
      LEFT JOIN stock_groups
        ON stock_items.stock_group_id = stock_groups.id
      JOIN units
        ON stock_items.unit_id = units.id
      WHERE stock_items.company_id = $1 ORDER BY stock_items.item_name ASC;
    `;
      const values = [companyId];
      const result = await dbPool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error fetching stock items by company ID:", error);
      throw error;
    }
  }
  //delete item by id
  static async deleteStockItemById(stockItemId) {
    try {
      const query = `
      DELETE FROM stock_items
      WHERE id = $1
      RETURNING *;
    `;
      const values = [stockItemId];
      const result = await dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting stock item by ID:", error);
      throw error;
    }
  }

  //search stock items by item name or sku
  static async searchStockItems(companyId, searchTerm) {
    try {
      const query = `
      SELECT stock_items.*,stock_groups.group_name,units.unit_name,units.unit_symbol
      FROM stock_items
      LEFT JOIN stock_groups
        ON stock_items.stock_group_id = stock_groups.id
      JOIN units
        ON stock_items.unit_id = units.id
      WHERE stock_items.company_id = $1 AND (stock_items.item_name ILIKE $2 OR stock_items.sku ILIKE $2)
    `;
      const values = [companyId, `%${searchTerm}%`];
      const result = await dbPool.query(query, values);
      return result.rows;
    } catch (error) {
      console.error("Error searching stock items:", error);
      throw error;
    }
  }

  //check if stock item exists by name and company id
  static async checkStockItemExists(companyId, itemName) {
    try {
      const query = `
      SELECT * FROM stock_items
      WHERE company_id = $1 AND LOWER(item_name) = LOWER($2);
    `;
      const values = [companyId, itemName];
      const result = await dbPool.query(query, values);
      return result.rows.length > 0;
    } catch (error) {
      console.error("Error checking stock item existence:", error);
      throw error;
    }
  }

  //increase stock item current stock by id
  static async increaseStockItemCurrentStock(
    connection,
    stockItemId,
    quantity,
  ) {
    try {
      const query = `
      UPDATE stock_items
      SET current_stock = current_stock + $2
      WHERE id = $1
      RETURNING *;
    `;
      const values = [stockItemId, quantity];
      const result = await connection.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error increasing stock item current stock:", error);
      throw error;
    }
  }
  //decrease stock item current stock by id
  static async decreaseStockItemCurrentStock(
    connection,
    stockItemId,
    quantity,
  ) {
    try {
      const query = `
      UPDATE stock_items
      SET current_stock = current_stock - $2
      WHERE id = $1 AND current_stock >= $2
      RETURNING *;
    `;
      const values = [stockItemId, quantity];
      const result = await connection.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error("Error decreasing stock item current stock:", error);
      throw error;
    }
  }
  //one funtion to update stock item current stock by id and quantity (positive or negative)
  static async updateStockItemCurrentStock(connection, stockItemId, quantity) {
    try {
      if (quantity > 0) {
        return await this.increaseStockItemCurrentStock(
          connection,
          stockItemId,
          quantity,
        );
      } else {
        return await this.decreaseStockItemCurrentStock(
          connection,
          stockItemId,
          Math.abs(quantity),
        );
      }
    } catch (error) {
      console.error("Error updating stock item current stock:", error);
      throw error;
    }
  }
}
export default StockItemsModel;
