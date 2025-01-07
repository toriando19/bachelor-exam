import { connectToMongoDB } from './connect-mongo.mjs'; // Import the connectToMongoDB function

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Fetch all  /////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to fetch documents from the 'chats' collection
export async function fetchChats() {
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

// Function to fetch documents from the 'messages' collection
export async function fetchMessages() {
  try {
    const { messagesCollection, client } = await connectToMongoDB('messages');
    const documents = await messagesCollection.find({}).toArray();
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

    // Ensure chat_user_1 and chat_user_2 are integers
    const user1 = parseInt(chat_user_1, 10);
    const user2 = parseInt(chat_user_2, 10);

    // Generate a unique id for the chat
    const chatId = `chat-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;

    // Create the new chat document
    const newChat = {
      id: chatId,
      chat_user_1: user1, // Store as integer
      chat_user_2: user2, // Store as integer
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
      user_id: user1,  // Use integer for user_id
      related_user: user2,  // Use integer for related_user
      message1: "Du har startet en chat med",
      message2: "har startet en chat med dig",
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
    throw error;  // Ensure the error is thrown for handling in the route
  }
}



// Function to delete a chat document by its chat_id
export async function deleteChat(chat_id) {
  try {
    const { chatCollection, client } = await connectToMongoDB('chats');
    
    // Find and delete the chat with the given chat_id
    const result = await chatCollection.deleteOne({ id: chat_id });

    // Close the client connection after the operation
    await client.close();

    // Return the result of the delete operation
    return result;
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;  // Ensure the error is thrown for handling in the route
  }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create Message  ///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to create a new message and log the activity
export async function createMessage(req, res) {
  try {
    // Destructure data from the request body
    const { chat_id, sender_id, recipient_id, message } = req.body;

    // Check if all required fields are present
    if (!chat_id || !sender_id || !recipient_id || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Connect to MongoDB and get collections
    const { messagesCollection, logsCollection, client } = await connectToMongoDB('messages');

    // Generate a unique ID for the message
    const messageId = `message-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;

    // Create the message document
    const newMessage = {
      id: messageId,
      chat_id: chat_id, // Chat ID associated with the message
      sender_id: sender_id, // Sender ID
      recipient_id: recipient_id, // Recipient ID
      message: message, // Message content
      sent_at: new Date(), // Timestamp of when the message is sent
    };

    console.log('New message data:', newMessage); // Log the message data for debugging

    // Insert the new message into the messages collection
    const messageResult = await messagesCollection.insertOne(newMessage);
    console.log('Message Insert Result:', messageResult);

    // Create a log entry for the message creation
    const newMessageNotification = {
      id: `log-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      event_type: 'message',
      user_id: sender_id, // Sender's user ID
      related_user: chat_id, // Chat ID
      message: `User ${sender_id} sent a message in chat ${chat_id}: "${message}"`,
      created_at: new Date(),
    };

    console.log('New message notification data:', newMessageNotification);

    // Insert the log entry into the logs collection
    const logResult = await logsCollection.insertOne(newMessageNotification);
    console.log('Log Insert Result:', logResult);

    // Close the MongoDB client connection
    await client.close();

    // Return a success response with the results of both insertions
    return { messageResult, logResult };
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Error creating message' });
  }
}

