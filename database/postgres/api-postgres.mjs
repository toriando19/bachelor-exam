import { queryDatabase } from './connect-postgres.mjs';

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const users = await queryDatabase('SELECT * FROM user_table');
    return users;
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};


