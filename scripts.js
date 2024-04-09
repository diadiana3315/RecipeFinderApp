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

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const ingredients = Array.from(document.querySelectorAll('input[name="ingredient"]')).map(input => input.value);
    searchQuery = ingredients.join('+');
    fetchAPI();
});

async function fetchAPI() {
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20`;
    const response = await fetch(baseURL);
    const data = await response.json();
    generateHTML(data.hits);
    console.log(data);

// empty search bar after search
    const firstIngredientInput = document.querySelector('input[name="ingredient"]');
    firstIngredientInput.value = '';

    const ingredientContainers = document.querySelectorAll('.input-group');
    for (let i = 1; i < ingredientContainers.length; i++) {
        ingredientContainers[i].remove();
    }
}

// ----------------------------------------------------------------------------------------
// generate HTML
function generateHTML(results){
    let generatedHTML = '';
    results.forEach(result => {
        const filteredHealthLabels = result.recipe.healthLabels.filter(label => {
            return ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Egg-Free', 'Soy-Free', 'Alcohol-Free'].includes(label);
        });
        generatedHTML +=
        `
         <div class="item">
            <img src="${result.recipe.image}" alt="Recipe Image">
            <div class="flex-container">
                <h1 class="title">${result.recipe.label}</h1>
                <a class="view-button" href="${result.recipe.url}" target="_blank">View recipe</a>
            </div>
            <p class="item-data">Cuisine type: ${result.recipe.cuisineType}</p>
            <p class="item-data">Meal type: ${result.recipe.mealType}</p>
            <p class="item-data">Diet type: ${filteredHealthLabels.join(', ')}</p>
        </div>
        `
    })
    searchResultDiv.innerHTML = generatedHTML;
}

// ----------------------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the class 'filter-option'
    const filterOptions = document.querySelectorAll('.filter-option');

    // Add event listeners to each filter option
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            const value = this.textContent;
            show(value);
        });
    });

    // Define the show function
    function show(value) {
        document.querySelector('.textBox').value = value;
    }
    let dropdown = document.querySelector('.dropdown');
    dropdown.onclick = function() {
        dropdown.classList.toggle('active');
    }
});

