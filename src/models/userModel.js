import { dbPool } from "../config/db.js";
import { comparePassword } from "../utils/password.js";

export async function createUser(name, email, password, role = "owner") {
  try {
    const result = await dbPool.query(
      `
      INSERT INTO users (name,email, password,role)
     VALUES ($1, $2, $3,$4)
     RETURNING *`,
      [name, email, password, role],
    );
    const user = result.rows[0];
    // removing some informations
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    return user;
  } catch (error) {
    throw error;
  }
}

//user login function
export async function findUserByEmailPassword(email, password) {
  try {
    const result = await dbPool.query(
      `
      SELECT * FROM users WHERE email = $1
      `,
      [email],
    );
    const user = result.rows[0];
    if (!user) {
      return null; // Return null if user not found
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null; // Return null if password is invalid
    }
    // removing some informations
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    return user;
  } catch (error) {
    throw error;
  }
}

//user sesion function
export async function findUserById(userId) {
  try {
    const result = await dbPool.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [userId],
    );
    const user = result.rows[0];
    if (!user) {
      return null;
    }
    // removing some informations
    delete user.password;
    delete user.created_at;
    delete user.updated_at;
    return user;
  } catch (error) {
    throw error;
  }
}
