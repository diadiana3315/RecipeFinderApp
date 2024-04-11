// add ingredient search bar
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Ingredient';
    addButton.className = 'btn btn-primary';
    addButton.type = 'button';
    addButton.id = 'add-ingredient';

    const ingredientContainer = document.getElementById('ingredient-container');

    addButton.addEventListener('click', function() {
        const inputGroup = createInputGroup();
        ingredientContainer.appendChild(inputGroup);
    });

    const form = document.getElementById('search-form');
    form.insertBefore(addButton, form.lastElementChild);

    function createInputGroup() {
        const inputGroup = document.createElement('div');
        inputGroup.classList.add('input-group', 'mb-3');

        const input = document.createElement('input');
        input.type = 'text';
        input.classList.add('form-control');
        input.placeholder = 'Enter another ingredient...';
        input.name = 'ingredient';

        const removeButton = document.createElement('button');
        removeButton.classList.add('btn', 'btn-default', 'remove-ingredient');
        removeButton.type = 'button';
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            if (this.parentNode.parentNode.firstElementChild === this.parentNode){
                inputField.value = '';
            } else {
                inputGroup.remove();
            }
        });

        const span = document.createElement('span');
        span.classList.add('input-group-btn');
        span.appendChild(removeButton);

        inputGroup.appendChild(input);
        inputGroup.appendChild(span);

        return inputGroup;
    }
});
// ----------------------------------------------------------------------------------------
// API call
const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
let searchQuery = '';
const APP_ID = '06fd947f';
const APP_KEY = '74a178d35a849d31def7a5b2eea61e74';

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('#search-form');

    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const ingredients = Array.from(document.querySelectorAll('input[name="ingredient"]'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');

        const cuisineType = document.querySelector('.container2 .dropdown:nth-of-type(1) .textBox').value.toLowerCase();
        const mealType = document.querySelector('.container2 .dropdown:nth-of-type(2) .textBox').value.toLowerCase();
        const dietType = document.querySelector('.container2 .dropdown:nth-of-type(3) .textBox').value;

        const filteredRecipes = await fetchRecipes(ingredients, cuisineType, mealType, dietType);
        console.log("Filtered recipes:", filteredRecipes);
        // Display filtered recipes
        displayRecipes(filteredRecipes);

        resetSearchBar();
        resetFilters();
    });

    // Function to reset the search bar
    function resetSearchBar() {
        const ingredientInputs = document.querySelectorAll('input[name="ingredient"]');
        ingredientInputs.forEach(input => {
            input.value = '';
        });
    }

    // Function to reset the filters
    function resetFilters() {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const textBox = dropdown.querySelector('.textBox');
            textBox.value = '';
        });
    }

    // Event listeners to clear filter values when clicking on them
    const filterTextBoxes = document.querySelectorAll('.dropdown .textBox');
    filterTextBoxes.forEach(textBox => {
        textBox.addEventListener('click', function() {
            // Clear the value when clicking on the filter text box
            this.value = '';
        });
    });

});


async function fetchRecipes(ingredients, cuisineType, mealType, dietType) {
    // const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20`;
    const baseURL = `https://api.edamam.com/search?q=${encodeURIComponent(ingredients.join('+'))}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20`;

    try {
        const response = await fetch(baseURL);
        const data = await response.json();

        return data.hits.filter(hit => {
            const recipe = hit.recipe;

            // Check if all selected ingredients are present in the recipe
            const hasAllIngredients = ingredients.every(ingredient =>
                recipe.ingredients.some(item => item.text.toLowerCase().includes(ingredient.toLowerCase()))
            );

            // Check if cuisineType, mealType, and dietType match
            const isCuisineMatch = !cuisineType || recipe.cuisineType.includes(cuisineType);
            const isMealTypeMatch = !mealType || recipe.mealType.includes(mealType);
            const isDietTypeMatch = !dietType || recipe.healthLabels.includes(dietType);

            return hasAllIngredients && isCuisineMatch && isMealTypeMatch && isDietTypeMatch;
        });

    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

// ----------------------------------------------------------------------------------------
// generate HTML
function displayRecipes(filteredRecipes) {
    const searchResultDiv = document.querySelector('.search-result');

    if (filteredRecipes.length === 0) {
        searchResultDiv.innerHTML = '<p>No recipes found.</p>';
        return;
    }
    console.log('Filtered Recipes:', filteredRecipes);

    const generatedHTML = filteredRecipes.map(hit => {
        const recipe = hit.recipe;
        const filteredHealthLabels = recipe.healthLabels.filter(label => {
            return ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Egg-Free', 'Soy-Free', 'Alcohol-Free'].includes(label);
        });

        return `
            <div class="item">
                <img src="${recipe.image}" alt="Recipe Image">
                <div class="flex-container">
                    <h1 class="title">${recipe.label}</h1>
                    <a class="view-button" href="${recipe.url}" target="_blank">View recipe</a>
                    <ion-icon name="heart-outline" onclick="addToFavorites('${recipe.label}')"></ion-icon>
                </div>
                <p class="item-data">Cuisine type: ${recipe.cuisineType}</p>
                <p class="item-data">Meal type: ${recipe.mealType}</p>
                <p class="item-data">Diet type: ${filteredHealthLabels.join(', ')}</p>
            </div>
        `;
    }).join('');

    searchResultDiv.innerHTML = generatedHTML;
}

// ----------------------------------------------------------------------------------------
// filter dropdowns
document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the class 'filter-option'
    const dropdowns = document.querySelectorAll('.dropdown');

    // Add event listeners to each dropdown
    dropdowns.forEach(dropdown => {
        // Select filter options within each dropdown
        const filterOptions = dropdown.querySelectorAll('.filter-option');

        // Add event listeners to each filter option
        filterOptions.forEach(option => {
            option.addEventListener('click', function() {
                const value = this.textContent;
                show(value);
            });
        });

        // Define the show function
        function show(value) {
            dropdown.querySelector('.textBox').value = value;
        }
        dropdown.onclick = function() {
            dropdown.classList.toggle('active');
        }
    });
});

// ----------------------------------------------------------------------------------------
// JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Select the heart icon
    const heartIcon = document.getElementById('heart-icon');

    // Add click event listener to the heart icon
    heartIcon.addEventListener('click', function() {
        // Redirect to the favorites page
        window.location.href = 'favorites.html';
    });
});


// function addToFavorites(recipeLabel) {
//     let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
//     const existingIndex = favorites.findIndex(fav => fav.label === recipeLabel);
//
//     if (existingIndex === -1) {
//         favorites.push({ label: recipeLabel });
//         localStorage.setItem('favorites', JSON.stringify(favorites));
//         alert('Recipe added to favorites!');
//     } else {
//         alert('Recipe already in favorites!');
//     }
// }

function addToFavorites(recipeLabel) {
    const user = auth.currentUser; // Get the current user
    if (!user) {
        alert('Please log in to add favorites.');
        return;
    }

    const userFavoritesRef = ref(database, 'userFavorites/' + user.uid); // Reference to the user's favorites

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
