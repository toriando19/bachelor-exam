import { connectToMongoDB } from './connect-mongo.mjs';

// Function to fetch documents from the 'test' collection
async function fetchDocuments() {
  try {
    // Get the database and collection connection from dbConnection
    const { collection, client } = await connectToMongoDB();

    // Fetch all documents from the collection
    const documents = await collection.find({}).toArray();
    console.log('Documents:', documents);

    // Close the client connection after query
    await client.close();

    return documents;

  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

// Call the fetch function (or use it in an API route if needed)
fetchDocuments();
