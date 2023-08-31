<script setup>
import numbers from "./numbers.js";
import { ref } from "vue";

let randomNumber = ref([]);
let numberBank = [];
let unitsPracticedToday = 0;
let unitsPracticedYesterday = 0;
// see if numberBankis in localStorage, if so, load it,  if not, set it to the imported numbers
if (!localStorage.getItem("numberBank")) {
  numberBank.value = numbers;
} else {
  // if it is in localStorage, set the numberBankto the localStorage value
  numberBank.value = JSON.parse(localStorage.getItem("numberBank"));
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

function getRandomNumber() {
  isRevealed.value = false;
  console.log("picking number from", numberBank);
  const newNumber =
    numberBank.value[Math.floor(Math.random() * numberBank.value.length)];

  randomNumber.value = newNumber;
  // save the numberBankto localStorage (doesn't make that much sense here in the code but whatever)
  localStorage.setItem("numberBank", JSON.stringify(numberBank.value));
}

let isRevealed = ref(false);

let valueEase = ref(null);
let valueCorrect = ref(null);
let valueAnki = ref(null);

getRandomNumber();
</script>

<template>
  <small> Practiced {{ stats.counter }} times so far </small>
  <div
    class="card bg-gray-600 shadow-xl m-4 p-4 flex flex-col items-center w-full max-w-screen-xl"
  >
    <div class="card-body text-xl">
      {{ randomNumber}}
    </div>
    <div class="card-actions justify-end mt-6 pt-2">
      <button class="btn btn-primary" @click="getRandomNumber">Next</button>
    </div>
  </div>
</template>

<style scoped></style>
