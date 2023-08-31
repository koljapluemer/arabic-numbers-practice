<script setup>
import words from "./words.js";
import { ref } from "vue";

let randomWord = ref([]);
let wordBank = [];
let unitsPracticedToday = 0;
let unitsPracticedYesterday = 0;
// see if wordBank is in localStorage, if so, load it,  if not, set it to the imported words
if (!localStorage.getItem("wordBank")) {
  wordBank.value = words;
} else {
  // if it is in localStorage, set the wordBank to the localStorage value
  wordBank.value = JSON.parse(localStorage.getItem("wordBank"));
}

// same with localStorage stats
let stats = {};
if (!localStorage.getItem("stats")) {
  stats = {
    counter: 0,
  };
} else {
  stats = JSON.parse(localStorage.getItem("stats"));
}

function getRandomWord() {
  isRevealed.value = false;
  console.log("picking word from", wordBank);
  const newWord =
    wordBank.value[Math.floor(Math.random() * wordBank.value.length)];
  // if newWord is missing property evaluationType, randomly give it 'anki' or 'likert'
  if (!newWord.evaluationType) {
    newWord.evaluationType = Math.random() > 0.5 ? "anki" : "likert";
  }
  valueEase.value = null;
  valueCorrect.value = null;
  valueAnki.value = null;

  randomWord.value = newWord;
  // save the wordBank to localStorage (doesn't make that much sense here in the code but whatever)
  localStorage.setItem("wordBank", JSON.stringify(wordBank.value));
}

let isRevealed = ref(false);

let valueEase = ref(null);
let valueCorrect = ref(null);
let valueAnki = ref(null);

getRandomWord();

function evaluateScore() {
  if (randomWord.value.evaluationType == "anki") {
    if (valueAnki.value == null) return;
    // add a log to the word's repetition property - if the property doesn't exist, create it
    if (!randomWord.value.repetitions) {
      randomWord.value.repetitions = [];
    }
    randomWord.value.repetitions.push({
      date: new Date().toISOString(),
      score: valueAnki.value,
    });
    stats.counter++;
    localStorage.setItem("stats", JSON.stringify(stats));
    getRandomWord();
  } else {
    if (valueEase.value == null || valueCorrect.value == null) return;
    // add a log to the word's repetition property - if the property doesn't exist, create it
    if (!randomWord.value.repetitions) {
      randomWord.value.repetitions = [];
    }
    randomWord.value.repetitions.push({
      date: new Date().toISOString(),
      ease: valueEase.value,
      correct: valueCorrect.value,
    });
    stats.counter++;
    localStorage.setItem("stats", JSON.stringify(stats));
    getRandomWord();
  }
}
</script>

<template>
  <small> Practiced {{ stats.counter }} times so far </small>
  <div
    class="card bg-gray-600 shadow-xl m-4 flex flex-col items-center w-full max-w-screen-xl"
  >
    <div class="card-body">
      <h2 class="card-title my-2 text-6xl">{{ randomWord.og }}</h2>
      <div :class="{ hidden: !isRevealed }" class="flex items-center gap-2">
        <p class="my-2 text-4xl">
          {{ randomWord.translit }}
        </p>
        <a
          :href="`https://forvo.com/search/${randomWord.og}/ar/`"
          target="_blank"
        >
          <svg
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
          >
            <path
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </a>
      </div>
      <div class="card-actions justify-end mt-6 border-t-2 pt-2">
        <button
          class="btn btn-primary"
          @click="isRevealed = true"
          v-if="!isRevealed"
        >
          I have copied and tried to pronounce the word
        </button>
        <div class="" v-else>
          <div
            class="flex gap-2 justify-center items-center"
            v-if="randomWord.evaluationType == 'anki'"
          >
            <button
              class="btn"
              @click="
                valueAnki = 0;
                evaluateScore();
              "
              :class="{ 'btn-primary': valueAnki == 0 }"
            >
              Again
            </button>
            <button
              class="btn"
              @click="
                valueAnki = 1;
                evaluateScore();
              "
              :class="{ 'btn-primary': valueAnki == 1 }"
            >
              Hard
            </button>
            <button
              class="btn"
              @click="
                valueAnki = 2;
                evaluateScore();
              "
              :class="{ 'btn-primary': valueAnki == 2 }"
            >
              Good
            </button>
            <button
              class="btn"
              @click="
                valueAnki = 3;
                evaluateScore();
              "
              :class="{ 'btn-primary': valueAnki == 3 }"
            >
              Easy
            </button>
          </div>
          <div class="" v-else>
            <div class="flex gap-2 justify-center items-center my-2">
              <span class="w-52">I did the task correctly</span>
              <button
                class="btn"
                @click="
                  valueCorrect = 0;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueCorrect == 0 }"
              >
                Strongly Disagree
              </button>
              <button
                class="btn"
                @click="
                  valueCorrect = 1;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueCorrect == 1 }"
              >
                Disagree
              </button>
              <button
                class="btn"
                @click="
                  valueCorrect = 2;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueCorrect == 2 }"
              >
                Undecided
              </button>
              <button
                class="btn"
                @click="
                  valueCorrect = 3;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueCorrect == 3 }"
              >
                Agree
              </button>
              <button
                class="btn"
                @click="
                  valueCorrect = 4;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueCorrect == 4 }"
              >
                Strongly Agree
              </button>
            </div>
            <div class="flex gap-2 justify-center items-center my-2">
              <span class="w-52">The task was easy</span>
              <button
                class="btn"
                @click="
                  valueEase = 0;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueEase == 0 }"
              >
                Strongly Disagree
              </button>
              <button
                class="btn"
                @click="
                  valueEase = 1;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueEase == 1 }"
              >
                Disagree
              </button>
              <button
                class="btn"
                @click="
                  valueEase = 2;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueEase == 2 }"
              >
                Undecided
              </button>
              <button
                class="btn"
                @click="
                  valueEase = 3;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueEase == 3 }"
              >
                Agree
              </button>
              <button
                class="btn"
                @click="
                  valueEase = 4;
                  evaluateScore();
                "
                :class="{ 'btn-primary': valueEase == 4 }"
              >
                Strongly Agree
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
