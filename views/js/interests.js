window.addEventListener('load', async function () {
    try {
        // Fetch the available interests from the server
        const interestResponse = await fetch('http://localhost:3000/interests');
        if (!interestResponse.ok) {
            throw new Error('Failed to fetch interests');
        }
        const interests = await interestResponse.json();

        // Get the current session data
        const sessionData = JSON.parse(sessionStorage.getItem('sessionData'));
        if (!sessionData) {
            throw new Error('No session data found');
        }

        // Clear previous checked checkboxes
        const checkboxes = document.querySelectorAll('.user-profile input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false; // Reset checked state
        });

        // Fetch user interests from sessionData
        const userInterestsFromStorage = sessionData.user_interest || [];

        // Loop through each checkbox and assign the interest_id from the fetched data
        checkboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling; // Assumes label is right after input

            // Find the interest based on the label text
            const interest = interests.find(interest => interest.interest_name === label.textContent.trim());
            if (interest) {
                checkbox.setAttribute('data-interest-id', interest.interest_id);
            }

            // Check if the user interests contain this interest from sessionData
            const matchingUserInterest = userInterestsFromStorage.find(
                userInterest =>
                    userInterest.user_interest_interest == checkbox.getAttribute('data-interest-id') &&
                    userInterest.user_interest_user == sessionData.user_id
            );

            // If interest is in session storage, check the checkbox
            if (matchingUserInterest) {
                checkbox.checked = true;
            }

            // Listen for checkbox state change
            checkbox.addEventListener('change', function () {
                const interestId = checkbox.getAttribute('data-interest-id');
                const isChecked = checkbox.checked;

                // Update sessionData.user_interest dynamically
                if (isChecked) {
                    // Add interest if checkbox is checked and not already in sessionData
                    const isAlreadyInSession = sessionData.user_interest.some(
                        userInterest =>
                            userInterest.user_interest_interest == interestId &&
                            userInterest.user_interest_user == sessionData.user_id
                    );

                    if (!isAlreadyInSession) {
                        sessionData.user_interest.push({
                            user_interest_user: sessionData.user_id,
                            user_interest_interest: interestId
                        });
                    }
                } else {
                    // Remove interest if checkbox is unchecked
                    sessionData.user_interest = sessionData.user_interest.filter(
                        userInterest => userInterest.user_interest_interest != interestId
                    );
                }

                // Update sessionStorage with the modified sessionData
                sessionStorage.setItem('sessionData', JSON.stringify(sessionData));
            });
        });
    } catch (error) {
        console.error('Error:', error);
    }
});
