document.addEventListener('DOMContentLoaded', function() {
    // Select the heart icon
    const houseIcon = document.getElementById('home-outline');

    // Add click event listener to the heart icon
    houseIcon.addEventListener('click', function() {
        // Redirect to the favorites page
        window.location.href = 'webapp.html';
    });
});


export function addToFavorites(recipeLabel) {
    const user = auth.currentUser; // Get the current user
    if (!user) {
        alert('Please log in to add favorites.');
        return;
    }

    const userUid = user.uid; // Get the user's UID

    const userFavoritesRef = ref(database, 'userFavorites/' + userUid); // Reference to the user's favorites

    // Check if the recipe already exists in the user's favorites
    get(userFavoritesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userFavorites = snapshot.val();
                if (userFavorites.hasOwnProperty(recipeLabel)) {
                    alert('Recipe already in favorites!');
                    return;
                }
            }

            // If the recipe doesn't exist, add it to the user's favorites
            update(ref(userFavoritesRef), {
                [recipeLabel]: true
            }).then(() => {
                alert('Recipe added to favorites!');
            }).catch((error) => {
                console.error('Error adding recipe to favorites:', error);
                alert('Failed to add recipe to favorites.');
            });
        })
        .catch((error) => {
            console.error('Error checking user favorites:', error);
            alert('Failed to add recipe to favorites.');
        });
}

export function displayFavorites(userUid) {
    const userFavoritesRef = ref(database, 'userFavorites/' + userUid);

    // Fetch user's favorite recipes from the database
    get(userFavoritesRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userFavorites = snapshot.val();

                // If the user has favorite recipes, generate HTML to display them
                const favoriteRecipesHTML = Object.keys(userFavorites).map(recipeLabel => {
                    // Generate HTML for each favorite recipe
                    return `
                        <div class="favorite-item">
                            <h2>${recipeLabel}</h2>
                            <!-- Add more details about the recipe here if needed -->
                        </div>
                    `;
                }).join('');

                // Display favorite recipes on the page
                const favoritesContainer = document.querySelector('.favorites-container');
                favoritesContainer.innerHTML = favoriteRecipesHTML;
            } else {
                // If the user has no favorite recipes, display a message
                const favoritesContainer = document.querySelector('.favorites-container');
                favoritesContainer.innerHTML = '<p>No favorite recipes found.</p>';
            }
        })
        .catch((error) => {
            console.error('Error fetching user favorites:', error);
            // Display an error message on the page if fetching favorites fails
            const favoritesContainer = document.querySelector('.favorites-container');
            favoritesContainer.innerHTML = '<p>Error fetching favorite recipes.</p>';
        });
}

