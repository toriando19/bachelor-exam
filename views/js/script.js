///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Hamburger Menu  ////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("hamburgerMenu").addEventListener("click", function() {
    // Get the burger menu and button
    const burgerMenu = document.getElementById("burgerMenu");
    const button = document.getElementById("hamburgerMenu");

    // Toggle the display of the burger menu
    if (burgerMenu.style.display === "none" || burgerMenu.style.display === "") {
        burgerMenu.style.display = "block";
        button.textContent = "x"; // Change button text to "X"
    } else {
        burgerMenu.style.display = "none";
        button.textContent = "☰"; // Change button text back to "☰"
    }
});

// Add event listeners for both frontpageMenu and frontpageLogo
document.getElementById("frontpageMenu").addEventListener("click", handleFrontPageClick);
document.getElementById("frontpageLogo").addEventListener("click", handleFrontPageClick);

// Define the function to handle the clicks
function handleFrontPageClick() {
    // Get the profile overlay and burger menu elements
    const profileOverlay = document.getElementById("profileOverlay");
    const chatsOverlay = document.getElementById("chatsOverlay");
    const chatOverlay = document.getElementById("chatOverlay");
    const burgerMenu = document.getElementById("burgerMenu");
    const button = document.getElementById("hamburgerMenu");

    // Hide all overlays and the burger menu
    profileOverlay.style.display = "none";
    burgerMenu.style.display = "none";
    chatsOverlay.style.display = "none";
    chatOverlay.style.display = "none";
    button.textContent = "☰"; 
}



document.getElementById("profileMenu").addEventListener("click", function() {
    const profileOverlay = document.getElementById("profileOverlay");
    const userProfileSection = document.getElementById("userProfileSection");
    const burgerMenu = document.getElementById("burgerMenu");
    const button = document.getElementById("hamburgerMenu");
    
    // Show profile overlay and section, hide burger menu
    profileOverlay.style.display = "block";
    userProfileSection.style.display = "block"; // Ensure this is visible
    burgerMenu.style.display = "none";
    button.textContent = "☰"; // Change button text back to "☰"
});

document.getElementById('profileClose').addEventListener('click', function() {
    const profileOverlay = document.getElementById('profileOverlay');
    const userProfileSection = document.getElementById('userProfileSection');
    
    // Hide profile section and overlay
    profileOverlay.style.display = 'none';
    userProfileSection.style.display = 'none';
});



document.getElementById("chatsMenu").addEventListener("click", function() {
    // Get the profile overlay and burger menu elements
    const chatsOverlay = document.getElementById("chatsOverlay");
    const profileOverlay = document.getElementById("profileOverlay");
    const chatOverlay = document.getElementById("chatOverlay");
    const burgerMenu = document.getElementById("burgerMenu");
    const button = document.getElementById("hamburgerMenu");
    
    // Show the profile overlay and hide the burger menu
    chatsOverlay.style.display = "block";
    profileOverlay.style.display = "none";
    chatOverlay.style.display = "none";
    burgerMenu.style.display = "none";
    button.textContent = "☰"; // Change button text back to "☰"
});

// Add an onclick function to the close button to hide the profile section and overlay
document.getElementById('chatsClose').addEventListener('click', function() {
    document.getElementById('chatsOverlay').style.display = 'none';
});



document.getElementById("chatMenu").addEventListener("click", function() {
    // Get the profile overlay and burger menu elements
    const profileOverlay = document.getElementById("profileOverlay");
    const chatsOverlay = document.getElementById("chatsOverlay");
    const chatOverlay = document.getElementById("chatOverlay");
    const burgerMenu = document.getElementById("burgerMenu");
    const button = document.getElementById("hamburgerMenu");
    
    // Show the profile overlay and hide the burger menu
    chatOverlay.style.display = "block";
    profileOverlay.style.display = "none";
    chatsOverlay.style.display = "none";
    burgerMenu.style.display = "none";
    button.textContent = "☰"; // Change button text back to "☰"
});

// Add an onclick function to the close button to hide the profile section and overlay
document.getElementById('chatClose').addEventListener('click', function() {
    document.getElementById('chatOverlay').style.display = 'none';
});







///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// - - - -  ////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////







