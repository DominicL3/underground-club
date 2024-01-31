// Check for invalid words
import englishDictionary from "./englishDictionary.js";
const englishWords = englishDictionary();

// Unit tests will fail because there are no document elements in the Node.js
// environment. We should only add event listeners in the browser environment.
if (typeof window !== "undefined") {
    // Listen to submit button click
    submitButton.addEventListener("click", submitGuess);

    // Allow pressing Enter key in text box to submit the guess
    document.getElementById("guess").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitButton.click();
        }
    });

    // Listen to button for resetting allowed/not allowed lists
    resetButton.addEventListener("click", resetLists);
}

// Got an Underground Club pass
const allowedLettersRegex = /[gjpqy]/;

/**
 * MAIN FUNCTION: Submits a guess to the Underground Club.
 *
 * This function is called when the user clicks the "Submit" button. It takes
 * the input text and determines whether that guess is allowed or not.
 *
 * Afterwards, the word is added to the list of previously entered words on the
 * webpage and stored in a cookie.
 *
 * An error message is displayed if the guess is not valid English.
 * @returns {void}
 */
function submitGuess() {
    // Grab the value in the input text box
    var guessBox = document.getElementById("guess");
    let guess = guessBox.value.trim();

    // Hook the error box
    var errorBox = document.getElementById("error");

    try {
        var isAllowed = verifyGuess(guess);
    } catch (error) {
        // Display the error message in the error box
        errorBox.textContent = error.message;
        errorBox.style.display = "block"; // Make the error box visible
        return;
    }

    // If needed, clear and hide error box
    errorBox.textContent = "";
    errorBox.style.display = "none";

    // Add word to allowed/not allowed list
    if (isAllowed) {
        console.log("Allowed: " + guess)
        addToWordList(guess, "allowed-list");
    } else {
        console.log("Not allowed: " + guess)
        addToWordList(guess, "not-allowed-list");
    }

    // Clear the input field
    guessBox.value = "";

    // Store the word lists in cookies
    var allowedWordsCookie = getWordList("allowed-list").join(", ");
    var disallowedWordsCookie = getWordList("not-allowed-list").join(", ");
    updateCookie("allowed-list", allowedWordsCookie);
    updateCookie("not-allowed-list", disallowedWordsCookie);
}

/**
 * Determines whether a given phrase can enter the Underground Club.
 * Throws an error if any word in the input is not valid English.
 * @param {string} guess   String to attempt entry.
 * @returns {boolean}      Whether that input string can enter.
 */
function verifyGuess(guess) {
    // Throw error when string is empty or just contains a bunch of spaces
    if (!guess.trim().length) {
        throw new Error("Please enter a valid word.");
    } else if (guess.trim().length === 1) {
        throw new Error("Enter a word longer than one character.");
    }

    var allowedUnderground = false;

    // Determine whether any word in the string can enter Underground Club
    let guessWords = guess.split(" ");

    for (let i = 0; i < guessWords.length; i++) {
        // Error out if word is not in the English dictionary
        if (!englishWords.check(guessWords[i].toLowerCase())) {
            throw new Error("Invalid word: " + guessWords[i]);
        }

        // Valid Underground Club member if word has one of the special letters
        if (allowedLettersRegex.test(guessWords[i])) {
            allowedUnderground = true;
        }
    }
    return allowedUnderground;
}

/**
 * Adds a word to a running word list unless it already exists.
 * @param {string} word      The word to add to the list.
 * @param {string} listId    Name/ID of the list to add the word to.
 * @returns {void}
 */
function addToWordList(word, listId) {
    // Only add to the word list if it doesn't exist already
    var wordList = getWordList(listId);
    if (wordList.includes(word)) {
        return;
    }

    // Add the word to the webpage's list on a new line
    var listContainer = document.getElementById(listId);
    var listItem = document.createElement("p");
    listItem.textContent = word;
    listContainer.appendChild(listItem);
}

/**
 * Retrieves words from a word list given the list's name.
 * @param {string} listId    Name/ID of the list to get words from.
 * @returns {string}         Comma-separated list of words.
 */
function getWordList(listId) {
    // Get the list of words from the list container
    var listContainer = document.getElementById(listId);
    var listItems = listContainer.getElementsByTagName("p");

    // Convert the list of words to an array
    var words = Array.from(listItems).map(item => item.textContent);

    return words;
}

/**
 * Updates a cookie with a new value.
 * @param {string} cookieName      Name of the cookie to update.
 * @param {string} cookieValue     New value to set the cookie to.
 * @returns {void}
 */
function updateCookie(cookieName, cookieValue) {
    // Set cookie to expire in 1 year
    var date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    var expires = ";expires=" + date.toUTCString();

    // Set the cookie with the new value
    document.cookie = cookieName + "=" + cookieValue + expires + "; path=/; Secure; SameSite=Lax";
}

/**
 * Clears the allowed and not allowed lists and their respective cookies.
 * @returns {void}
 */
function resetLists() {
    // Clear the word lists on the webpage
    document.getElementById("allowed-list").innerHTML = "<h2>Allowed</h2>";
    document.getElementById("not-allowed-list").innerHTML = "<h2>Not Allowed</h2>";

    // Clear the stored cookies
    document.cookie = "allowed-list=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "not-allowed-list=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export { verifyGuess }