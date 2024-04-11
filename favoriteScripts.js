document.addEventListener('DOMContentLoaded', function() {
    // Select the heart icon
    const houseIcon = document.getElementById('home-outline');

    // Add click event listener to the heart icon
    houseIcon.addEventListener('click', function() {
        // Redirect to the favorites page
        window.location.href = 'webapp.html';
    });
});
