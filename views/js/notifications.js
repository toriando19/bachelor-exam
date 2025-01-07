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
                const message1 = notification.message1 || 'No message available';
                const message2 = notification.message2 || 'No message available';
                const createdAt = formatTimeAgo(notification.created_at);

                // Set notification genre based on event_type
                let notificationGenre = notification.event_type === 'chats' ? 'Matches' : 'Other'; // Set genre based on event_type

                let displayMessage = '';
                let relatedUser = notification.related_user !== sessionData.user_id ?  notification.related_user : notification.user_id;
                let loggedInData = sessionData.user_id;

                if (loggedInData === sessionData.user_id) {
                    // User who started the chat sees the message in this format
                    displayMessage = `<strong> User ${relatedUser} </strong> ${message2}`;
                } 
                
                if (loggedInData === !sessionData.user_id){
                    // User who is the recipient of the chat sees the message in this format
                    displayMessage = `${message1} <strong> User ${relatedUser} </strong>`;
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
                        <div class="notiDetails"> 
                            <p class="notiCreate"> ${createdAt} </p>
                            <p class="notiTheme"> | ${notificationGenre} </p> <!-- Display the notificationGenre here -->
                        </div>

                        <!-- Display the appropriate message -->
                        <p>
                            ${displayMessage}
                        </p>
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
        } else {
            logNotificationsDiv.innerHTML = '<p>No notifications found for the current user.</p>';
        }


    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
}

// Function to format time ago
function formatTimeAgo(createdAt) {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const timeDifference = now - createdAtDate; // Difference in milliseconds

    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(timeDifference / 3600000);
    const days = Math.floor(timeDifference / 86400000);

    // Check if the time difference is less than a minute
    if (timeDifference < 60000) {
        return `<strong> Lige nu </strong>`;
    } else if (minutes < 60) {
        return `<strong> ${minutes} min </strong> siden`;
    } else if (hours < 24) {
        return `<strong> ${hours} t. </strong> siden`;
    } else if (days < 7) {
        return `<strong> ${days} dag(e) </strong> siden`;
    } else {
        return createdAtDate.toLocaleDateString(); // Show exact date if more than 7 days
    }
}


// Fetch notifications when the script loads
fetchNotifications();
