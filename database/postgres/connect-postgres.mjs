import pkg from 'pg';
const { Client } = pkg;

// PostgreSQL connection configuration
const client = new Client({
  user: 'postgres',       // Replace with your PostgreSQL username
  host: 'localhost',      // Replace with your host (usually 'localhost')
  database: 'demo',       // Replace with your database name
  password: 'postgresAdmin4',  // Replace with your password
  port: 5432,             // Default PostgreSQL port
});

// Function to connect to the database
export const connectToDatabase = async () => {
  try {
    await client.connect();  // Connect to the database
    console.log("Connected to the database successfully!");
  } catch (err) {
    console.error("Database connection failed:", err.stack);
  }
};

// Function to close the database connection
export const closeDatabaseConnection = async () => {
  try {
    await client.end();  // Close the connection
    console.log("Database connection closed.");
  } catch (err) {
    console.error("Failed to close the database connection:", err.stack);
  }
};
