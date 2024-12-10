///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Checkbox match the id of interest  /////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

window.addEventListener('load', async function() {
    try {
        // Fetch the user interests from the server
        const userInterestResponse = await fetch('http://localhost:3000/userinterest');
        if (!userInterestResponse.ok) {
            throw new Error('Failed to fetch user interests');
        }
        const userInterests = await userInterestResponse.json(); // Get user interests

        // Fetch the available interests from the server
        const interestResponse = await fetch('http://localhost:3000/interests');
        if (!interestResponse.ok) {
            throw new Error('Failed to fetch interests');
        }
        const interests = await interestResponse.json(); // Get available interests

        // Map through the checkboxes and assign the interest_id from the fetched data
        const checkboxes = document.querySelectorAll('.user-profile input[type="checkbox"]');
        
        // Loop through each checkbox and assign the interest_id based on label text
        checkboxes.forEach(checkbox => {
            // Get the label text corresponding to each checkbox
            const label = checkbox.nextElementSibling;  // Assumes label is right after input
            
            // Find the interest based on the label text
            const interest = interests.find(interest => interest.interest_name === label.textContent.trim());

            // If the interest exists, set the `data-interest-id` attribute to the checkbox
            if (interest) {
                checkbox.setAttribute('data-interest-id', interest.interest_id);
            }

            // Check if the user interests contain this interest
            const matchingUserInterest = userInterests.find(userInterest => userInterest.user_interest_interest == checkbox.getAttribute('data-interest-id'));
            
            // If there's a match, check the checkbox
            if (matchingUserInterest) {
                checkbox.checked = true;
            }
        });
    } catch (error) {
        console.error('Error:', error);
    }
});



