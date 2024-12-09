// api.mjs
import { connectToMongoDB } from './connect-mongo.mjs'; // Import the connectToMongoDB function

// Function to fetch documents from the 'test' collection
export async function fetchDocuments() {
  try {
    // Get the database and collection connection from connectToMongoDB
    const { collection, client } = await connectToMongoDB();

    // Fetch all documents from the collection
    const documents = await collection.find({}).toArray();
    
    // Close the client connection after query
    await client.close();

    return documents;

  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

// Call the fetch function (this can be triggered by an API endpoint or another part of the app)
fetchDocuments();
