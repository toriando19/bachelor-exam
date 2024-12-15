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
    const interests = await queryDatabase('SELECT * FROM interests');
    return interests;
  } catch (err) {
    throw new Error("Error fetching interests: " + err.message);
  }
};

// Fetch all user-interest
export const fetchAllUserInterest = async () => {
  try {
    const userInterests = await queryDatabase('SELECT * FROM user_interest');
    return userInterests;
  } catch (err) {
    throw new Error("Error fetching user interests: " + err.message);
  }
};

// Fetch all matches
export const fetchAllMatches = async () => {
  try {
    const matches = await queryDatabase('SELECT * FROM matches');
    return matches;
  } catch (err) {
    throw new Error("Error fetching matches: " + err.message);
  }
};

// Function to add user interest
export const addUserInterest = async (user_interest_user, user_interest_interest) => {
  try {
    const result = await queryDatabase(
      'INSERT INTO user_interest (user_interest_user, user_interest_interest) VALUES ($1, $2)',
      [user_interest_user, user_interest_interest]
    );
    console.log('Interest added successfully:', result);
  } catch (error) {
    console.error('Error adding interest:', error);
  }
};

// Function to remove user interest
export const removeUserInterest = async (userId, interestId) => {
  try {
    const result = await queryDatabase(
      'DELETE FROM user_interest WHERE user_interest_user = $1 AND user_interest_interest = $2',
      [userId, interestId]
    );
    console.log('Interest removed successfully:', result);
  } catch (error) {
    console.error('Error removing interest:', error);
  }
};
