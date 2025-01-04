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

    // Log the creation as a notification (You might want to dynamically set user IDs here)
    const newChatNotification = {
      id: `log-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      event_type: `chats`,
      user_id: chat_user_1,  // Assuming user_id of the first user creates the log
      related_user: chat_user_2,  // Assuming the second user is related
      // message: chat_user_1 === chat_user_1 ? `Du har startet en chat med` : "har startet en chat med dig",
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
export async function createMessage(chat_id, sender_id, message) {
  try {
    const { messagesCollection, logsCollection, client } = await connectToMongoDB('messages');

    // Generate a unique id for the message
    const messageId = `message-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;

    // Create the new message document
    const newMessage = {
      id: messageId,
      chat_id: chat_id, // Chat ID associated with the message
      sender_id: sender_id, // Sender ID (user_id from sessionData)
      message: message, // Message text from the input field
      sent_at: new Date(), // Timestamp for when the message is sent
    };

    console.log('New message data:', newMessage);

    // Insert the new message document into the messages collection
    const messageResult = await messagesCollection.insertOne(newMessage);
    console.log('Message Insert Result:', messageResult);

    // Log the message creation as a notification (optional)
    const newMessageNotification = {
      id: `log-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`,
      event_type: `message`,
      user_id: sender_id, // The sender's user ID
      related_user: chat_id, // The chat ID (or related user, depending on your logic)
      message: `User ${sender_id} sent a message in chat ${chat_id}: "${message}"`,
      created_at: new Date(),
    };

    console.log('New message notification data:', newMessageNotification);

    // Insert the notification into the logs collection
    const logResult = await logsCollection.insertOne(newMessageNotification);
    console.log('Log Insert Result:', logResult);

    // Close the client connection after operations
    await client.close();

    return { messageResult, logResult };
  } catch (error) {
    console.error('Error creating message:', error);
  }
}
