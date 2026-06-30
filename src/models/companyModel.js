import { dbPool } from "../config/db.js";

class CompanyModel {
  //create company function
  static async create(connection, companyDetails) {
    const {
      user_id,
      company_name,
      address,
      city,
      state,
      country,
      pincode,
      phone,
      email,
      gst_number,
      pan_number,
      financial_year_start,
      financial_year_end,
    } = companyDetails;

    try {
      const query = `
        INSERT INTO companies (
        user_id,
        company_name,
        address,
        city,
        state,
        country,
        pincode,
        gst_number,
        pan_number,
        financial_year_start,
        financial_year_end,
        phone,
        email
      )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13
        )
        RETURNING *;
      `;
      const values = [
        user_id,
        company_name,
        address,
        city,
        state,
        country,
        pincode,
        gst_number,
        pan_number,
        financial_year_start,
        financial_year_end,
        phone,
        email,
      ];
      const result = await connection.query(query, values);
      const company = result.rows[0];
      delete company.created_at;
      delete company.updated_at;
      return company;
    } catch (error) {
      throw error;
    }
  }

  //Update company details
  static async update(companyId, companyDetails, userId) {
    const {
      company_name,
      address,
      city,
      state,
      country,
      pincode,
      gst_number,
      pan_number,
      financial_year_start,
      financial_year_end,
      phone,
      email,
    } = companyDetails;
    try {
      //DB  query to update the company
      const query = `
      UPDATE companies
      SET
        company_name = $1,
        address = $2,
        city = $3,
        state = $4,
        country = $5,
        pincode = $6,
        gst_number = $7,
        pan_number = $8,
        financial_year_start = $9,
        financial_year_end = $10,
        phone = $11,
        email = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13 AND user_id = $14
      RETURNING *;
    `;
      const values = [
        company_name,
        address,
        city,
        state,
        country,
        pincode,
        gst_number,
        pan_number,
        financial_year_start,
        financial_year_end,
        phone,
        email,
        companyId,
        userId,
      ];
      const result = await dbPool.query(query, values);
      const updatedCompany = result.rows[0];
      return updatedCompany;
    } catch (error) {
      throw error;
    }
  }
  //get all the company with company id
  static async getCompanyById(companyId) {
    try {
      const result = await dbPool.query(
        `
        SELECT * FROM companies WHERE id = $1;
        `,
        [companyId],
      );
      const company = result.rows[0];
      return company;
    } catch (error) {
      throw error;
    }
  }
  //get all companies for a user
  static async getCompaniesByUserId(user_id) {
    try {
      const result = await dbPool.query(
        `
        SELECT * FROM companies WHERE user_id = $1;
        `,
        [user_id],
      );
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  // delete a company
  static async delete(companyId, userId) {
    try {
      const result = await dbPool.query(
        `
      DELETE FROM companies WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
        [companyId, userId],
      );
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  //count user companies for to check max 5 companies per user
  static async countCompaniesByUser(user_id) {
    try {
      const result = await dbPool.query(
        `
        SELECT COUNT(*) FROM companies WHERE user_id = $1
        `,
        [user_id],
      );
      return Number(result.rows[0].count);
    } catch (error) {
      throw error;
    }
  }

  static async serachCompanyByName(company_name) {
    try {
      const companyPattern = `%${company_name}%`;

      const result = await dbPool.query(
        `
      SELECT id,company_name FROM companies
      WHERE  company_name ILIKE $1
      LIMIT 10
    `,
        [companyPattern],
      );
      return result.rows;
    } catch (error) {
      console.error("Database query failed:", error);
      throw error;
    }
  }
}

export default CompanyModel;
