<script setup>
import numbers from "./numbers.js";
import { ref } from "vue";

let randomNumber = {};
let numberBank = [];
const fieldUsedAsPrompt = ref(0);
const fieldUsedAsAnswer = ref(1);
const possibleAnswers = ref([]);
const prompt = ref("");
const correctAnswer = ref("");
const givenAnswer = ref("");
const indexOfAnswerClicked = ref(null);
let unitsPracticedToday = 0;
let unitsPracticedYesterday = 0;
// see if numberBank is in localStorage, if so, load it,  if not, set it to the imported numbers (feel free to disable conditional for developing)
numberBank = numbers;
if (localStorage.getItem("numberBank")) {
  // if it is in localStorage, set the numberBank to the localStorage value
  // numberBank = JSON.parse(localStorage.getItem("numberBank"));
}

// same with localStorage stats
// let stats = {};
// if (!localStorage.getItem("stats")) {
//   stats = {
//     counter: 0,
//   };
// } else {
//   stats = JSON.parse(localStorage.getItem("stats"));
// }

function getRandomNumber() {
  guessMade.value = false;
  console.log("picking number from", numberBank);
  // with 80% chance, pick a number that has been practiced before
  // with 20% chance, pick a number that has not been practiced before (empty stats list)
  // if there is no number with the preferred property, pick any random one
  const pickNewNumber = Math.random() > 0.8;
  console.log("pickNewNumber", pickNewNumber);
  let newNumber = {};
  let numbersToPickFrom = [];
  if (!pickNewNumber) {
    // filter by stats existing, and dueAt being in the past (compare via UNIX string)
    numbersToPickFrom = numberBank.filter((number) => number.stats.length > 0).filter((number) => number.sr.dueAt < Math.floor(new Date().getTime() / 1000));
    console.log(`there are ${numbersToPickFrom.length} old, due numbers to pick from`)
  } else {
    numbersToPickFrom = numberBank.filter((number) => number.stats.length == 0);
  }
  if (numbersToPickFrom.length == 0) {
    console.log(`tried picking a new number ${pickNewNumber}, but there was none, so getting any`);
    numbersToPickFrom = numberBank;
  }
  newNumber =
    numbersToPickFrom[Math.floor(Math.random() * numbersToPickFrom.length)];

  // randomly pick a field out of val, ar, ar_long and transliteration
  const fields = ["val", "ar", "ar_long", "transliteration"];
  fieldUsedAsPrompt.value = fields[Math.floor(Math.random() * 4)];
  // pick a nr between 0 and 3 that is not the same as fieldUsedAsPrompt
  fieldUsedAsAnswer.value = fieldUsedAsPrompt.value;
  while (fieldUsedAsAnswer.value === fieldUsedAsPrompt.value) {
    fieldUsedAsAnswer.value = fields[Math.floor(Math.random() * 4)];
  }

  prompt.value = newNumber[fieldUsedAsPrompt.value];
  correctAnswer.value = newNumber[fieldUsedAsAnswer.value];

  // have a 4 possible answer fields: one is the correct one, the rest is wrong ones picked from the data
  possibleAnswers.value = [newNumber[fieldUsedAsAnswer.value]];
  for (let i = 0; i < 3; i++) {
    let newWrongAnswer =
      numberBank[Math.floor(Math.random() * numberBank.length)][
        fieldUsedAsAnswer.value
      ];
    while (possibleAnswers.value.includes(newWrongAnswer)) {
      newWrongAnswer =
        numberBank[Math.floor(Math.random() * numberBank.length)][
          fieldUsedAsAnswer.value
        ];
    }
    possibleAnswers.value.push(newWrongAnswer);
  }
  // shuffle the possible answers
  possibleAnswers.value.sort(() => Math.random() - 0.5);

  randomNumber = newNumber;
  // save the numberBank to localStorage (doesn't make that much sense here in the code but whatever)
  localStorage.setItem("numberBank", JSON.stringify(numberBank));
}

function userSawPromptBefore(prompt) {
  // check if stats list even exists on this number
  if (randomNumber.length == 5) {
    // check if the prompt is in the stats list
    const promptInStats = randomNumber[4].find(
      (entry) => entry.prompt === prompt
    );
    if (promptInStats) {
      return true;
    }
  }
  return false;
}

let guessMade = ref(false);

let valueEase = ref(null);
let valueCorrect = ref(null);
let valueAnki = ref(null);

getRandomNumber();

function handleAnswer(answer) {
  guessMade.value = true;
  givenAnswer.value = answer;
  const answerWasCorrect = answer === correctAnswer.value;
  console.log("answer clicked", answer);
  indexOfAnswerClicked.value = possibleAnswers.value.indexOf(answer);
  // add or update the statistics object as the last item of the list of the number in numberBank
  const statsEntry = {
    date: new Date(),
    correct: answerWasCorrect,
    answer: answer,
    prompt: prompt.value,
  };
  randomNumber.stats.push(statsEntry);
  // save to localStorage
  localStorage.setItem("numberBank", JSON.stringify(numberBank));
  // if correct, add one to repetitions, otherwise reset
  randomNumber.sr.repetitions = answerWasCorrect
    ? randomNumber.sr.repetitions + 1
    : 0;
    // if correct, double interval, if not, half it (min is 10)
  randomNumber.sr.interval = answerWasCorrect
    ? randomNumber.sr.interval * 2 * randomNumber.sr.repetitions
    : Math.max(randomNumber.sr.interval / 2, 10);
  // calculate new dueAt by adding interval in seconds to current time (save as UNIX string)
  randomNumber.sr.dueAt = Math.floor(
    new Date().getTime() / 1000 + randomNumber.sr.interval
  );
  console.log("sr:", randomNumber.sr);
}
</script>

<template>
  <!-- <small> Practiced {{ stats.counter }} times so far </small> -->
  <div
    class="card bg-gray-600 shadow-xl m-4 p-4 flex flex-col items-center w-full max-w-screen-xl"
  >
    <div class="card-body">
      <div id="prompt" class="text-2xl">
        {{ prompt }}
      </div>
    </div>

    <div class="card-actions flex-col justify-end mt-6 pt-2">
      <button
        class="btn text-xl w-full max-w-1/3 lowercase"
        :class="{
          'btn-success':
            guessMade &&
            index == indexOfAnswerClicked &&
            givenAnswer === correctAnswer,
          'btn-error':
            guessMade &&
            index == indexOfAnswerClicked &&
            givenAnswer !== correctAnswer,
          'btn-info':
            guessMade &&
            index != indexOfAnswerClicked &&
            answer === correctAnswer &&
            givenAnswer !== correctAnswer,
          'text-3xl': fieldUsedAsAnswer == 2,
          'shine-button':
            answer === correctAnswer &&
            !guessMade &&
            !userSawPromptBefore(prompt),
        }"
        v-for="(answer, index) in possibleAnswers"
        @click="handleAnswer(answer)"
      >
        {{ answer }}
      </button>

      <button
        class="btn btn-primary mt-4"
        @click="getRandomNumber"
        v-if="guessMade"
      >
        Next
      </button>
    </div>
  </div>
  <!-- {{ randomNumber }}, index of nr clicked: {{ indexOfAnswerClicked }}, answer: {{ givenAnswer }}, correct answer: {{ correctAnswer }}  -->
</template>

<style scoped></style>
