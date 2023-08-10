const range = document.querySelector("#range");
const passLen = document.querySelector(".pass-len");
const generateBtn = document.querySelector("#generate-btn");
const checkedUppercase = document.querySelector("#uppercase");
const checkedLowerase = document.querySelector("#lowercase");
const checkedNumber = document.querySelector("#numbers");
const checkedSymbols = document.querySelector("#symbols");
const passwordDisplay = document.querySelector("#password");
const copy = document.querySelector("#copy");
const copyPopup = document.querySelector(".copy-text");
const showStrength = document.querySelectorAll(".strength");
const checkedInputs = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 10;
let totalChecked = 0;
const symbols = "`~!@#$%^&*([]{'}\")_+=-,./<>?;:'";

function handleSlider() {
	passwordLength = range.value;
	passLen.textContent = passwordLength;

	// slider fill range
	const min = range.min;
	const max = range.max;
	let rangePercent = ((range.value - min) / (max - min)) * 100;
	range.style.background =
		"linear-gradient(90deg, rgba(163,255,173,1)" +
		rangePercent +
		"%, rgba(25,24,32,1) " +
		rangePercent +
		"%)";

	return passwordLength;
}

range.addEventListener("input", handleSlider);

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function getRandomUppercase() {
	return String.fromCharCode(getRandomInt(65, 91));
}

function getRandomLowercase() {
	return String.fromCharCode(getRandomInt(97, 123));
}

function getRandomNumber() {
	return getRandomInt(0, 9);
}

function getRandomSymbol() {
	let symbol = getRandomInt(0, symbols.length);
	return symbols[symbol];
}

// passward strength

function passStrength(str) {
	let upperPresent = false;
	let lowerPresent = false;
	let numberPresent = false;
	let symbolPresent = false;
	
	// strength color reset for new password
	for (let i = 0; i <= 2; i++) {
		showStrength[i].style.backgroundColor = "#23222a";
	}

	if (checkedUppercase.checked) upperPresent = true;
	if (checkedLowerase.checked) lowerPresent = true;
	if (checkedNumber.checked) numberPresent = true;
	if (checkedSymbols.checked) symbolPresent = true;

	// weak
	if (str.length <= 6 || (!numberPresent && !symbolPresent)) {
		showStrength[0].style.backgroundColor = "#f74b4b";
	}

	//normal
	if (str.length > 6) {
		showStrength[0].style.backgroundColor = "#f8cb63";
		showStrength[1].style.backgroundColor = "#f8cb63";
	}

	// strong
	if (
		upperPresent &&
		lowerPresent &&
		numberPresent &&
		symbolPresent &&
		str.length >= 8
	) {
		showStrength[0].style.backgroundColor = "#a3ffae";
		showStrength[1].style.backgroundColor = "#a3ffae";
		showStrength[2].style.backgroundColor = "#a3ffae";
	}
}

// clipboard copy
async function copyClipboard() {
	try {
		await navigator.clipboard.writeText(passwordDisplay.value);
		copyPopup.textContent = "Copied";
	} catch (e) {
		copyPopup.textContent = "Failed";
	}

	copyPopup.classList.add("active");

	setTimeout(() => copyPopup.classList.remove("active"), 3000);
}

copy.addEventListener("click", () => {
	if (password !== "") {
		copyClipboard();
	}
});

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	let str = "";
	array.forEach((element) => (str += element));
	return str;
}

// generate password
generateBtn.addEventListener("click", () => {
	password = "";
	totalChecked = 0;

	// min characters selected
	let funcArr = [];
	if (checkedUppercase.checked) {
		funcArr.push(getRandomUppercase);
	}
	if (checkedLowerase.checked) {
		funcArr.push(getRandomLowercase);
	}
	if (checkedNumber.checked) {
		funcArr.push(getRandomNumber);
	}
	if (checkedSymbols.checked) {
		funcArr.push(getRandomSymbol);
	}

	// compulsory characters
	for (let i = 0; i < funcArr.length; i++) {
		password += funcArr[i]();
	}

	if (funcArr.length > handleSlider()) {
		range.value = funcArr.length;
		passLen.textContent = funcArr.length;
	}

	// rest of characters
	if (funcArr.length !== 0) {
		for (let i = 0; i < passwordLength - funcArr.length; i++) {
			let randInt = getRandomInt(0, funcArr.length);
			password += funcArr[randInt]();
		}
	} else {
		alert("Please select atleast one field");
	}

	// shuffle password
	password = shuffle(Array.from(password));

	// display
	passwordDisplay.value = password;

	// strength check
	passStrength(password);
});
