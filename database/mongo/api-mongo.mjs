import { connectToMongoDB } from './connect-mongo.mjs'; // Import the connectToMongoDB function

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch all  /////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to fetch documents from the 'chats' collection
export async function fetchDocuments() {
  try {
    const { chatCollection, client } = await connectToMongoDB('chats');
    const documents = await chatCollection.find({}).toArray();
    await client.close();
    return documents;
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
}

// Function to fetch documents from the 'notifications' collection
export async function fetchNotifications() {
  try {
    const { logsCollection, client } = await connectToMongoDB('logs');
    const documents = await logsCollection.find({}).toArray();
    await client.close();
    return documents;
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create Chat  ///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to create a chat and log the activity
export async function createChat(chat_user_1, chat_user_2) {
  try {
    const { chatCollection, logsCollection, client } = await connectToMongoDB('chats');

    // Generate a unique id for the chat
    const chatId = `chat-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;

    // Create the new chat document
    const newChat = {
      id: chatId,
      chat_user_1: chat_user_1,
      chat_user_2: chat_user_2,
      created_at: new Date(),
    };

    console.log('New chat data:', newChat);

    // Insert the new chat document into the collection
    const chatResult = await chatCollection.insertOne(newChat);
    console.log('Chat Insert Result:', chatResult);

    // Log the creation as a notification
    const newChatNotification = {
      id: `log-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      event_type: `chats`,
      user_id: 4,
      related_user: 6,
      message: `A new chat has been created between brugerH4p5 and brugerW3l7.`,
      created_at: new Date(),
    };

    console.log('New notification data:', newChatNotification);

    // Insert the notification into the logs collection
    const logResult = await logsCollection.insertOne(newChatNotification);
    console.log('Log Insert Result:', logResult);

    // Close the client connection after operations
    await client.close();

    return { chatResult, logResult };
  } catch (error) {
    console.error('Error creating chat:', error);
  }
}