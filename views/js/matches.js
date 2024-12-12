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
    const currentUserUsername = sessionData.user_username;  // Get the logged-in user's username from sessionStorage
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
        exploreMatches.innerHTML = ''; // Clear previous content
        if (matchingUsers.length > 0) {
            matchingUsers.forEach(user => {
                const sharedInterestCount = userInterestCounts[user.user_id];
                const percentage = Math.round((sharedInterestCount / totalUserInterests) * 100); // Calculate percentage and round it

                // Create a container for each match
                const matchContainer = document.createElement('div');
                matchContainer.classList.add('match-container');

                // Add user info and percentage
                const userInfo = document.createElement('p');
                userInfo.textContent = `${user.user_username} – ${percentage}%`;
                matchContainer.appendChild(userInfo);

                // Create a button for viewing user info
                const viewButton = document.createElement('button');
                viewButton.textContent = 'View Profile';
                
                // Add event listener to display user info when the button is clicked
                viewButton.onclick = () => {
                    viewUserInfo(user.user_username, percentage); // Pass username and percentage
                };

                // Create a button for initiating chat
                const chatButton = document.createElement('button');
                chatButton.textContent = 'Chat';
                
                // Add event listener to create a new chat when the button is clicked
                chatButton.onclick = () => {
                    alert(`You're starting a chat with ${user.user_username}`);
                    createChat(currentUserUsername, user.user_username);  // Pass usernames instead of IDs
                };

                // Append buttons to the container
                matchContainer.appendChild(viewButton);
                matchContainer.appendChild(chatButton);

                // Append the container to the DOM
                exploreMatches.appendChild(matchContainer);
            });
        } else {
            exploreMatches.innerHTML = 'No matching users found.';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call the function to display matching users when the page loads
window.onload = displayMatchingUsers;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create Chat  ///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function createChat(chat_user_1, chat_user_2) {
    try {
        const response = await fetch('http://localhost:3000/new-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_user_1: chat_user_1,  // Now using usernames instead of IDs
                chat_user_2: chat_user_2,  // Now using usernames instead of IDs
            }),
        });

        // Check if the response is ok and log the result
        const result = await response.json();
        console.log('Response from createChat API:', result); // Log the response for debugging
        
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

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// View User Info //////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to fetch and display user info in a separate section
async function viewUserInfo(username, matchPercentage) {
    try {
        // Fetch all users to find the matching username
        const usersResponse = await fetch('http://localhost:3000/users');
        const users = await usersResponse.json();

        // Find the user matching the given username
        const user = users.find(user => user.user_username === username);

        if (!user) {
            alert('User not found.');
            return;
        }

        const userId = user.user_id; // Get the user_id of the matched user

        // Fetch user interests for the clicked user
        const userInterestResponse = await fetch('http://localhost:3000/userinterest');
        const userInterests = await userInterestResponse.json();

        // Filter interests of the clicked user
        const matchedInterests = userInterests.filter(interest => interest.user_interest_user === userId);

        // Fetch all interests to get the descriptions
        const interestsResponse = await fetch('http://localhost:3000/interests');
        const interests = await interestsResponse.json();

        const interestDescriptions = matchedInterests.map(matchedInterest => {
            const interest = interests.find(i => i.interest_id === matchedInterest.user_interest_interest);
            return interest ? interest.interest_description : 'Unknown Interest';
        });

        // Display the user's information and interests in a designated section
        const userInfoSection = document.getElementById('userInfoSection');
        if (!userInfoSection) {
            console.error('User info section element not found.');
            alert('User info section is missing in the UI.');
            return;
        }

        userInfoSection.innerHTML = `
            <h3>User Info</h3>
            <p><strong>Username:</strong> ${user.user_username}</p>
            <p><strong>Percent Match:</strong> ${matchPercentage}%</p> <!-- Reuse passed match percentage -->
            <p><strong>User Interests:</strong></p>
            <ul>
                ${interestDescriptions.map(description => `<li>${description}</li>`).join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Error fetching user info.');
    }
}



