import { MongoClient } from 'mongodb';

// MongoDB connection URI
const uri = 'mongodb://localhost:27017'; // MongoDB URI for local connection

// Database name
const dbName = 'bachelor'; // Database name

// Async function to connect to MongoDB and return the database and collection
export async function connectToMongoDB() {
  let client;

  try {
    // Create a new MongoClient instance and connect to the MongoDB server
    client = new MongoClient(uri);

    // Connect to the MongoDB server
    await client.connect();

    console.log('Connected successfully to MongoDB');

    // Get the database object (use your database name)
    const db = client.db(dbName);

    // Get the collection object ('test' collection)
    const collection = db.collection('chats');

    // Return both db and collection objects
    return { db, collection, client };

  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    throw error;  // Rethrow the error to handle it in other modules
  }
}
