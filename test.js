import test from "node:test"
import assert from "node:assert/strict"

import { verifyGuess } from "./app.js";


test("verify-valid-guesses", () => {
    // Test case: Valid guess with a word containing an allowed letter ("g")
    assert.strictEqual(verifyGuess("good guess"), true);

    // Test case: Valid guess with another allowed letter ("y")
    assert.strictEqual(verifyGuess("ordinary words"), true);

    assert.strictEqual(verifyGuess("PottY"), false);
    assert.strictEqual(verifyGuess("pottY"), true);
    assert.strictEqual(verifyGuess("Potty"), true);

    assert.strictEqual(verifyGuess("not allowed into the club"), false);
    assert.strictEqual(verifyGuess("allowed into the underground club"), true);

    assert.strictEqual(verifyGuess("jobless humans"), true);
    assert.strictEqual(verifyGuess("Jovial humans"), false);

    assert.strictEqual(verifyGuess("a fine gentleman"), true);
    assert.strictEqual(verifyGuess("A fine Gentleman"), false);
})

test("kings-and-queens-case", () => {
    // Test q/Q in queen
    assert.strictEqual(verifyGuess("the queen"), true);
    assert.strictEqual(verifyGuess("the Queen"), false);

    // The lowercase "g" in "king" should allow passage
    assert.strictEqual(verifyGuess("the king"), true);
    assert.strictEqual(verifyGuess("the King"), true);
})


test("verify-invalid-guesses", () => {
    // Test case for empty guess
    assert.throws(() => verifyGuess(""),
        new Error("Please enter a valid word."));

    // Test case for string full of spaces
    assert.throws(() => verifyGuess("   "),
        new Error("Please enter a valid word."));

    // Test cases for single-character guesses
    assert.throws(() => verifyGuess("a"),
        new Error("Enter a word longer than one character."));
    assert.throws(() => verifyGuess("g"),
        new Error("Enter a word longer than one character."));
    assert.throws(() => verifyGuess("%"),
        new Error("Enter a word longer than one character."));

    // Tests that we error out on single-character words that aren't "a" or "i"
    assert.throws(() => verifyGuess("Regular b in the house"),
        new Error("Invalid word: b"));
    assert.throws(() => verifyGuess("queen h"),
        new Error("Invalid word: h"));

    // Non-alphabetical characters should also raise errors
    assert.throws(() => verifyGuess("A load of 2 pizzas"),
        new Error("Invalid word: 2"));
    assert.throws(() => verifyGuess("A $#@$load of pizzas"),
        new Error("Invalid word: $#@$load"));

    // Test case for invalid words in the guess
    assert.throws(() => verifyGuess("invalid_word"),
        new Error("Invalid word: invalid_word"));
    assert.throws(() => verifyGuess("the sanguine dvun"),
        new Error("Invalid word: dvun"));
})