///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Explore Matches  ///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function displayMatchingUsers() {
    const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));

    if (!sessionData || !sessionData.user_id) {
        console.error('No session data or user ID found in sessionStorage.');
        return;
    }

    const currentUserId = sessionData.user_id;
    const currentUserInterests = sessionData.user_interest.map(interest => interest.user_interest_interest);

    try {
        // Fetch all user interests from the backend
        const userInterestResponse = await fetch('http://localhost:3000/userinterest');
        const userInterests = await userInterestResponse.json();

        // Fetch all users from the backend
        const usersResponse = await fetch('http://localhost:3000/users');
        const users = await usersResponse.json();

        // Fetch all chats from the backend to check if a chat already exists
        const chatsResponse = await fetch('http://localhost:3000/chats');
        const chats = await chatsResponse.json();

        const matchingUsers = {};

        // Loop through all interests to find matching users
        userInterests.forEach(interest => {
            // Exclude the current user from matching
            if (currentUserInterests.includes(interest.user_interest_interest) && interest.user_interest_user !== currentUserId) {
                if (!matchingUsers[interest.user_interest_user]) {
                    matchingUsers[interest.user_interest_user] = {
                        sharedInterests: 0,
                        totalInterests: 0,
                        latestTimestamp: null,
                        matchingInterests: [], // Track specific matching interests
                    };
                }
                matchingUsers[interest.user_interest_user].sharedInterests++;
                matchingUsers[interest.user_interest_user].matchingInterests.push(interest.user_interest_interest);  // Store matching interest
                
                // Store the most recent timestamp
                const currentInterestTime = new Date(interest.current_time).getTime();
                if (!matchingUsers[interest.user_interest_user].latestTimestamp || currentInterestTime > matchingUsers[interest.user_interest_user].latestTimestamp) {
                    matchingUsers[interest.user_interest_user].latestTimestamp = currentInterestTime;
                }
            }
        });

        // Calculate match percentage for each user
        Object.keys(matchingUsers).forEach(userId => {
            matchingUsers[userId].totalInterests = userInterests.filter(item => item.user_interest_user == userId).length;
        });

        // Sort the users by percentage match in descending order
        const sortedMatchingUsers = Object.keys(matchingUsers)
            .map(userId => ({
                userId,
                percentage: Math.round((matchingUsers[userId].sharedInterests / (currentUserInterests.length + matchingUsers[userId].totalInterests - matchingUsers[userId].sharedInterests)) * 100),
                latestTimestamp: matchingUsers[userId].latestTimestamp,
                matchingInterests: matchingUsers[userId].matchingInterests,  // Include matching interests in the sort result
            }))
            .sort((a, b) => b.percentage - a.percentage);

        const exploreMatches = document.getElementById('exploreMatches');
        exploreMatches.innerHTML = ''; // Clear previous content

        // Check if the latest update was within the last 2 minutes (120000ms)
        const currentTime = new Date().getTime();

        sortedMatchingUsers.forEach(({ userId, percentage, latestTimestamp, matchingInterests }) => {
            const matchingUser = users.find(user => user.user_id == userId);

            // Skip if the user is the current user or if a chat already exists
            if (matchingUser.user_id === currentUserId) {
                return; // Ignore the current user
            }

            const chatExists = chats.some(chat => 
                (chat.chat_user_1 === currentUserId && chat.chat_user_2 === matchingUser.user_id) || 
                (chat.chat_user_1 === matchingUser.user_id && chat.chat_user_2 === currentUserId)
            );

            // Skip the match if a chat already exists
            if (chatExists) {
                return;
            }

            const matchContainer = document.createElement('div');
            matchContainer.classList.add('match-container');

            let showSuperMatch = false;
            let showNewMatch = false;
            let showMatch = false;

            if (percentage === 100) {
                showSuperMatch = true;
            } else if (latestTimestamp && (currentTime - latestTimestamp <= 120000)) {
                showNewMatch = true;
            } else {
                showMatch = true;
            }

            if (showSuperMatch) {
                const superMatch = document.createElement('h4');
                superMatch.textContent = 'Super Match';
                superMatch.classList.add('superMatch');
                matchContainer.appendChild(superMatch);
            } else if (showNewMatch) {
                const newMatch = document.createElement('h4');
                newMatch.textContent = 'Nyt match';
                newMatch.classList.add('newMatch');
                matchContainer.appendChild(newMatch);
            } else if (showMatch) {
                const matchLabel = document.createElement('h4');
                matchLabel.textContent = 'Match';
                matchLabel.classList.add('simpleMatch');
                matchContainer.appendChild(matchLabel);
            }

            // Show match percentage
            const userInfo = document.createElement('p');
            userInfo.textContent = `${percentage}% match`;
            matchContainer.appendChild(userInfo);

            // Show the matching interests
            const interestList = document.createElement('ul');
            matchingInterests.forEach(interestId => {
                const interestDescription = userInterests.find(interest => interest.user_interest_interest === interestId);
                const listItem = document.createElement('li');
                listItem.textContent = interestDescription ? interestDescription.user_interest_interest : 'Unknown Interest';
                interestList.appendChild(listItem);
            });
            matchContainer.appendChild(interestList);

            const viewButton = document.createElement('button');
            viewButton.classList.add('match-view');
            viewButton.textContent = 'Se match';
            viewButton.onclick = () => {
                viewUserInfo(matchingUser.user_username, percentage, matchingInterests);
            };

            const chatButton = document.createElement('button');
            chatButton.textContent = 'Chat';
            chatButton.classList.add('match-chat');
            chatButton.onclick = () => {
                alert(`You're starting a chat with ${matchingUser.user_username}`);
                createChat(currentUserId, matchingUser.user_id);
            };

            matchContainer.appendChild(viewButton);
            matchContainer.appendChild(chatButton);

            exploreMatches.appendChild(matchContainer);
        });

        if (sortedMatchingUsers.length === 0) {
            exploreMatches.innerHTML = 'No matching users found.';
        }

    } catch (error) {
        console.error('Error fetching data:', error);
        alert('An error occurred while fetching matching users.');
    }
}






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Update Timestamp after Changes in Interests ///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Call this function when a user updates their preferences
function updateInterestTimestamp() {
    const currentTime = new Date().toISOString();
    sessionStorage.setItem('lastUpdateTimestamp', currentTime);
    console.log('Timestamp updated: ', currentTime);
}



window.onload = displayMatchingUsers;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create Chat  ///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function createChat(chat_user_1_id, chat_user_2_id) {
    try {
        // Send GET request to the endpoint with query parameters
        const response = await fetch(`http://localhost:3000/new-chat?chat_user_1=${chat_user_1_id}&chat_user_2=${chat_user_2_id}`);

        const result = await response.json();
        console.log('Response from createChat API:', result);

        // Check if chat already exists
        if (result.message === 'Chat already exists') {
            alert('Chat already exists with this user!');
        } else if (response.ok) {
            // If chat creation is successful
            alert('Chat created successfully!');

            // Reload the content by calling displayMatchingUsers
            displayMatchingUsers();

            // Hide the specific match overlay
            const matchOverlay = document.getElementById('specificMatchOverlay');
            if (matchOverlay) {
                matchOverlay.style.display = 'none';
            }

            // Set the active menu to the frontpage
            setActiveMenu("frontpageMenu");
        } else {
            // Handle any other errors
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

async function viewUserInfo(username, matchPercentage) {
    try {
        const sessionData = JSON.parse(sessionStorage.getItem('sessionData')); // Get session data here
        if (!sessionData || !sessionData.user_id) {
            console.error('No session data or user ID found in sessionStorage.');
            return;
        }

        const currentUserId = sessionData.user_id; // Now we have the currentUserId inside this function

        const usersResponse = await fetch('http://localhost:3000/users');
        const users = await usersResponse.json();

        const user = users.find(user => user.user_username === username);

        if (!user) {
            alert('User not found.');
            return;
        }

        const userId = user.user_id; // Get the user_id of the matched user

        const userInterestResponse = await fetch('http://localhost:3000/userinterest');
        const userInterests = await userInterestResponse.json();

        const matchedInterests = userInterests.filter(interest => interest.user_interest_user === userId);

        const interestsResponse = await fetch('http://localhost:3000/interests');
        const interests = await interestsResponse.json();

        const interestDescriptions = matchedInterests.map(matchedInterest => {
            const interest = interests.find(i => i.interest_id === matchedInterest.user_interest_interest);
            return interest ? interest.interest_description : 'Unknown Interest';
        });

        const userInfoSection = document.getElementById('userInfoSection');
        if (!userInfoSection) {
            console.error('User info section element not found.');
            alert('User info section is missing in the UI.');
            return;
        }

        // Clear previous content inside the userInfoSection and append the user info along with the chat button
        userInfoSection.innerHTML = `
            <div class="match-overlay-header">
                <button id="specficMatchClose" class="match-overlay-close"> < </button> <!-- replace with icon-image -->
                <div class="profileContainer">
                    <img class="profilePicture" src="img/profile.jpg" alt="logo">
                    <h1 class="overlay-h1"> ${user.user_username} </h1>
                </div>
            </div>
            <div class="specificMatch-info">
                <div class="match-overall-percentage">
                    <h3> Fælles Interesser </h3>
                    <p> ${matchPercentage}% </p>
                </div>
                <div class="match-progress-bar">
                    <div class="filled" style="width: ${matchPercentage}%;"></div>
                </div>

                <br>

                <p><strong>User Interests:</strong></p>
                <ul>
                    ${interestDescriptions.map(description => `<li>${description}</li>`).join('')}
                </ul>


                <br><br>

                <button id="startChatButton" class="chat-start-button"> Start en chat med ${user.user_username} </button>
            
            </div>
            
        `;

        // Add event listener to the chat button
        const chatButton = document.getElementById('startChatButton');
        chatButton.onclick = () => {
            alert(`You're starting a chat with ${user.user_username}`);
            createChat(currentUserId, user.user_id);  // Now we are sure currentUserId is available here
        };

        // Show the overlay
        document.getElementById('specificMatchOverlay').style.display = 'block';

        // Add the event listener for the close button inside this function
        const closeButton = document.getElementById('specficMatchClose');
        closeButton.addEventListener('click', function() {
            const matchOverlay = document.getElementById('specificMatchOverlay');

            // Hide profile section and overlay
            matchOverlay.style.display = 'none';

            // Set the active menu back to the "frontpageMenu"
            setActiveMenu("frontpageMenu");
        });

    } catch (error) {
        console.error('Error fetching user info:', error);
        alert('Error fetching user info.');
    }
}









