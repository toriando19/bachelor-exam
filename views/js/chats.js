// Function to fetch and display chat information based on the user_id
async function fetchChatDocuments() {
  // Retrieve the sessionData from sessionStorage and parse it as an object
  const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));
  
  // Check if sessionData and user_id exist
  if (!sessionData || !sessionData.user_id) {
    console.error('User ID not found in session data');
    return;
  }

  const user_id = sessionData.user_id; // Get the user_id from the sessionData object

  try {
    // Fetch chats from the server
    const chatResponse = await fetch('http://localhost:3000/chats');
    
    // Check if the response is successful
    if (!chatResponse.ok) {
      throw new Error('Failed to fetch chats');
    }

    // Get the list of chats in JSON format
    const chats = await chatResponse.json();
    
    // Filter chats to get those where user_id matches either chat_user_1 or chat_user_2
    const filteredChats = chats.filter(chat => chat.chat_user_1 === user_id || chat.chat_user_2 === user_id);

    // Fetch users data
    const userResponse = await fetch('http://localhost:3000/users');
    
    // Check if the response is successful
    if (!userResponse.ok) {
      throw new Error('Failed to fetch users');
    }

    // Get the list of users in JSON format
    const users = await userResponse.json();

    // Get the container where we want to display the results
    const resultContainer = document.getElementById('chat-result');
    
    // Clear any previous results in case this function is called multiple times
    resultContainer.innerHTML = '';

    // Loop through each filtered chat and create a <p> tag for its chat details
    filteredChats.forEach(chat => {
      // Find the user whose user_id matches chat_user_1 or chat_user_2 (depending on which is not user_id)
      const matchedUser = users.find(user => user.user_id === (chat.chat_user_1 === user_id ? chat.chat_user_2 : chat.chat_user_1));

      // If user found, display the chat with the user's nickname (if available) or username
      if (matchedUser) {
        const p = document.createElement('p');
        const displayName = matchedUser.user_nickname || matchedUser.user_username; // If nickname exists, use it; otherwise, use username
        p.textContent = `Chat with ${displayName}`;

        // Add event listener to show input field when user is clicked
        p.addEventListener('click', () => showMessageInput(chat.id, matchedUser.user_id));
        resultContainer.appendChild(p);
      }
    });
    
  } catch (error) {
    console.error('Error fetching chat documents or users:', error);
  }
}

// Function to show message input field when a user is clicked
function showMessageInput(chat_id, recipient_id) {
  // Get the container where the message input will appear
  const inputDiv = document.getElementById('message-input');
  
  // Create an input field and submit button
  inputDiv.innerHTML = `
      <input type="text" id="userMessage" placeholder="Type your message here" />
      <button id="submitMessage">Send Message</button>
  `;

  // Handle the submit button click
  document.getElementById('submitMessage').addEventListener('click', async () => {
      const message = document.getElementById('userMessage').value;
      const sender_id = JSON.parse(sessionStorage.getItem("sessionData")).user_id; // Sender ID from session data

      if (message.trim() !== "") {
          // Send the message to the backend API
          await sendMessageToAPI(chat_id, sender_id, recipient_id, message);
          // Clear input field after sending the message
          document.getElementById('userMessage').value = '';
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
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              chat_id: chat_id,        // Chat ID
              sender_id: sender_id,    // Sender ID
              recipient_id: recipient_id, // Recipient ID
              message: message,        // The message content
              sent_at: new Date(),     // Timestamp of the message
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

// Call the function to fetch and display chat documents
fetchChatDocuments();
