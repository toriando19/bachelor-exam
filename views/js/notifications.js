
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
    console.log('Fetched Data:', data); // Debugging: Inspect the fetched data

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

    // Build HTML for sorted notifications
    const notificationsHTML = sortedNotifications
    .map(notification => {
        const message = notification.message || 'No message available';
        const createdAt = notification.created_at
        ? new Date(notification.created_at).toLocaleString()
        : 'No date available';

        return `
        <div class="notification">
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Created At:</strong> ${createdAt}</p>
        </div>
        `;
    })
    .join(''); // Join all notifications into a single string

    // Update the DOM with sorted notifications
    if (sortedNotifications.length > 0) {
    logNotificationsDiv.innerHTML = notificationsHTML;
    } else {
    logNotificationsDiv.innerHTML = '<p>No notifications found for the current user.</p>';
    }
} catch (error) {
    console.error('Error fetching notifications:', error);
}
}

// Fetch notifications when the script loads
fetchNotifications();

