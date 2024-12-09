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

// Call the fetch function (this can be triggered by an API endpoint or another part of the app)
fetchAllUsers();

