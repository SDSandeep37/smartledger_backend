import { dbPool } from "../config/db.js";
import DEFAULT_LEDGER_GROUPS from "../constants/defaultLegderGroups.js";

class LedgerGroupModel {
  static async create(data) {
    try {
      const query = `
        INSERT INTO ledger_groups
        (company_id, group_name, nature, parent_group_id, is_system)
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *;
      `;
      const values = [
        data.company_id,
        data.group_name,
        data.nature,
        data.parent_group_id ?? null, // if undefined parent_group_id, fallback to null
        data.is_system ?? false, // if undefined is_system, fallback to false
      ];

      const result = await dbPool.query(query, values);
      const ledger_group = result.rows[0];
      return ledger_group;
    } catch (error) {
      throw error;
    }
  }

  //get all the ledger group exist for a company
  static async getAllByCompanyId(companyId) {
    const query = `
      SELECT ledger_groups.*,pg.group_name AS parent_group
      FROM ledger_groups 
      LEFT JOIN ledger_groups pg
      ON ledger_groups.parent_group_id = pg.id
      WHERE ledger_groups.company_id=$1
      ORDER BY ledger_groups.group_name;
    `;
    try {
      const { rows } = await dbPool.query(query, [companyId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  //get ledger group by it's id
  static async getById(id) {
    const query = `
      SELECT *
      FROM ledger_groups
      WHERE id=$1;
    `;
    try {
      const { rows } = await dbPool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, data) {
    const query = `
      UPDATE ledger_groups
      SET
        group_name=$1,
        nature=$2,
        parent_group_id=$3,
        updated_at=CURRENT_TIMESTAMP
      WHERE id=$4
      RETURNING *;
    `;
    const values = [
      data.group_name,
      data.nature,
      data.parent_group_id || null,
      id,
    ];
    try {
      const { rows } = await dbPool.query(query, values);
      return rows[0];
    } catch (error) {}
  }
  static async delete(id) {
    const query = `
      DELETE FROM ledger_groups
      WHERE id=$1
      RETURNING *;
    `;

    const { rows } = await dbPool.query(query, [id]);

    return rows[0];
  }
  //check if ledger group exist for the particular company
  static async ledgerGroupExist(companyId, groupName) {
    const query = `
      SELECT id
      FROM ledger_groups
      WHERE company_id=$1
      AND LOWER(group_name)=LOWER($2);
    `;
    try {
      const { rows } = await dbPool.query(query, [companyId, groupName]);
      console.log(rows);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  //insert all default ledger group for company
  static async seedDefaultGroups(connection, companyId) {
    const groupMap = {};

    //insert root group where parent group should be null
    const rootGroups = DEFAULT_LEDGER_GROUPS.filter(
      (group) => group.parent_group === null,
    );
    for (const group of rootGroups) {
      const { rows } = await connection.query(
        `
           INSERT INTO ledger_groups
        (
          company_id,
          group_name,
          nature,
          parent_group_id,
          is_system
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING id
        `,
        [companyId, group.group_name, group.nature, null, true],
      );
      // push the id to group map
      groupMap[group.group_name] = rows[0].id;
    }
    // insert child group where parent group should exist
    const childGroups = DEFAULT_LEDGER_GROUPS.filter(
      (group) => group.parent_group !== null,
    );
    for (const group of childGroups) {
      await connection.query(
        `
        INSERT INTO ledger_groups
        (
          company_id,
          group_name,
          nature,
          parent_group_id,
          is_system
        )
        VALUES ($1,$2,$3,$4,$5)
        `,
        [
          companyId,
          group.group_name,
          group.nature,
          groupMap[group.parent_group],
          true,
        ],
      );
    }
  }
}

export default LedgerGroupModel;
