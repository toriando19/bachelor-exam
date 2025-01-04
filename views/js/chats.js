// Show the chat overlay with the input field and icebreaker when a chat is clicked
async function showMessageInput(chat_id, recipient_id, recipient_name) {
  console.log("Chat ID:", chat_id, "Recipient ID:", recipient_id, "Recipient Name:", recipient_name);

  const chatOverlay = document.getElementById('chatOverlay'); // Reference to the chat overlay
  const inputDiv = document.getElementById('message-input');
  const icebreakerDiv = document.getElementById('icebreaker'); // Reference to the icebreaker section

  // Show the chat overlay
  chatOverlay.style.display = 'block';

  // Dynamically update the chat header div with the recipient's name and nickname
  const chatHeader = document.getElementById('chatHeader');

  // Fetch the user data again to get the nickname
  const userResponse = await fetch('http://localhost:3000/users');
  if (!userResponse.ok) {
    console.error('Failed to fetch users');
    return;
  }

  const users = await userResponse.json();
  const matchedUser = users.find(user => user.user_id === recipient_id); // Find the matched user by ID

  if (matchedUser) {
    // Check if matchedUser has a nickname, and display it accordingly
    if (matchedUser.user_nickname) {
      chatHeader.innerHTML = `<div class="chatMultiNames"> <p class="chatProfileName">${matchedUser.user_username}</p><p class="chatProfileNickname">${recipient_name}</p> </div>`;
    } else {
      chatHeader.innerHTML = `<p class="chatProfileNickname">${recipient_name}</p>`;
    }
  } else {
    console.error("Matched user not found.");
    chatHeader.innerHTML = recipient_name;
  }

  // Display the input field and button
  inputDiv.innerHTML = `
    <div class="inputStyle">
      <button id="displayIcebreaker">❆</button>
      <input type="text" id="userMessage" placeholder="Aa" />
      <button id="submitMessage">Send</button>
    </div>
  `;

  // Display the icebreaker questions (fixed at the bottom)
  initializeIcebreaker();

  document.getElementById('displayIcebreaker').addEventListener('click', () => {
    const icebreakerSection = document.getElementById('icebreakerSection');
    // Check the computed style to handle cases where display is not explicitly set
    const currentDisplay = window.getComputedStyle(icebreakerSection).display;
    icebreakerSection.style.display = currentDisplay === 'none' ? 'block' : 'none';
  });  


  // Handle message submission
  document.getElementById('submitMessage').addEventListener('click', async () => {
    const message = document.getElementById('userMessage').value;
    console.log("Message Input Value:", message);

    // Only send the message if it isn't empty
    if (message.trim() !== "") {
      await sendMessageToAPI(chat_id, recipient_id, message);
      document.getElementById('userMessage').value = ''; // Clear input
    } else {
      alert("Message cannot be empty");
    }
  });
}



// Function to send message to the create-message API
async function sendMessageToAPI(chat_id, recipient_id, message) {
  console.log("Sending message:", { chat_id, recipient_id, message });
  try {
    const response = await fetch('http://localhost:3000/create-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id,
        sender_id: recipient_id, // Assuming recipient_id is the user sending the message
        recipient_id,
        message,
        sent_at: new Date(),
      }),
    });

    if (response.ok) {
      console.log("Message sent successfully");
    } else {
      console.error("Failed to send message:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

// Function to fetch and display chat documents based on the user_id
async function fetchChatDocuments() {
  try {
    const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));
    if (!sessionData || !sessionData.user_id) throw new Error('User ID not found in session data');
    
    const user_id = sessionData.user_id;
    console.log("Fetching chats for User ID:", user_id);

    // Fetch chat data for the user
    const chatResponse = await fetch('http://localhost:3000/chats');
    if (!chatResponse.ok) throw new Error('Failed to fetch chats');

    const chats = await chatResponse.json();
    const filteredChats = chats.filter(chat => chat.chat_user_1 === user_id || chat.chat_user_2 === user_id);

    // Fetch user data
    const userResponse = await fetch('http://localhost:3000/users');
    if (!userResponse.ok) throw new Error('Failed to fetch users');

    const users = await userResponse.json();
    const resultContainer = document.getElementById('chat-result');
    resultContainer.innerHTML = ''; // Clear previous results

    // Display the chats and their associated users
    filteredChats.forEach(chat => {
      const matchedUser = users.find(user => user.user_id === (chat.chat_user_1 === user_id ? chat.chat_user_2 : chat.chat_user_1));
      if (matchedUser) {
        const displayName = matchedUser.user_nickname || matchedUser.user_username;
        const p = document.createElement('p');
        p.textContent = `Chat with ${displayName}`;
        p.addEventListener('click', () => showMessageInput(chat.id, matchedUser.user_id, displayName)); // When chat is clicked, show the input
        resultContainer.appendChild(p);
      }
    });

  } catch (error) {
    console.error(error.message);
  }
}

// Call to initialize chats when the page loads
fetchChatDocuments();


// Add an onclick function to the close button to hide the profile section and overlay
document.getElementById('chatClose').addEventListener('click', function() {
  document.getElementById('chatOverlay').style.display = 'none';
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Icebreaker  ////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Array of 20 strings for icebreaker questions
const strings = [
  "What's your favorite hobby?",
  "What’s the best meal you’ve ever had?",
  "Do you have a favorite movie or TV show?",
  "What’s the most interesting book you’ve read?",
  "What’s one thing on your bucket list?",
  "What’s your favorite season of the year?",
  "Do you prefer coffee or tea?",
  "What’s the most exciting trip you’ve been on?",
  "What’s your dream job?",
  "What’s one skill you wish you could master?",
  "What’s your favorite type of music?",
  "Do you have a favorite sport or physical activity?",
  "What’s your go-to comfort food?",
  "What’s your favorite holiday tradition?",
  "Do you prefer sunrise or sunset?",
  "What’s one thing you’re grateful for today?",
];

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to shuffle and display 3 strings as icebreaker questions
function shuffleAndDisplay() {
  shuffleArray(strings);
  const selectedStrings = strings.slice(0, 3);
  const icebreakerDiv = document.getElementById('icebreaker');
  
  // Create HTML for the icebreaker questions and add event listeners to them
  icebreakerDiv.innerHTML = selectedStrings.map(str => `
    <p class="icebreaker-question">${str}</p>
  `).join('');

  // Add event listeners to the question paragraphs
  const questionElements = document.querySelectorAll('.icebreaker-question');
  questionElements.forEach(question => {
    question.addEventListener('click', () => {
      const userMessageInput = document.getElementById('userMessage');
      userMessageInput.value = question.textContent;  // Set clicked question in the input field
    });
  });
}

// Function to initialize with default set of 3 questions
function initializeIcebreaker() {
  shuffleAndDisplay();  // Call to shuffle and display the initial 3 questions
}

// Initialize the icebreaker on page load
initializeIcebreaker();

// Add event listener to the shuffle button
document.getElementById('shuffleIcebreaker').addEventListener('click', shuffleAndDisplay);

// Event listener to close the chat overlay
document.getElementById('closeChatButton').addEventListener('click', () => {
  const chatOverlay = document.getElementById('chat-overlay');
  chatOverlay.style.display = 'none';
});