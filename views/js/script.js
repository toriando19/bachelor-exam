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


document.getElementById("profileMenu").addEventListener("click", function() {
    // Get the profile overlay and burger menu elements
    const profileOverlay = document.getElementById("profileOverlay");
    const burgerMenu = document.getElementById("burgerMenu");
    const button = document.getElementById("hamburgerMenu");
    
    // Show the profile overlay and hide the burger menu
    profileOverlay.style.display = "block";
    burgerMenu.style.display = "none";
    button.textContent = "☰"; // Change button text back to "☰"
});

// Add an onclick function to the close button to hide the profile section and overlay
document.getElementById('profileClose').addEventListener('click', function() {
    document.getElementById('userProfileSection').style.display = 'none';
    document.getElementById('profileOverlay').style.display = 'none';
});


document.getElementById("chatsMenu").addEventListener("click", function() {
    // Get the profile overlay and burger menu elements
    const chatsOverlay = document.getElementById("chatsOverlay");
    const burgerMenu = document.getElementById("burgerMenu");
    const button = document.getElementById("hamburgerMenu");
    
    // Show the profile overlay and hide the burger menu
    chatsOverlay.style.display = "block";
    burgerMenu.style.display = "none";
    button.textContent = "☰"; // Change button text back to "☰"
});






///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// - - - -  ////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////







