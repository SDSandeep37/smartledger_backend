import { dbPool } from "../config/db.js";

class StockGroupModel {
  //create stock group
  static async create(stockGroupDetails) {
    const { company_id, group_name, parent_group_id } = stockGroupDetails;
    console.log(stockGroupDetails);
    try {
      const query = `INSERT INTO stock_groups (company_id, group_name, parent_group_id)
       VALUES ($1,$2,$3) RETURNING *;`;
      const values = [company_id, group_name, parent_group_id];
      const result = await dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  //update stock group
  static async update(stockGroupDetails, stockGroupId) {
    const { group_name, parent_group_id } = stockGroupDetails;
    try {
      const query = `UPDATE stock_groups SET group_name = $1, parent_group_id = $2 WHERE id = $3 RETURNING *;`;
      const values = [group_name, parent_group_id, stockGroupId];
      const result = await dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  //delete stock group
  static async delete(stockGroupId) {
    try {
      const query = `DELETE FROM stock_groups WHERE id = $1 RETURNING *;`;
      const values = [stockGroupId];
      const result = await dbPool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  ///get all stock groups for a company
  static async getStockGroupsByCompanyId(companyId) {
    try {
      const result = await dbPool.query(
        `
        SELECT 
        sg.*,
        pg.group_name AS parent_group_name
        FROM stock_groups sg
        LEFT JOIN  stock_groups pg
        ON sg.parent_group_id = pg.id
        WHERE sg.company_id = $1;
        `,
        [companyId],
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  //get stock by id
  static async getStockGroupById(stockGroupId) {
    try {
      const result = await dbPool.query(
        `
        SELECT * FROM stock_groups WHERE id = $1;
        `,
        [stockGroupId],
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  //get all stock groups for a company with parent group name
  static async getStockGroupsByCompanyIdWithParent(companyId) {
    try {
      const result = await dbPool.query(
        `
        SELECT sg.*, pg.group_name as parent_group_name
        FROM stock_groups sg
        LEFT JOIN stock_groups pg ON sg.parent_group_id = pg.id
        WHERE sg.company_id = $1;
        `,
        [companyId],
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  //search stock groups by name for a company
  static async searchStockGroupsByName(companyId, groupName) {
    try {
      const result = await dbPool.query(
        `
        SELECT * FROM stock_groups 
        WHERE company_id = $1 AND group_name ILIKE $2;
        `,
        [companyId, `%${groupName}%`],
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  //check if stock group name already exists for a company
  static async checkStockGroupNameExists(companyId, groupName) {
    try {
      const result = await dbPool.query(
        `
        SELECT * FROM stock_groups 
        WHERE company_id = $1 AND group_name = $2;
        `,
        [companyId, groupName],
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
  //get child stock groups for a parent group
  static async getChildStockGroups(parentGroupId) {
    try {
      const result = await dbPool.query(
        `
        SELECT * FROM stock_groups 
        WHERE parent_group_id = $1;
        `,
        [parentGroupId],
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  //check if  parent exists for a stock group for a company
  static async checkParentExists(companyId, parentGroupId) {
    try {
      const result = await dbPool.query(
        `
        SELECT * FROM stock_groups 
        WHERE company_id = $1 AND id = $2;
        `,
        [companyId, parentGroupId],
      );
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }
}

export default StockGroupModel;
