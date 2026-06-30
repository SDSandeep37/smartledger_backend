import { dbPool } from "../config/db.js";
import CompanyModel from "../models/companyModel.js";
import LedgerGroupModel from "../models/ledgerGroupModel.js";

class CompanyService {
  //create company with default ledger group
  static async createCompany(data) {
    const connection = await dbPool.connect();
    try {
      await connection.query("BEGIN");

      const company = await CompanyModel.create(connection, data);
      await LedgerGroupModel.seedDefaultGroups(connection, company.id);

      await connection.query("COMMIT");

      return company;
    } catch (error) {
      await connection.query("ROLLBACK");
      throw error;
    } finally {
      connection.release();
    }
  }
}

export default CompanyService;
