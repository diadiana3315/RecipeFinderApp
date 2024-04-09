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
//
// searchForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const ingredients = Array.from(document.querySelectorAll('input[name="ingredient"]')).map(input => input.value);
//     searchQuery = ingredients.join('+');
//     fetchAPI();
// });
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.querySelector('#search-form');

    // Add event listener for form submission
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get selected ingredients
        const ingredients = Array.from(document.querySelectorAll('input[name="ingredient"]'))
            .map(input => input.value)
            .filter(value => value.trim() !== '');

        // Get selected filter options
        const cuisineType = document.querySelector('.container2 .dropdown:nth-of-type(1) .textBox').value.toLowerCase();
        const mealType = document.querySelector('.container2 .dropdown:nth-of-type(2) .textBox').value.toLowerCase();
        const dietType = document.querySelector('.container2 .dropdown:nth-of-type(3) .textBox').value;
        console.log("Selected cuisineType:", cuisineType);
        console.log("Selected mealType:", mealType);
        console.log("Selected dietType:", dietType);
        // Fetch recipes from API
        const recipes = await fetchRecipes(ingredients, cuisineType, mealType, dietType);
        console.log("Filtered recipes:", recipes);
        // Display filtered recipes
        displayRecipes(recipes);
    });
});

//
// async function fetchAPI() {
//     const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20`;
//     const response = await fetch(baseURL);
//     const data = await response.json();
//     generateHTML(data.hits);
//     console.log(data);
//
// // empty search bar after search
//     const firstIngredientInput = document.querySelector('input[name="ingredient"]');
//     firstIngredientInput.value = '';
//
//     const ingredientContainers = document.querySelectorAll('.input-group');
//     for (let i = 1; i < ingredientContainers.length; i++) {
//         ingredientContainers[i].remove();
//     }
// }

async function fetchRecipes(ingredients, cuisineType, mealType, dietType) {
    // const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20`;
    const baseURL = `https://api.edamam.com/search?q=${encodeURIComponent(ingredients.join('+'))}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20`;

    try {
        const response = await fetch(baseURL);
        const data = await response.json();
        // console.log(data);
        console.log('API Response:', data);

        console.log('All Recipes:', data.hits.map(hit => hit.recipe));

        return data.hits.filter(hit => {
            const recipe = hit.recipe;
            // return (
            //     (!cuisineType || recipe.cuisineType.toLowerCase() === cuisineType) &&
            //     (!mealType || recipe.mealType.toLowerCase() === mealType) &&
            //     (!dietType || recipe.dietLabels.map(label => label.toLowerCase()).includes(dietType))
            // );

            return (
                (!cuisineType || (typeof recipe.cuisineType === 'string' && recipe.cuisineType.toLowerCase() === cuisineType)) &&
                (!mealType || (typeof recipe.mealType === 'string' && recipe.mealType.toLowerCase() === mealType)) &&
                (!dietType || (Array.isArray(recipe.healthLabels) && recipe.healthLabels.includes(dietType)))
            );
        });
    } catch (error) {
        console.error('Error fetching recipes:', error);
        return [];
    }
}

// ----------------------------------------------------------------------------------------
// generate HTML
// function generateHTML(results){
//     let generatedHTML = '';
//     results.forEach(result => {
//         const filteredHealthLabels = result.recipe.healthLabels.filter(label => {
//             return ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Egg-Free', 'Soy-Free', 'Alcohol-Free'].includes(label);
//         });
//         generatedHTML +=
//         `
//          <div class="item">
//             <img src="${result.recipe.image}" alt="Recipe Image">
//             <div class="flex-container">
//                 <h1 class="title">${result.recipe.label}</h1>
//                 <a class="view-button" href="${result.recipe.url}" target="_blank">View recipe</a>
//             </div>
//             <p class="item-data">Cuisine type: ${result.recipe.cuisineType}</p>
//             <p class="item-data">Meal type: ${result.recipe.mealType}</p>
//             <p class="item-data">Diet type: ${filteredHealthLabels.join(', ')}</p>
//         </div>
//         `
//     })
//     searchResultDiv.innerHTML = generatedHTML;
// }
function displayRecipes(recipes) {
    const searchResultDiv = document.querySelector('.search-result');

    if (recipes.length === 0) {
        searchResultDiv.innerHTML = '<p>No recipes found.</p>';
        return;
    }
    console.log('Filtered Recipes:', recipes);

    const generatedHTML = recipes.map(hit => {
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

