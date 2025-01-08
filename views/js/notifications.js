// Fetch sessionData from sessionStorage
const sessionData = JSON.parse(sessionStorage.getItem("sessionData"));

// Function to fetch and display notifications
async function fetchNotifications() {
    try {
        // Fetch notifications and messages from respective endpoints
        const notificationsResponse = await fetch('http://localhost:3000/notifications');
        const messagesResponse = await fetch('http://localhost:3000/messages');

        if (!notificationsResponse.ok || !messagesResponse.ok) {
            throw new Error(`HTTP error! Status: ${notificationsResponse.status} or ${messagesResponse.status}`);
        }

        const notificationsData = await notificationsResponse.json();
        const messagesData = await messagesResponse.json();

        const logNotificationsDiv = document.getElementById('logNotifications');

        // Ensure sessionData is valid and has a user_id
        if (!sessionData || !sessionData.user_id) {
            logNotificationsDiv.innerHTML = '<p>Error: No user data available in session.</p>';
            return;
        }

        // Combine notifications and messages data
        const allData = [...notificationsData, ...messagesData];

        // Filter notifications to match sessionData.user_id with either 'user_id' or 'related_user'
        const filteredNotifications = allData.filter(item => {
            const userIdMatch = String(item.user_id) === String(sessionData.user_id);
            const relatedUserMatch = String(item.related_user) === String(sessionData.user_id);
            return userIdMatch || relatedUserMatch;
        });

        // Sort notifications by 'created_at' in descending order (newest first)
        const sortedNotifications = filteredNotifications.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
        });

        // Build HTML for sorted notifications
        if (sortedNotifications.length > 0) {
            const notificationsHTML = sortedNotifications
                .map((item) => {
                    let displayMessage = '';
                    const createdAt = formatTimeAgo(item.created_at);

                    // Check if the item is a message or a general notification
                    if (item.event_type === 'Beskeder') {
                        // Message notification format
                        displayMessage = `<strong>User ${item.user_id}:</strong> "${item.message}"`;
                    } else {
                        // Other notification format
                        const message1 = item.message1 || 'No message available';
                        const message2 = item.message2 || 'No message available';

                        let relatedUser = item.related_user !== sessionData.user_id ? item.related_user : item.user_id;
                        let loggedInData = sessionData.user_id;

                        if (loggedInData === sessionData.user_id) {
                            displayMessage = `<strong>User ${relatedUser}</strong> ${message2}`;
                        } else {
                            displayMessage = `${message1} <strong>User ${relatedUser}</strong>`;
                        }
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
                                <p class="notiCreate">${createdAt}</p>
                                <p class="notiTheme">${item.event_type || 'unknown'}</p>
                            </div>
                            <p>${displayMessage}</p>
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
