<script setup>
import numbers from "./numbers.js";
import { ref } from "vue";

let numberBank = numbers;
console.log("numberBank", numberBank);
let fieldUsedAsPrompt = "";
let fieldUsedAsAnswer = "";
let possibleAnswers = [];
let prompt = "";
let correctAnswer = "";
let givenAnswer = "";
let indexOfAnswerClicked = null;
let unitsPracticedToday = 0;
let unitsPracticedYesterday = 0;
const exercise = ref(null);
// see if numberBank is in localStorage, if so, load it,  if not, set it to the imported numbers (feel free to disable conditional for developing)
if (localStorage.getItem("numberBank")) {
  // if it is in localStorage, set the numberBank to the localStorage value
  // numberBank = JSON.parse(localStorage.getItem("numberBank"));
}

let exercises = [];
// loop the number bank, add all possible exercises to the exercises array
// all possible exercises: all pairs of prompts and answer types (val, ar, ar_long, transliteration)
// also add a stats and sr property to each exercise, and take the level property from the parent element from numberBack:
const possibleExerciseCombinations = [
  ["val", "ar"],
  ["val", "ar_long"],
  ["val", "transliteration"],
  ["ar", "val"],
  ["ar", "ar_long"],
  ["ar", "transliteration"],
  ["ar", "en"],
  ["ar_long", "val"],
  ["ar_long", "ar"],
  ["ar_long", "transliteration"],
  ["ar_long", "en"],
  ["en", "ar"],
  ["en", "ar_long"],
  ["en", "transliteration"],
  ["transliteration", "val"],
  ["transliteration", "ar"],
  ["transliteration", "ar_long"],
  ["transliteration", "en"],
];

console.log("possibleExerciseCombinations", possibleExerciseCombinations);
for (const number of numberBank) {
  for (const exerciseCombination of possibleExerciseCombinations) {
    const ex = {
      promptType: exerciseCombination[0],
      answerType: exerciseCombination[1],
      prompt: number[exerciseCombination[0]],
      correctAnswer: number[exerciseCombination[1]],
      stats: [],
      sr: {
        repetitions: 0,
        interval: 10,
        dueAt: Math.floor(new Date().getTime() / 1000),
      },
      number: number,
    };
    exercises.push(ex);
  }
}

console.log("exercises", exercises);

function getNextExercise() {
  guessMade.value = false;

  // new exercises are those whose stats array is empty
  const newDueExercises = exercises.filter(
    (exercise) => exercise.stats.length == 0
  );
  const oldDueExercises = exercises.filter(
    (exercise) =>
      exercise.stats.length > 0 &&
      exercise.sr.dueAt <= Math.floor(new Date().getTime() / 1000)
  );
  console.log(
    `there are ${newDueExercises.length} new exercises and ${oldDueExercises.length} old exercises`
  );
  // in case there are no exercises due, make a popup and return
  if (newDueExercises.length == 0 && oldDueExercises.length == 0) {
    alert("You have nothing left to do right now! Come back later!");
    return;
  }
  // pick an old exercise with 80% chance. But:
  // if there are no old exercises, always pick a new one
  // and if there are no new exercises, always pick an old one
  let pickNewExercise =
    Math.random() > 0.8 ||
    (oldDueExercises.length == 0 && newDueExercises.length > 0);
  console.log(
    pickNewExercise ? "Picking new exercise" : "Picking old exercise"
  );
  // always pick the one that has been due the longest
  let newExercise = {};
  const randomIndex = Math.floor(Math.random() * 50);
  console.log("randomIndex", randomIndex);
  if (pickNewExercise) {
    // pick a new exercise
    newExercise = newDueExercises.sort((a, b) => a.sr.dueAt - b.sr.dueAt)[
      Math.min(randomIndex, newDueExercises.length - 1)
    ];
  } else {
    // pick an old exercise
    newExercise = oldDueExercises.sort((a, b) => a.sr.dueAt - b.sr.dueAt)[
      Math.min(randomIndex, oldDueExercises.length - 1)
    ];
  }
  exercise.value = newExercise;
  console.log("exercise picked:", exercise);

  fieldUsedAsPrompt = exercise.value.promptType;
  fieldUsedAsAnswer = exercise.value.answerType;
  prompt = exercise.value.prompt;
  correctAnswer = exercise.value.correctAnswer;
  // have a 4 possible answer fields: one is the correct one, the rest is wrong ones picked from the data
  possibleAnswers = [exercise.value.correctAnswer];
  // now, get 3 random wrong answers with the same type as the correct answer
  for (let i = 0; i < 3; i++) {
    let newWrongAnswer =
      numberBank[Math.floor(Math.random() * numberBank.length)][
        exercise.value.answerType
      ];
    while (
      possibleAnswers.includes(newWrongAnswer) ||
      newWrongAnswer == correctAnswer
    ) {
      newWrongAnswer =
        numberBank[Math.floor(Math.random() * numberBank.length)][
          exercise.value.answerType
        ];
    }
    possibleAnswers.push(newWrongAnswer);
  }
  // shuffle the possible answers
  possibleAnswers = possibleAnswers.sort(() => Math.random() - 0.5);
}

let guessMade = ref(false);

getNextExercise();

function userSawExerciseBefore() {
  return exercise.value.stats.length > 0;
}

function handleAnswer(answer) {
  const guessWasCorrect = answer === correctAnswer;
  guessMade.value = true;
  givenAnswer = answer;
  indexOfAnswerClicked = possibleAnswers.indexOf(answer);

  // if answer correct, double interval, if incorrect, half interval (minimum 10)
  if (guessWasCorrect) {
    exercise.value.sr.repetitions++;
    exercise.value.number.level++;
    exercise.value.sr.interval =
      exercise.value.sr.interval * 2 * exercise.value.sr.repetitions;
  } else {
    exercise.value.sr.repetitions = 0;
    // divide level by 2 and round down
    exercise.value.number.level = Math.floor(
      exercise.value.number.level / 2
    );
    exercise.value.sr.interval = Math.max(exercise.value.sr.interval / 2, 10);
  }

  // set dueAt to now + interval
  exercise.value.sr.dueAt =
    Math.floor(new Date().getTime() / 1000) + exercise.value.sr.interval;
  const statsObj = {
    guessWasCorrect: guessWasCorrect,
    guess: answer,
    correctAnswer: correctAnswer,
    prompt: prompt,
    promptType: fieldUsedAsPrompt,
    answerType: fieldUsedAsAnswer,
    timestamp: Math.floor(new Date().getTime() / 1000),
  };
  exercise.value.stats.push(statsObj);
  console.log("exercise data updated:", exercise);
}
</script>

<template>
  <!-- <small> Practiced {{ stats.counter }} times so far </small> -->
  <div
    class="card bg-gray-600 shadow-xl m-4 p-4 flex flex-col justify-start items-center w-3/4 max-w-screen-xl"
    v-if="exercise"
    style="min-height: 450px"
  >
    <div id="prompt" class="text-2xl">
      {{ prompt }}
    </div>
    <div class="card-actions flex-col justify-end mt-6 pt-2">
      <button
        class="btn text-2xl w-full max-w-1/3 lowercase"
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
            !userSawExerciseBefore(prompt),
        }"
        v-for="(answer, index) in possibleAnswers"
        @click="handleAnswer(answer)"
      >
        {{ answer }}
      </button>

      <button
        class="btn btn-primary mt-4 self-end"
        @click="getNextExercise"
        v-if="guessMade"
      >
        Next
      </button>
    </div>
  </div>

  <div class="grid grid-cols-10 gap-2">
    <div
      v-for="(number, index) in numbers"
      :key="index"
      class="w-10 h-10 flex items-center justify-center bg-gray-900 relative rounded"
    >
      <!-- Battery bar -->
      <div
        class="absolute inset-0 bg-green-500 bottom-0"
        :style="{ height: number.level * 10 + '%' }"
      ></div>
      {{ number.val }}
    </div>
  </div>

  <footer>
    <small
      >More cool stuff at
      <a class="underline" href="https://koljapluemer.com/"
        >koljapluemer.com</a
      ></small
    >
  </footer>
</template>

<style scoped></style>
