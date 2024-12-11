import { connectToMongoDB } from './connect-mongo.mjs'; // Import the connectToMongoDB function

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch all  /////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to fetch documents from the 'chats' collection
export async function fetchDocuments() {
  try {
    // Get the database and collection connection from connectToMongoDB
    const { chatCollection, client } = await connectToMongoDB('chats'); // Ensure you're targeting the 'chats' collection

    // Fetch all documents from the collection
    const documents = await chatCollection.find({}).toArray();
    
    // Close the client connection after query
    await client.close();

    return documents;

  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

// Function to fetch documents from the 'notifications' collection
export async function fetchNotifications() {
  try {
    // Get the database and collection connection from connectToMongoDB
    const { logsCollection, client } = await connectToMongoDB('logs'); // Ensure you're targeting the 'chats' collection

    // Fetch all documents from the collection
    const documents = await logsCollection.find({}).toArray();
    
    // Close the client connection after query
    await client.close();

    return documents;

  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create Chat  ///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Create a chat function
export async function createChat(chat_user_1, chat_user_2) {
  try {
    // Get the database and collection connection from connectToMongoDB
    const { chatCollection, client } = await connectToMongoDB('chats'); // Ensure you're inserting into the 'chats' collection

    // Generate a unique id for the chat
    const chatId = `chat-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;

    // Create the new chat document
    const newChat = {
      id: chatId,
      chat_user_1: chat_user_1,
      chat_user_2: chat_user_2,
      created_at: new Date(), // Current timestamp
    };

    console.log('New chat data:', newChat); // Log the data before inserting

    // Insert the new chat document into the collection
    const result = await chatCollection.insertOne(newChat);
    console.log('Insert result:', result); // Log the result of the insert operation

    // Close the client connection after inserting the document
    await client.close();

    // Return the result of the insert operation
    return result;

  } catch (error) {
    console.error('Error creating chat:', error);
  }
}