const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//stet strength circle color to grey
setIndicator("#ccc");

//set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min =inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRandomInteger(0, 9);
}

function genrateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
}

function genrateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
}

function genrateSymbol() {
    const randNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch (e) {
        copyMsg.innerText = "failed";
    }
    //to make copy msg visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

function shufflePassword(array) {
    //Fisher Yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}
generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if (checkCount <= 0)
        return;
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    //let's start the journey to find new password
    console.log("Starting the journey");

    //remove old password
    password = "";

    // lets put the stuff mention by checkboxes
    // if (uppercaseCheck.checked) {
    //     password = genrateUpperCase();
    // }
    // if (lowercaseCheck.checked) {
    //     password = genrateLowerCase();
    // }
    // if (numbersCheck.checked) {
    //     password = generateRandomNumber();
    // }
    // if (symbolsCheck.checked) {
    //     password = genrateSymbol();
    // }


    let funArr = [];
    if (uppercaseCheck.checked) {
        funArr.push(genrateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funArr.push(genrateLowerCase);
    }
    if (numbersCheck.checked) {
        funArr.push(generateRandomNumber);

    }
    if (symbolsCheck.checked) {
        funArr.push(genrateSymbol);
    }
    // compulsory addition
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i]();
    }
    console.log("Compulsory addtion is done");
    //remaining addition
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRandomInteger(0, funArr.length)
        password += funArr[randIndex]();
    }
    console.log("Remaing addition is done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling is done");
    //show in UI
    passwordDisplay.value = password;
    console.log("ui addition is done");
    //calculate strength
    calcStrength();
});