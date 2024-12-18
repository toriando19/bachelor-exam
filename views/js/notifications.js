// Fetch sessionData from sessionStorage
const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));

// Function to fetch and display notifications
async function fetchNotifications() {
    try {
        const response = await fetch('http://localhost:3000/notifications');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // Parse JSON response

        const logNotificationsDiv = document.getElementById('logNotifications');

        // Ensure sessionData is valid and has a user_id
        if (!sessionData || !sessionData.user_id) {
            logNotificationsDiv.innerHTML = '<p>Error: No user data available in session.</p>';
            return;
        }

        // Filter notifications to match sessionData.user_id with either 'user_id' or 'related_user'
        const filteredNotifications = data.filter(notification => {
            const userIdMatch = String(notification.user_id) === String(sessionData.user_id);
            const relatedUserMatch = String(notification.related_user) === String(sessionData.user_id);
            return userIdMatch || relatedUserMatch; // Include if either condition is true
        });

        // Sort notifications by 'created_at' in descending order (newest first)
        const sortedNotifications = filteredNotifications.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA; // Descending order
        });

        // Build HTML for sorted notifications, bullets, and timeline
        if (sortedNotifications.length > 0) {
            const notificationsHTML = sortedNotifications
            .map((notification, index) => {
                const message = notification.message || 'No message available';
                const createdAt = notification.created_at
                    ? new Date(notification.created_at).toLocaleString()
                    : 'No date available';

                // Check if event_type is "chats", and if so, add a button
                let actionButton = '';
                let relatedUserId = null;

                if (notification.event_type === 'chats') {
                    // The user we want to start the chat with is the one who is not the current user
                    relatedUserId = notification.related_user === sessionData.user_id ? notification.user_id : notification.related_user;

                    actionButton = `
                        <button class="chat-button" data-user-id="${relatedUserId}">Start a chat with user ${relatedUserId} </button>
                    `;
                }

                return `
                <div class="notification">
                    <div class="timeline-container">
                        <div class="timeline-line"></div>
                        <div class="timeline-bullets">
                            <div class="timeline-bullet"></div>
                        </div>
                    </div>
                    <div class="notification-details">
                        <p><strong>Message:</strong> ${message}</p>
                        <p><strong>Created At:</strong> ${createdAt}</p>
                        ${actionButton}  <!-- Display button if event_type is "chat" -->
                    </div>
                </div>
                `;
            })
            .join('');

            // Insert the generated HTML into the logNotificationsDiv
            logNotificationsDiv.innerHTML = `
                <div class="notifications-container">
                    ${notificationsHTML}
                </div>
            `;

            // Add event listeners to "Start a chat" buttons
            const chatButtons = document.querySelectorAll('.chat-button');
            chatButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const userId = button.getAttribute('data-user-id');
                    startChat(userId); // Call startChat with the related user ID from the button
                });
            });
        } else {
            logNotificationsDiv.innerHTML = '<p>No notifications found for the current user.</p>';
        }

    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}

// Fetch notifications when the script loads
fetchNotifications();


// Ensure the createChat function is defined within the same file
async function createChat(chat_user_1_id, chat_user_2_id) {
    try {
        // Send GET request to the endpoint with query parameters
        const response = await fetch(`http://localhost:3000/new-chat?chat_user_1=${chat_user_1_id}&chat_user_2=${chat_user_2_id}`);

        const result = await response.json();
        console.log('Response from createChat API:', result);

        if (response.ok) {
            alert('Chat created successfully!');
        } else {
            alert(`Error creating chat: ${result.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error creating chat:', error);
        alert('Error creating chat');
    }
}

// Function to handle starting a chat
function startChat(userId) {
    // You can modify this logic depending on how you want to start the chat
    alert(`Starting a chat with user ID: ${userId}`);
    // Call createChat or any other function to initiate the chat
    createChat(sessionData.user_id, userId);  // Assuming sessionData has user_id
}
