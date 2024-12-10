import { queryDatabase } from './connect-postgres.mjs';

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const users = await queryDatabase('SELECT * FROM users');
    return users;
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};

// Fetch all interests
export const fetchAllInterests = async () => {
  try {
    const users = await queryDatabase('SELECT * FROM interests');
    return users;
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};

// Fetch all user-interest
export const fetchAllUserInterest = async () => {
  try {
    const users = await queryDatabase('SELECT * FROM user_interest');
    return users;
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};

// Fetch all matches
export const fetchAllMatches = async () => {
  try {
    const users = await queryDatabase('SELECT * FROM matches');
    return users;
  } catch (err) {
    throw new Error("Error fetching users: " + err.message);
  }
};



