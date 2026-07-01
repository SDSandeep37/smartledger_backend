import { dbPool } from "../config/db.js";

class UnitModel {
  //create a new unit
  static async createUnit(unitData) {
    const { company_id, unit_name, unit_symbol } = unitData;
    try {
      const result = await dbPool.query(
        "INSERT INTO units (company_id, unit_name, unit_symbol) VALUES ($1, $2, $3) RETURNING *",
        [company_id, unit_name, unit_symbol],
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating unit:", error);
      throw error;
    }
  }

  //update an existing unit
  static async updateUnit(unitId, unitData) {
    const { unit_name, unit_symbol } = unitData;
    try {
      const result = await dbPool.query(
        "UPDATE units SET unit_name = $1, unit_symbol = $2 WHERE id = $3 RETURNING *",
        [unit_name, unit_symbol, unitId],
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error updating unit:", error);
      throw error;
    }
  }
  //get all units for a specific company
  static async getUnitsByCompany(companyId) {
    try {
      const result = await dbPool.query(
        "SELECT * FROM units WHERE company_id = $1",
        [companyId],
      );
      return result.rows;
    } catch (error) {
      console.error("Error fetching units:", error);
      throw error;
    }
  }
  // get a specific unit by its ID
  static async getUnitById(unitId) {
    try {
      const result = await dbPool.query("SELECT * FROM units WHERE id = $1", [
        unitId,
      ]);
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching unit by ID:", error);
      throw error;
    }
  }
  //delete a unit by its ID
  static async deleteUnit(unitId) {
    try {
      const result = await dbPool.query(
        "DELETE FROM units WHERE id = $1 RETURNING *",
        [unitId],
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error deleting unit:", error);
      throw error;
    }
  }
}

export default UnitModel;
