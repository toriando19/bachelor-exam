import request from 'supertest';
import express from 'express';
import { fetchAllUsers } from '../database/postgres/api-postgres.mjs'; // Ensure the function is correctly imported
import { queryDatabase } from '../database/postgres/connect-postgres.mjs'; // Mock the database module

jest.mock('../database/postgres/connect-postgres.mjs'); // Mock the database module

// Set up an Express app with the required route
const app = express();
app.use(express.json());

app.get('/users', async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

describe('GET /users', () => {
  beforeEach(() => {
    // Mock the database query response
    queryDatabase.mockResolvedValue([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset all mocks between tests
  });

  it('should return a list of users with status 200', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' },
    ]);
    expect(queryDatabase).toHaveBeenCalledWith('SELECT * FROM users');
  });

  it('should return an empty array if no users are found', async () => {
    queryDatabase.mockResolvedValueOnce([]); // Mock an empty response

    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(queryDatabase).toHaveBeenCalledWith('SELECT * FROM users');
  });

  it('should handle errors gracefully', async () => {
    queryDatabase.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app).get('/users');

    expect(response.status).toBe(500);
    expect(response.text).toContain('Error fetching users: Database error');
  });
});