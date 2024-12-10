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

        // Set session data with user details
        const sessionData = {
            user_id: user.user_id,
            username: user.user_username,
            user_name: user.user_name,
            user_email: user.user_email,
            user_password: user.user_password // For demonstration only (avoid storing plaintext passwords in production)
        };

        console.log('Session Data:', sessionData);

        // Store session data in localStorage
        localStorage.setItem('sessionData', JSON.stringify(sessionData));
        alert(`Login successful! Welcome ${user.user_name}`);

        // Change display properties
        document.querySelector('.application').style.display = 'block';
        document.querySelector('.login').style.display = 'none';

        // Display a welcome message in the application section
        document.querySelector('.application').innerHTML = `<h1>Welcome, ${user.user_name}!</h1>`;
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});
