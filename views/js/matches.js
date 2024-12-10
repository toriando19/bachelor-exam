///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Explore Matches  ///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to fetch and display matching users
async function displayMatchingUsers() {
    // Get the current logged-in user's session data from sessionStorage
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData')); // Assuming it's stored as a JSON string

    if (!sessionData || !sessionData.user_id) {
        console.error('No session data or user ID found in sessionStorage.');
        return;
    }

    const currentUserId = sessionData.user_id;  // Get the logged-in user ID
    const currentUserInterests = sessionData.user_interest;  // Get the interests from session data
    const totalUserInterests = currentUserInterests.length;  // Total number of interests from session data

    try {
        // Step 1: Fetch all user interests
        const userInterestResponse = await fetch('http://localhost:3000/userinterest');
        const userInterests = await userInterestResponse.json();

        // Step 2: Find the interests of the logged-in user (user_id)
        const matchingUserInterests = [];

        // For each interest of the logged-in user, find other users who share the same interest
        currentUserInterests.forEach(interest => {
            const matchedInterests = userInterests.filter(item =>
                item.user_interest_interest == interest.user_interest_interest &&
                item.user_interest_user != currentUserId // Ensure we don't match the current user
            );
            matchingUserInterests.push(...matchedInterests); // Add the matches to the list
        });

        // Step 3: Fetch all users to get usernames
        const usersResponse = await fetch('http://localhost:3000/users');
        const users = await usersResponse.json();

        // Step 4: Find users that match the user_interest_user of the matching interests
        let matchingUsers = [];
        let userInterestCounts = {}; // To track how many interests each user shares

        matchingUserInterests.forEach(item => {
            const matchingUser = users.find(user => user.user_id == item.user_interest_user);
            if (matchingUser && !matchingUsers.some(u => u.user_id === matchingUser.user_id)) {
                matchingUsers.push(matchingUser); // Add the user if not already in the list

                // Track how many interests this user shares with the current user
                if (!userInterestCounts[matchingUser.user_id]) {
                    userInterestCounts[matchingUser.user_id] = 0;
                }
                userInterestCounts[matchingUser.user_id]++;
            }
        });

        // Step 5: Display matching users and their shared interest percentage in the <p> tag
        const exploreMatches = document.getElementById('exploreMatches');
        if (matchingUsers.length > 0) {
            let userInfo = matchingUsers.map(user => {
                const sharedInterestCount = userInterestCounts[user.user_id];
                const percentage = Math.round((sharedInterestCount / totalUserInterests) * 100); // Calculate percentage and round it
                return `${user.user_username}: ${percentage}% match`;
            }).join('<br>');

            exploreMatches.innerHTML = `${userInfo}`;
        } else {
            exploreMatches.innerHTML = 'No matching users found.';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to display matching users when the page loads
window.onload = displayMatchingUsers;
