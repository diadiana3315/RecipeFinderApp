import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
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
const dbRef = ref(database);

document.getElementById('registerBtn').addEventListener('click', function(){
    register(auth);
});
document.getElementById('loginBtn').addEventListener('click', function(){
    login(auth);
});

function register(auth) {
    // let full_name = document.getElementById("full_name").value;
    let first_name = document.getElementById("firstNameInp").value;
    let last_name = document.getElementById("lastNameInp").value
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;

    if (validate_email(email) === false || validate_password(password) === false) {
        alert("Invalid email address or password. Please try again.");
    }
    if(validate_field(first_name) === false || validate_field(last_name) === false || validate_field(email) === false || validate_field(password) === false) {
        alert("Please fill out all fields.");
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(function (){
        var user = auth.currentUser;
        var database_ref = dbRef;
        var user_data = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            last_login: Date.now()
        }
        database_ref.child('users/' + user.uid).set(user_data);
        alert('User created successfully!');
    })
        .catch(function(error) {
            var errorMessage = error.message;
            alert(errorMessage);
        });

}

function login(){
    let email = document.getElementById("emailInput").value;
    let password = document.getElementById("passwordInput").value;
    if (validate_email(email) === false || validate_password(password) === false) {
        alert("Invalid email address or password. Please try again.");
    }

    signInWithEmailAndPassword(auth, email, password)
        .then(function (){
            var user = auth.currentUser;
            var database_ref = dbRef;
            var user_data = {
                last_login: Date.now()
            }
            database_ref.child('users/' + user.uid).update(user_data);
            alert('User logged in successfully!');
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