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
    const cuisineType = document.getElementById('category').value;
    const mealType = document.getElementById('category').value;
    const dietType = document.getElementById('category').value;
    fetchAPI(cuisineType, mealType, dietType);
});

async function fetchAPI(cuisineType, mealType, dietType) {
    const baseURL = `https://api.edamam.com/search?q=${searchQuery}&app_id=${APP_ID}&app_key=${APP_KEY}&to=20`;
    const response = await fetch(baseURL);
    const data = await response.json();
    generateHTML(data.hits);
    console.log(data);

    const firstIngredientInput = document.querySelector('input[name="ingredient"]');
    firstIngredientInput.value = '';

    const ingredientContainers = document.querySelectorAll('.input-group');
    for (let i = 1; i < ingredientContainers.length; i++) {
        ingredientContainers[i].remove();
    }

    // Get unique cuisine types, meal types, and diet types from the data
    const cuisineTypes = [...new Set(data.hits.map(hit => hit.recipe.cuisineType))];
    const mealTypes = [...new Set(data.hits.map(hit => hit.recipe.mealType))];
    const dietTypes = [...new Set(data.hits.map(hit => hit.recipe.healthLabels))];

    // Populate select elements with the extracted data
    populateSelect('cuisineType', cuisineTypes);
    populateSelect('mealType', mealTypes);
    populateSelect('dietType', dietTypes);
}

function populateSelect(selectId, options) {
    const select = document.getElementById(selectId);
    select.innerHTML = '<option value="">Select Option</option>';
    options.forEach(option => {
        select.innerHTML += `<option value="${option}">${option}</option>`;
    });
}
function generateHTML(results){
    let generatedHTML = '';
    results.map(result => {
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
            <p class="item-data">Diet type: ${result.recipe.healthLabels.join(', ')}</p>
        </div>
        `
    })
    searchResultDiv.innerHTML = generatedHTML;
}

const categorySelect = document.getElementById('category');
const subcategorySelect = document.getElementById('subcategory');

categorySelect.addEventListener('change', function() {
    const selectedCategory = this.value;
    if (selectedCategory === '') {
        subcategorySelect.disabled = true;
        subcategorySelect.innerHTML = '<option value="">Select Subcategory</option>';
    } else {
        // Enable the subcategory select
        subcategorySelect.disabled = false;
        // Dynamically populate the subcategories based on the selected category
        if (selectedCategory === 'cuisineType') {
            subcategorySelect.innerHTML = `
                <option value="1_1">american</option>
                <option value="1_2">asian</option>
                <option value="1_3">british</option>
                <option value="1_4">caribbean</option>
                <option value="1_5">central europe</option>
                <option value="1_6">chinese</option>
                <option value="1_7">eastern europe</option>
                <option value="1_8">french</option>
                <option value="1_9">greek</option>
                <option value="1_10">indian</option>
                <option value="1_11">italian</option>
                <option value="1_12">japanese</option>
                <option value="1_13">korean</option>
                <option value="1_14">kosher</option>
                <option value="1_15">mediterranean</option>
                <option value="1_16">mexican</option>
                <option value="1_17">middle eastern</option>
                <option value="1_18">nordic</option>
                <option value="1_19">south american</option>
                <option value="1_20">south east asian</option>
                <option value="1_21">world</option>
            `;
        } else if (selectedCategory === 'mealType') {
            subcategorySelect.innerHTML = `
                <option value="2_1">breakfast</option>
                <option value="2_2">brunch</option>
                <option value="2_3">lunch/dinner</option>
                <option value="2_4">snack</option>
                <option value="2_5">teatime</option>
            `;
        } else if (selectedCategory === 'dietType') {
            subcategorySelect.innerHTML = `
                <option value="3_1">vegetarian</option>
                <option value="3_2">vegan</option>
                <option value="3_3">soy-free</option>
                <option value="3_4">gluten-free</option>
                <option value="3_5">dairy-free</option>
                <option value="3_6">egg-free</option>
                <option value="3_7">alcohol-free</option>
            `;
        }
    }
});
