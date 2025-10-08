const form = document.querySelector("form");
const word = document.querySelector(".word");
const timeLeft = document.querySelector(".time-left");
const checkValue = document.querySelector(".check-value");
const result = document.querySelector(".result");
const retry = document.querySelector(".retry");
const submit = document.querySelector(".submit");
const userInput = document.querySelector(".user-input");

// ✅ Words and clues
const words = [
	{ word: "Programming", clue: "The process of writing computer instructions." },
	{ word: "Javascript", clue: "A language used to make web pages interactive." },
	{ word: "Computer", clue: "An electronic device that processes data." },
	{ word: "Website", clue: "A collection of web pages accessible via the internet." },
	{ word: "Database", clue: "Used to store and manage data efficiently." },
	{ word: "Internet", clue: "A global network that connects computers worldwide." },
	{ word: "Algorithm", clue: "A step-by-step method to solve a problem." },
	{ word: "Function", clue: "A reusable block of code that performs a task." },
	{ word: "Variable", clue: "A storage location that holds a value." },
	{ word: "Software", clue: "Programs and applications that run on a computer." }
];

let currentWordData = getRandomWord();
let wordToGuess = currentWordData.word;
let shuffledWord = shuffle();
const TIME = 30;
let timer;
let interval;
let score = 0;

// ✅ Add clue display
const clueBox = document.createElement("div");
clueBox.classList.add("clue");
clueBox.style.textAlign = "center";
clueBox.style.fontStyle = "italic";
clueBox.style.fontSize = "1em";
clueBox.style.marginTop = "0.5em";
document.querySelector(".content").appendChild(clueBox);

// ✅ Add score display
const scoreBox = document.createElement("div");
scoreBox.classList.add("score");
scoreBox.style.textAlign = "center";
scoreBox.style.fontWeight = "bold";
scoreBox.style.marginTop = "0.5em";
document.querySelector(".content").appendChild(scoreBox);

// Get a random word
function getRandomWord() {
	return words[Math.floor(Math.random() * words.length)];
}

function init() {
	clearInterval(interval);
	currentWordData = getRandomWord();
	wordToGuess = currentWordData.word;
	shuffledWord = shuffle();
	word.textContent = shuffledWord;
	clueBox.textContent = "💡 Clue: " + currentWordData.clue;
	timer = TIME;
	timeLeft.textContent = timer;
	checkValue.textContent = "-";
	result.textContent = "";
	userInput.value = "";
	submit.style.background = "#27ae60";
	submit.disabled = false;
	scoreBox.textContent = `🏆 Score: ${score}`;

	interval = setInterval(() => {
		if (timer === 0) {
			updateComponents("Defeat", "red");
			clearInterval(interval);
			result.textContent += " Game Over!";
			return;
		}
		timer--;
		timeLeft.textContent = timer.toString();
	}, 1000);
}

function shuffle() {
	let a = wordToGuess.split("");
	for (let i = a.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a.join("");
}

function cleanWord(word) {
	return word.toLowerCase().replace(/\s/g, "");
}

function updateComponents(message, color) {
	result.textContent = message;
	result.style.color = color;
	submit.disabled = true;
	submit.style.background = "grey";
}

function checkDifferences(word1, word2) {
	return Array.from(word1).map((el, index) => !(el === word2[index]));
}

function isWinner(diff, guess) {
	const nbDiff = diff.reduce((prev, curr) => (curr += prev), 0);
	if (guess.length !== wordToGuess.length) return false;
	return nbDiff === 0;
}

function printDifferences(diff, guess) {
	checkValue.textContent = "";
	for (let i = 0; i < guess.length; i++) {
		const span = document.createElement("span");
		span.textContent = guess[i];
		if (i < diff.length)
			diff[i] ? (span.style.color = "red") : (span.style.color = "green");
		else span.style.color = "red";
		checkValue.appendChild(span);
	}
}

function endGame(win) {
	if (win) {
		clearInterval(interval);
		score++;
		updateComponents("✅ Correct!", "green");

		// Continue to next word after short delay
		setTimeout(() => {
			init(); // move to the next word
		}, 1500);
	}
}

retry.addEventListener("click", () => {
	score = 0;
	init();
});

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const guess = userInput.value.trim();
	const diff =
		guess.length < wordToGuess.length
			? checkDifferences(cleanWord(guess), cleanWord(wordToGuess))
			: checkDifferences(cleanWord(wordToGuess), cleanWord(guess));
	printDifferences(diff, guess);
	userInput.value = "";
	endGame(isWinner(diff, guess));
});

init();
