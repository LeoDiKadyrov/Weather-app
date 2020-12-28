const regInputs = document.getElementsByTagName('input'); // getting all the inputs
const labelErr = document.createElement('label'); // creating error labels
const formBlocks = document.getElementsByClassName('form__block'); // getting all the div parents of inputs

labelErr.classList.add('form__error');
labelErr.innerHTML = "This field shouldn't be empty"; // styling labels

for (let i = 0; i < formBlocks.length; i++) {
    formBlocks[i].appendChild(labelErr.cloneNode(true)); // adding error labels to the DOM
}

for (let i = 0; i < regInputs.length; i++) {
    regInputs[i].addEventListener("input", (e) => {
        validation(e.currentTarget); // validate inputs on every user type
    });
}

let passwordCopy; // for storing the password value during the validation
function validation(target) { // by placeholder defines the needed input and checks it
    if (target.placeholder == "Enter username") {
        if (target.value == "") {
            target.parentNode.lastChild.style.visibility = "unset"; // target=input, div = parentNode, input->div->label->addClass-> whola  
        } else { target.parentNode.lastChild.style.visibility = "hidden"; } 
    } else if (target.placeholder == "Enter Email") {
        let dogPosition = target.value.indexOf("@");
        let dotPosition = target.value.lastIndexOf("."); // we get indexes of @ and .
        if (dogPosition < 1 || dotPosition < dogPosition + 2 || dotPosition + 2 >= target.value.length) {
            // at least 1 symbol before @ and 1 symbol after, and if after "." there are 2 symbols (ru, com, etc.)
            target.parentNode.lastChild.innerHTML = "Enter valid e-mail"; 
            target.parentNode.lastChild.style.visibility = "unset";
        } else { target.parentNode.lastChild.style.visibility = "hidden"; }
    } else if (target.placeholder == "Password") {
        passwordCopy = target.value;
        if (target.value.length < 8) {
            target.parentNode.lastChild.innerHTML = "Password should be at least 8 characters";
            target.parentNode.lastChild.style.visibility = "unset";
        } else { target.parentNode.lastChild.style.visibility = "hidden"; }
    } else {
        if (target.value !== passwordCopy) {
            target.parentNode.lastChild.innerHTML = "Passwords should be the same";
            target.parentNode.lastChild.style.visibility = "unset";
        } else { target.parentNode.lastChild.style.visibility = "hidden"; }
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
    return count; 
}

function emptyInputCheck() { // Checks if there are any empty imput so we won't pass the validation
    let count = 0;
    for (let i = 0; i < regInputs.length; i++) {
        if (regInputs[i].value == "") {
            count++;
        } else { count--; }
    }
    return count;
}

function passwordConfirm() { // just checks if the values from password input and confirm password input are equal
    if (regInputs[3].value !== regInputs[2].value) {
        labels[3].style.visibility = "unset";
        return true;
    } else { labels[3].style.visibility = "hidden"; return false; }
}

submit.addEventListener("click", (e) => { // any of emptyInputs/Labels will return -4 for 100% sure if everything is ok
    if (emptyInputCheck() !== -4 || errorCheck() !== -4 || passwordConfirm() || !signUp()) { 
        e.preventDefault();
        alert("Ошибка валидации")
        location.reload(); // for refreshing all the inputs
    } 
})


function signUp() {
    let userFlag = true; let mailFlag = true; // flags for updating the localStorage
    let usernames = []; let mails = []; let passwords = [];

    let userData = { 
        username: removeSpaces(regInputs[0].value),
        mail: removeSpaces(regInputs[1].value),
        password: removeSpaces(regInputs[2].value)
    }

    if (usernames.length == 0 && localStorage.getItem('username')) { // for refreshing array if the page was refreshed 
        usernames = localStorage.getItem('username');                // and there is smth in the localStorage
        usernames = usernames.split(",");
    }
    if (mails.length == 0 && localStorage.getItem('mail')) {
        mails = localStorage.getItem('mail')
        mails = mails.split(",")
    }
    if (passwords.length == 0 && localStorage.getItem('mail')) {
        passwords = localStorage.getItem('password')
        passwords = passwords.split(",")
    }

    if (usernames.indexOf(userData.username) == -1) {
        userFlag = false; 
    } else { alert("Пользователь с таким username уже существует") }

    if (mails.indexOf(userData.mail) == -1) {
        mailFlag = false;
    } else { alert("Пользователь с таким e-mail уже существует") }

    if (passwords.indexOf(userData.password) == -1) {
        passwords.push(userData.password); // to avoid adding duplicate values
    }

    try {
        if (!userFlag && !mailFlag) { // if user doesn't exist add him
            usernames.push(userData.username);
            mails.push(userData.mail); 
            localStorage.setItem('username', usernames);
            localStorage.setItem('mail', mails);
            localStorage.setItem('password', passwords);
            return true;
        } else { throw new Error("Пользователь уже существует"); }
    } catch (error) {
        console.log(error);
        return false;
    }
}

function removeSpaces(string) { // trim alternative (trim didn't work for some reasons I haven't yet understood)
    return string.split(' ').join('');
}


