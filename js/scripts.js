// add ingredient search bar
document.addEventListener('DOMContentLoaded', function() {
    const addButton = document.querySelector('#add-ingredient')
    const ingredientContainer = document.getElementById('ingredient-container');

    addButton.addEventListener('click', function() {
        const inputGroup = createInputGroup();
        ingredientContainer.appendChild(inputGroup);
    });

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
            // if (this.parentNode.parentNode.firstElementChild === this.parentNode){
            //     inputField.value = '';
            // } else {
            //     inputGroup.remove();
            // }
            inputGroup.remove();
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
const container = document.querySelector('.container');
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
            this.value = '';
        });
    });

});


async function fetchRecipes(ingredients, cuisineType, mealType, dietType) {
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
                    <ion-icon id="filled-heart" name="heart" onclick="addToFavorites('${recipe.label}')"></ion-icon>
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
    const dropdowns = document.querySelectorAll('.dropdown');

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

        function show(value) {
            dropdown.querySelector('.textBox').value = value;
        }
        dropdown.onclick = function() {
            dropdown.classList.toggle('active');
        }
    });
});

