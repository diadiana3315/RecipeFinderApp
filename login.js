import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref, set, update, get} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyBL6pI6wXjNf04wc5qLMg6vMJP5rsKgxP4",
    authDomain: "webapp-7c9a3.firebaseapp.com",
    databaseURL: "https://webapp-7c9a3-default-rtdb.firebaseio.com",
    projectId: "webapp-7c9a3",
    storageBucket: "webapp-7c9a3.appspot.com",
    messagingSenderId: "739287238587",
    appId: "1:739287238587:web:44d66e1c5d4675391f269e",
    measurementId: "G-ZY0R23L3CD"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', function () {
    const registerBtn = document.getElementById('registerBtn');
    const loginBtn = document.getElementById('loginBtn');

    registerBtn.addEventListener('click', function() {
        register(auth);
    });
    loginBtn.addEventListener('click', function() {
        login(auth);
    });
});
function register(auth) {
    let first_name = document.getElementById("firstNameInp").value;
    let last_name = document.getElementById("lastNameInp").value
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    if (validate_email(email) === false || validate_password(password) === false) {
        alert("Invalid email address or password. Please try again.");
        return;
    }
    if(validate_field(first_name) === false || validate_field(last_name) === false || validate_field(email) === false || validate_field(password) === false) {
        alert("Please fill out all fields.");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(function (){
        var user = auth.currentUser;
        var user_data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            last_login: Date.now()
        }
        set(ref(database, 'users/' + user.uid), user_data)

        alert('User created successfully!');
    })
        .catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage);
        });

}

function login(auth){
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    if (validate_email(email) === false || validate_password(password) === false) {
        alert("Invalid email address or password. Please try again.");
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(function (){
            var user = auth.currentUser;
            var user_data = {
                last_login: Date.now()
            }
            update(ref(database, 'users/' + user.uid), user_data)

            alert('User logged in successfully!');
            // window.location.href = 'https://webapp-7c9a3.web.app';
            window.location.href = 'webapp.html';

        })
        .catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage);
        });
}

function validate_email(email) {
    let expression = /^[^@]+@\w+(\.\w+)+\w$/
    return expression.test(email) === true;
}

function validate_password(password) {
    return password.length >= 6;
}

function validate_field(field) {
    return field !== "";
}

// export function addToFavorites(recipeLabel) {
//     const user = auth.currentUser; // Get the current user
//     if (!user) {
//         alert('Please log in to add favorites.');
//         return;
//     }
//
//     const userFavoritesRef = ref(database, 'userFavorites/' + user.uid); // Reference to the user's favorites
//
//     // Check if the recipe already exists in the user's favorites
//     get(userFavoritesRef)
//         .then((snapshot) => {
//             if (snapshot.exists()) {
//                 const userFavorites = snapshot.val();
//                 if (userFavorites.hasOwnProperty(recipeLabel)) {
//                     alert('Recipe already in favorites!');
//                     return;
//                 }
//             }
//
//             // If the recipe doesn't exist, add it to the user's favorites
//             update(ref(userFavoritesRef), {
//                 [recipeLabel]: true
//             }).then(() => {
//                 alert('Recipe added to favorites!');
//             }).catch((error) => {
//                 console.error('Error adding recipe to favorites:', error);
//                 alert('Failed to add recipe to favorites.');
//             });
//         })
//         .catch((error) => {
//             console.error('Error checking user favorites:', error);
//             alert('Failed to add recipe to favorites.');
//         });
// }