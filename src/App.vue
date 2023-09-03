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
// see if numberBankis in localStorage, if so, load it,  if not, set it to the imported numbers
numberBank = numbers;
if (localStorage.getItem("numberBank")) {
  // if it is in localStorage, set the numberBankto the localStorage value
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
  const newNumber =
    numberBank[Math.floor(Math.random() * numberBank.length)];

  // randomly pick a field out of val, ar, ar_long and translit
  const fields = ["val", "ar", "ar_long", "translit"];
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
  // save the numberBankto localStorage (doesn't make that much sense here in the code but whatever)
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
  console.log("answer clicked", answer);
  indexOfAnswerClicked.value = possibleAnswers.value.indexOf(answer);
  // add or update the statistics object as the last item of the list of the number in numberbank
  const statsEntry = {
    date: new Date(),
    correct: answer === correctAnswer.value,
    answer: answer,
    prompt: prompt.value,
  };
  randomNumber.stats.push(statsEntry);
  // save to localStorage
  localStorage.setItem("numberBank", JSON.stringify(numberBank));
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
