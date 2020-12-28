const regInputs = document.getElementsByTagName('input'); // getting all the inputs
const labelErr = document.createElement('label'); // creating error labels
const formBlocks = document.querySelector('.form__sign'); // getting the div parent of inputs

labelErr.classList.add('form__error');
labelErr.innerHTML = "This field shouldn't be empty"; // styling labels

formBlocks.appendChild(labelErr.cloneNode(true)); // adding error labels to the DOM
formBlocks.insertBefore(labelErr.cloneNode(true), regInputs[1]); 

for (let i = 0; i < regInputs.length; i++) {
    regInputs[i].addEventListener("input", (e) => {
        validation(e.currentTarget); // validate inputs on every user type
    });
}

let passwordCopy; // for storing the password value during the validation
function validation(target) { // by placeholder defines the needed input and checks it
    if (target.placeholder == "Username") {
        if (target.value == "") {
            target.parentNode.childNodes[3].style.visibility = "unset"; // target=input, div = parentNode, input->div->label->addClass-> whola  
        } else { target.parentNode.childNodes[3].style.visibility = "hidden"; } 
    } else if (target.placeholder == "Password") {
        passwordCopy = target.value;
        if (target.value.length < 8) {
            target.parentNode.childNodes[6].innerHTML = "Password should be at least 8 characters";
            target.parentNode.childNodes[6].style.visibility = "unset";
        } else { target.parentNode.childNodes[6].style.visibility = "hidden"; }
    } 
}

const labels = document.querySelectorAll(".form__error");
const submit = document.querySelector(".form__login");

function errorCheck() { // Checks if there are any error label so we won't pass the validation
    let count = 0;
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].style.visibility == "unset") {
            count++;
        } else { count--; }
    }
    console.log("error", count)
    return count; 
}

function emptyInputCheck() { // Checks if there are any empty imput so we won't pass the validation
    let count = 0;
    for (let i = 0; i < regInputs.length; i++) {
        if (regInputs[i].value == "") {
            count++;
        } else { count--; }
    }
    console.log("input", count)
    return count;
}

function removeSpaces(string) { // trim alternative (trim didn't work for some reasons I haven't yet understood)
    return string.split(' ').join('');
}

submit.addEventListener("click", (e) => { // any of emptyInputs/Labels will return -2 for 100% sure if everything is ok
    if (emptyInputCheck() !== -2 || errorCheck() !== -2 || signIn()) { 
        e.preventDefault();
        alert("Ошибка валидации")
        location.reload(); // for refreshing all the inputs
    } 
})

function signIn() {
    let usernames = []; let passwords = [];
    let userFlag = true; let passwordFlag = true; // flags for validation
    let userData = { 
        username: removeSpaces(regInputs[0].value),
        password: removeSpaces(regInputs[1].value)
    }

    if (usernames.length == 0 && localStorage.getItem('username')) { 
        usernames = localStorage.getItem('username');                
        usernames = usernames.split(",");
    }
    if (passwords.length == 0 && localStorage.getItem('mail')) {
        passwords = localStorage.getItem('password')
        passwords = passwords.split(",")
    }

    if (usernames.indexOf(userData.username) == -1) {
        alert("Пользователя с таким username не существует") 
        userFlag = false;
    } 
    if (passwords.indexOf(userData.password) == -1) {
        alert("Неверный пароль")
        passwordFlag = false;
    } else if (passwords.indexOf(userData.password) != usernames.indexOf(userData.username)) {
        alert("Неверный пароль")
        passwordFlag = false;
    } 

    if (!userFlag || !passwordFlag) {
        return true;
    } else { return false; }
}


