// Function to show message input field and existing messages when a user is clicked
async function showMessageInput(chat_id, recipient_id, recipient_name) {
  // Get the container where the message input and messages will appear
  const inputDiv = document.getElementById('message-input');
  const messageTimelineDiv = document.getElementById('message-timeline');

  // Clear the message timeline to ensure fresh display
  messageTimelineDiv.innerHTML = '';

  // Fetch existing messages for the selected chat
  const messagesResponse = await fetch(`http://localhost:3000/messages`);
  if (!messagesResponse.ok) {
    console.error("Failed to fetch messages");
    return;
  }

  const messages = await messagesResponse.json();

  // Filter messages to only include those that match the chat_id
  const filteredMessages = messages.filter(message => message.chat_id === chat_id);

  // Get the user_id from the session
  const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));
  const user_id = sessionData.user_id;

  // Display the filtered messages in a timeline (oldest on top)
  filteredMessages.sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at));  // Sort by timestamp (ascending)
  
  filteredMessages.forEach(message => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    
    // Check if sender_id matches user_id to display "Me"
    const senderName = message.sender_id === user_id ? "Me" : message.sender_name;

    messageElement.innerHTML = `
      <p><strong>${senderName}</strong> at ${new Date(message.sent_at).toLocaleString()}:</p>
      <p>${message.message}</p>
    `;
    messageTimelineDiv.appendChild(messageElement);
  });

  // Create an input field and submit button for sending a new message
  inputDiv.innerHTML = `
    <input type="text" id="userMessage" placeholder="Type your message here" />
    <button id="submitMessage">Send Message</button>
  `;

  // Handle the submit button click
  document.getElementById('submitMessage').addEventListener('click', async () => {
    const message = document.getElementById('userMessage').value;
    const sender_id = user_id; // Sender ID from session data

    if (message.trim() !== "") {
      // Send the message to the backend API
      await sendMessageToAPI(chat_id, sender_id, recipient_id, message);
      // Clear input field after sending the message
      document.getElementById('userMessage').value = '';
      
      // Refresh the messages immediately after sending
      showMessageInput(chat_id, recipient_id, recipient_name);  // Re-fetch and display messages
    } else {
      alert("Message cannot be empty");
    }
  });
}



// Function to send message to the create-message API
async function sendMessageToAPI(chat_id, sender_id, recipient_id, message) {
  try {
    const response = await fetch('http://localhost:3000/create-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id,
        sender_id,
        recipient_id,
        message,
        sent_at: new Date(),
      }),
    });

    if (response.ok) {
      console.log(`Message sent: ${message}`);
    } else {
      console.error('Failed to send message:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Function to fetch and display chat information based on the user_id
async function fetchChatDocuments() {
  const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));
  
  if (!sessionData || !sessionData.user_id) {
    console.error('User ID not found in session data');
    return;
  }

  const user_id = sessionData.user_id;

  try {
    const chatResponse = await fetch('http://localhost:3000/chats');
    if (!chatResponse.ok) throw new Error('Failed to fetch chats');
    
    const chats = await chatResponse.json();
    const filteredChats = chats.filter(chat => chat.chat_user_1 === user_id || chat.chat_user_2 === user_id);

    const userResponse = await fetch('http://localhost:3000/users');
    if (!userResponse.ok) throw new Error('Failed to fetch users');
    
    const users = await userResponse.json();
    const resultContainer = document.getElementById('chat-result');
    resultContainer.innerHTML = '';  // Clear previous results

    filteredChats.forEach(chat => {
      const matchedUser = users.find(user => user.user_id === (chat.chat_user_1 === user_id ? chat.chat_user_2 : chat.chat_user_1));
      
      if (matchedUser) {
        const p = document.createElement('p');
        const displayName = matchedUser.user_nickname || matchedUser.user_username;
        p.textContent = `Chat with ${displayName}`;
        
        // Add event listener to show message input and timeline
        p.addEventListener('click', () => showMessageInput(chat.id, matchedUser.user_id, displayName));
        resultContainer.appendChild(p);
      }
    });
    
  } catch (error) {
    console.error('Error fetching chat documents or users:', error);
  }
}

// Call the function to fetch and display chat documents
fetchChatDocuments();
