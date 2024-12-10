///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Login Function  ////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelector('#loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission refresh

    // Get the input values
    const email = document.querySelector('#email').value.trim(); // Use `user_email` from DB
    const password = document.querySelector('#password').value.trim(); // Use `user_password` from DB

    try {
        // Fetch user data from the PostgreSQL backend
        const response = await fetch('http://localhost:3000/users');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const users = await response.json(); // Assume the data is an array of user objects
        // Match using the correct keys from the DB
        const user = users.find(u => u.user_email === email && u.user_password === password);

        if (!user) {
            alert('Invalid credentials');
            return;
        }

        // Fetch user interests data
        const interestResponse = await fetch('http://localhost:3000/userinterest');
        if (!interestResponse.ok) {
            throw new Error('Failed to fetch user interests');
        }

        const userInterests = await interestResponse.json();
        
        // Filter the interests based on the logged-in user_id (make sure to compare numbers)
        const userInterest = userInterests.filter(interest => parseInt(interest.user_interest_user) === user.user_id);

        // Set session data with user details and user interests (without console log)
        const sessionData = {
            user_id: user.user_id,
            username: user.user_username,
            user_name: user.user_name,
            user_email: user.user_email,
            user_password: user.user_password, // For demonstration only (avoid storing plaintext passwords in production)
            user_interest: userInterest // Add user interests to the session data
        };

        // Store session data in sessionStorage
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));

        // Clear input fields after login
        document.querySelector('#email').value = '';
        document.querySelector('#password').value = '';

        // Change display properties
        document.querySelector('.application').style.display = 'block';
        document.querySelector('.login').style.display = 'none';

        // Display a welcome message in the application section
        document.querySelector('#welcomeUser').innerHTML = `Welcome, ${user.user_name}!`;  // Update welcome message
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Logout Function  ///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.querySelector('#logoutBtn').addEventListener('click', function () {
    const confirmLogout = confirm('You sure you wanna logout?'); // Confirm the logout action

    if (confirmLogout) {
        // Delete session data from sessionStorage
        sessionStorage.removeItem('sessionData');

        // Redirect to login screen and hide application section
        document.querySelector('.application').style.display = 'none';
        document.querySelector('.login').style.display = 'block';

        // Clear input fields on logout
        document.querySelector('#email').value = '';
        document.querySelector('#password').value = '';
    }
});

// Prevent unauthorized access to the application section
window.addEventListener('load', function () {
    const sessionData = sessionStorage.getItem('sessionData');
    if (!sessionData) {
        // If no session data, ensure only the login form is visible
        document.querySelector('.application').style.display = 'none';
        document.querySelector('.login').style.display = 'block';
    }
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check for Session on Load  ////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener('load', function () {
    const sessionData = sessionStorage.getItem('sessionData');
    if (sessionData) {
        // If session data exists, show the application and hide the login form
        document.querySelector('.application').style.display = 'block';
        document.querySelector('.login').style.display = 'none';

        // Get session data and display welcome message
        const userData = JSON.parse(sessionData);
        document.querySelector('#welcomeUser').innerHTML = `Welcome, ${userData.user_name}!`;

        // Access the user interests directly from sessionData
        const userInterests = userData.user_interest;
        // if (userInterests.length > 0) {
        //     // You can use the interests here, e.g., display them or store them for later use
        // }
    } else {
        // If no session data, show only the login form
        document.querySelector('.application').style.display = 'none';
        document.querySelector('.login').style.display = 'block';
    }
});
