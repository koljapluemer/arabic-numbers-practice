<script setup lang="ts">
import { ref, watch } from "vue";
import numbers from "./numbers";
import type {
  AnswerValue,
  Exercise,
  ExerciseStat,
  ExerciseType,
  Missions,
  NumberEntry,
} from "./types";

let numberBank: NumberEntry[] = numbers;
const fieldUsedAsPrompt = ref<ExerciseType>("val");
const fieldUsedAsAnswer = ref<ExerciseType>("ar");
const possibleAnswers = ref<AnswerValue[]>([]);
const prompt = ref<AnswerValue>("");
const correctAnswer = ref<AnswerValue>("");
const givenAnswer = ref<AnswerValue>("");
const indexOfAnswerClicked = ref<number | null>(null);
const exercise = ref<Exercise | null>(null);
let exercisesDoneThisSession = 0;
let exercises: Exercise[] = [];
const streak = ref(0);
// loop the number bank, add all possible exercises to the exercises array
// all possible exercises: all pairs of prompts and answer types (val, ar, ar_long, transliteration)
// also add a stats and sr property to each exercise, and take the level property from the parent element from numberBank:
const possibleExerciseCombinations: Array<[ExerciseType, ExerciseType]> = [
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

const missions = ref<Missions>({
  "Exercises Done": {
    goals: [0, 10, 50, 100, 200, 500, 1000, 10000],
    progress: 0,
    currentGoal: 1,
  },
  Streak: {
    goals: [0, 3, 5, 10, 20, 50, 100, 200],
    progress: 0,
    currentGoal: 1,
  },
});
// if missions on localStorage, load it
const storedMissions = localStorage.getItem("missions");
if (storedMissions) {
  missions.value = JSON.parse(storedMissions) as Missions;
}

// if uid is not in localStorage, create one and save
let uid: string;
const storedUid = localStorage.getItem("uid");
if (storedUid) {
  uid = storedUid;
} else {
  uid = Math.random().toString(36).substring(2, 15);
  localStorage.setItem("uid", uid);
}

// deep watch missions and save to localStorage:
watch(
  missions,
  (newValue) => {
    localStorage.setItem("missions", JSON.stringify(newValue));
  },
  { deep: true }
);

const easyExerciseTypes: ExerciseType[] = ["val", "ar", "transliteration"];

function exerciseKey(
  promptType: ExerciseType,
  answerType: ExerciseType,
  numberVal: number
): string {
  return `${numberVal}:${promptType}:${answerType}`;
}

function createExercises(bank: NumberEntry[]): Exercise[] {
  const created: Exercise[] = [];
  for (const number of bank) {
    for (const exerciseCombination of possibleExerciseCombinations) {
      created.push({
        promptType: exerciseCombination[0],
        answerType: exerciseCombination[1],
        prompt: number[exerciseCombination[0] as keyof NumberEntry] as AnswerValue,
        correctAnswer: number[
          exerciseCombination[1] as keyof NumberEntry
        ] as AnswerValue,
        stats: [],
        sr: {
          repetitions: 0,
          interval: 10,
          dueAt: Math.floor(new Date().getTime() / 1000),
        },
        number: number,
      });
    }
  }
  return created;
}

// see if numberBank is in localStorage, if so, load it,  if not, set it to the imported numbers (feel free to disable conditional for developing)
const storedNumberBank = localStorage.getItem("numberBank");
if (storedNumberBank) {
  try {
    const parsed = JSON.parse(storedNumberBank);
    if (Array.isArray(parsed) && parsed.length > 0) {
      numberBank = parsed as NumberEntry[];
    }
  } catch {
    // Ignore malformed state and fall back to defaults.
  }
}
const defaultExercises = createExercises(numberBank);
exercises = defaultExercises;

// same for exercises
const storedExercises = localStorage.getItem("exercises");
if (storedExercises) {
  try {
    const parsed = JSON.parse(storedExercises);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const storedMap = new Map<string, Exercise>();
      for (const item of parsed) {
        if (!item || typeof item !== "object") continue;
        const candidate = item as Partial<Exercise>;
        if (
          !candidate.number ||
          typeof candidate.number.val !== "number" ||
          typeof candidate.promptType !== "string" ||
          typeof candidate.answerType !== "string"
        ) {
          continue;
        }
        storedMap.set(
          exerciseKey(
            candidate.promptType as ExerciseType,
            candidate.answerType as ExerciseType,
            candidate.number.val
          ),
          candidate as Exercise
        );
      }

      exercises = defaultExercises.map((defaultExercise) => {
        const stored = storedMap.get(
          exerciseKey(
            defaultExercise.promptType,
            defaultExercise.answerType,
            defaultExercise.number.val
          )
        );
        if (!stored) {
          return defaultExercise;
        }
        return {
          ...defaultExercise,
          stats: Array.isArray(stored.stats) ? stored.stats : defaultExercise.stats,
          sr:
            stored.sr &&
            typeof stored.sr.interval === "number" &&
            typeof stored.sr.repetitions === "number" &&
            typeof stored.sr.dueAt === "number"
              ? stored.sr
              : defaultExercise.sr,
        };
      });
    }
  } catch {
    // Ignore malformed state and keep generated defaults.
  }
}

function getNextExercise() {
  guessMade.value = false;
  let possibleExercises = exercises;
  // for the first 10 exercises, only use easy exercises
  if (exercisesDoneThisSession < 10) {
    possibleExercises = exercises.filter(
      (exercise) =>
        easyExerciseTypes.includes(exercise.promptType) &&
        easyExerciseTypes.includes(exercise.answerType)
    );
  }

  // new exercises are those whose stats array is empty
  const newDueExercises = possibleExercises.filter(
    (exercise) => exercise.stats.length == 0
  );
  // also check if parent number is due (or due is null)
  const oldDueExercises = possibleExercises.filter(
    (exercise) => {
      const parentDueAt = numberBank[exercise.number.val].sr.dueAt;
      return (
        exercise.stats.length > 0 &&
        exercise.sr.dueAt <= Math.floor(new Date().getTime() / 1000) &&
        (parentDueAt == null || parentDueAt <= Math.floor(new Date().getTime() / 1000))
      );
    }
  );
  if (newDueExercises.length == 0 && oldDueExercises.length == 0) {
    // Nothing is due now: fall back to the currently most overdue seen exercise
    // so users can keep practicing instead of getting blocked.
    const fallbackExercise = possibleExercises
      .filter((item) => item.stats.length > 0)
      .sort((a, b) => a.sr.dueAt - b.sr.dueAt)[0];

    if (!fallbackExercise) {
      alert("You have nothing left to do right now! Come back later!");
      return;
    }
    exercise.value = fallbackExercise;
  } else {
    // pick an old exercise with 80% chance. But:
    // if there are no old exercises, always pick a new one
    // and if there are no new exercises, always pick an old one
    // also, the longer streak goes one, the likelier that we pick a new exercise
    const forNewExerciseMustBeLargerThan = Math.max(
      0.8 - streak.value * 0.03,
      0.1
    );
    const pickNewExercise =
      Math.random() > forNewExerciseMustBeLargerThan ||
      (oldDueExercises.length == 0 && newDueExercises.length > 0);
    // always pick the one that has been due the longest
    const randomIndex = Math.floor(Math.random() * 50);
    if (pickNewExercise) {
      // pick a new exercise
      exercise.value = newDueExercises.sort((a, b) => a.sr.dueAt - b.sr.dueAt)[
        Math.min(randomIndex, newDueExercises.length - 1)
      ];
    } else {
      // pick an old exercise
      exercise.value = oldDueExercises.sort((a, b) => a.sr.dueAt - b.sr.dueAt)[
        Math.min(randomIndex, oldDueExercises.length - 1)
      ];
    }
  }

  const currentExercise = exercise.value;
  if (!currentExercise) {
    return;
  }

  fieldUsedAsPrompt.value = currentExercise.promptType;
  fieldUsedAsAnswer.value = currentExercise.answerType;
  prompt.value = currentExercise.prompt;
  correctAnswer.value = currentExercise.correctAnswer;
  // have a 4 possible answer fields: one is the correct one, the rest is wrong ones picked from the data
  possibleAnswers.value = [currentExercise.correctAnswer];
  // try to find a possible answer out of the pool of already practiced numbers (but the type must match):
  const alreadyPracticedExercises = exercises.filter(
    (exercise) => exercise.stats.length > 0
  );
  for (let i = 0; i < alreadyPracticedExercises.length; i++) {
    const alreadyPracticedExercise = alreadyPracticedExercises[i];
    if (
      alreadyPracticedExercise.answerType == currentExercise.answerType &&
      !possibleAnswers.value.includes(alreadyPracticedExercise.correctAnswer)
    ) {
      possibleAnswers.value.push(alreadyPracticedExercise.correctAnswer);
      break;
    }
  }
  // add a mean possible answer:
  // randomly pick the number that is either 3, 2, 1 smaller or bigger than the correct answer
  // catch edge cases (only numbers from 0 to 100 exists)
  // also don't add the answer if it is already in the possible answers
  const possibleMeanAnswerNumber =
    currentExercise.number.val + Math.floor(Math.random() * 7) - 3;
  if (possibleMeanAnswerNumber >= 0 && possibleMeanAnswerNumber <= 100) {
    const possibleMeanAnswer =
      numberBank[possibleMeanAnswerNumber][currentExercise.answerType];
    if (!possibleAnswers.value.includes(possibleMeanAnswer)) {
      possibleAnswers.value.push(possibleMeanAnswer);
    }
  }
  const lengthOfPossibleAnswers = possibleAnswers.value.length;
  // now, get random wrong answers with the same type as the correct answer (until we have 4 answers)
  for (let i = 0; i < 4 - lengthOfPossibleAnswers; i++) {
    let newWrongAnswer =
      numberBank[Math.floor(Math.random() * numberBank.length)][
      currentExercise.answerType
      ] as AnswerValue;
    while (
      possibleAnswers.value.includes(newWrongAnswer) ||
      newWrongAnswer == correctAnswer.value
    ) {
      newWrongAnswer =
        numberBank[Math.floor(Math.random() * numberBank.length)][
        currentExercise.answerType
        ] as AnswerValue;
    }
    possibleAnswers.value.push(newWrongAnswer);
  }
  // shuffle the possible answers
  possibleAnswers.value = possibleAnswers.value.sort(() => Math.random() - 0.5);
}

const guessMade = ref(false);

getNextExercise();

function userSawExerciseBefore() {
  return (exercise.value?.stats.length ?? 0) > 0;
}

function handleAnswer(answer: AnswerValue) {
  const currentExercise = exercise.value;
  if (!currentExercise) {
    return;
  }

  // MISSIONS
  missions.value["Exercises Done"].progress++;
  if (
    missions.value["Exercises Done"].progress >=
    missions.value["Exercises Done"].goals[
    missions.value["Exercises Done"].currentGoal
    ]
  ) {
    missions.value["Exercises Done"].currentGoal++;
  }
  // ---- //

  exercisesDoneThisSession++;
  const guessWasCorrect = answer === correctAnswer.value;
  guessMade.value = true;
  givenAnswer.value = answer;
  indexOfAnswerClicked.value = possibleAnswers.value.indexOf(answer);

  // if answer correct, double interval, if incorrect, half interval (minimum 10)
  if (guessWasCorrect) {
    streak.value++;
    // MISSIONS
    missions.value["Streak"].progress++;
    if (
      missions.value["Streak"].progress >=
      missions.value["Streak"].goals[missions.value["Streak"].currentGoal]
    ) {
      missions.value["Streak"].currentGoal++;
    }
    // ---- //
    currentExercise.sr.repetitions++;
    //  max level is 10
    numberBank[currentExercise.number.val].level = Math.min(
      numberBank[currentExercise.number.val].level + 1,
      10
    );
    currentExercise.sr.interval =
      currentExercise.sr.interval * 2 * currentExercise.sr.repetitions;
    // if the repetition before this one was more than 16h ago, set the interval to at least 16h
    if (
      currentExercise.stats.length > 1 &&
      currentExercise.stats[currentExercise.stats.length - 2].timestamp <
      Math.floor(new Date().getTime() / 1000) - 16 * 60 * 60
    ) {
      currentExercise.sr.interval = Math.max(
        currentExercise.sr.interval,
        16 * 60 * 60
      );
    }
    // also double the sr.interval of the parent number
    numberBank[currentExercise.number.val].sr.interval =
      numberBank[currentExercise.number.val].sr.interval * 2;
  } else {
    streak.value = 0;
    // MISSIONS
    missions.value["Streak"].progress = 0;
    // ---- //
    currentExercise.sr.repetitions = 0;
    // divide level by 2 and round down
    numberBank[currentExercise.number.val].level = Math.floor(
      numberBank[currentExercise.number.val].level / 2
    );
    currentExercise.sr.interval = Math.max(currentExercise.sr.interval / 2, 10);
    // also reset parent number interval
    numberBank[currentExercise.number.val].sr.interval =
      numberBank[currentExercise.number.val].sr.interval / 2;
  }

  // set dueAt to now + interval
  currentExercise.sr.dueAt =
    Math.floor(new Date().getTime() / 1000) + currentExercise.sr.interval;
  const statsObj: ExerciseStat = {
    guessWasCorrect: guessWasCorrect,
    guess: answer,
    correctAnswer: correctAnswer.value,
    prompt: prompt.value,
    promptType: fieldUsedAsPrompt.value,
    answerType: fieldUsedAsAnswer.value,
    timestamp: Math.floor(new Date().getTime() / 1000),
  };
  currentExercise.stats.push(statsObj);
  // set dueAt of parent exercise
  numberBank[currentExercise.number.val].sr.dueAt =
    Math.floor(new Date().getTime() / 1000) +
    numberBank[currentExercise.number.val].sr.interval;
  // save the numberBank and exercises to localStorage
  localStorage.setItem("numberBank", JSON.stringify(numberBank));
  localStorage.setItem("exercises", JSON.stringify(exercises));
}

function calculateColor(level: number): string {
  // make the bar go from 0=yellow to 10=green to 100=light-blue smoothly (so for example five will be a greenish yellow)
  if (level < 0) level = 0;
  if (level > 100) level = 100;

  // Define the HSL values for the specified levels
  const levels: Record<number, { h: number; s: number; l: number }> = {
    0: { h: 37, s: 89, l: 53 },
    10: { h: 106, s: 89, l: 53 },
    100: { h: 205, s: 89, l: 53 },
  };

  // If the level is one of the specified levels, return the corresponding color
  if (levels[level]) {
    const { h, s, l } = levels[level];
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  // For intermediate levels, interpolate between the specified levels
  const lowerLevel = Math.floor(level / 10) * 10;
  const upperLevel = Math.ceil(level / 10) * 10;

  const lowerColor = levels[lowerLevel] ?? levels[0];
  const upperColor = levels[upperLevel] ?? levels[100];

  const fraction = (level - lowerLevel) / (upperLevel - lowerLevel);

  const h = lowerColor.h + (upperColor.h - lowerColor.h) * fraction;
  const s = lowerColor.s + (upperColor.s - lowerColor.s) * fraction;
  const l = lowerColor.l + (upperColor.l - lowerColor.l) * fraction;

  return `hsl(${h}, ${s}%, ${l}%)`;
}

function convertNumberToArabicScript(number: number): string {
  const arabicNumbers: Record<string, string> = {
    "0": "٠",
    "1": "١",
    "2": "٢",
    "3": "٣",
    "4": "٤",
    "5": "٥",
    "6": "٦",
    "7": "٧",
    "8": "٨",
    "9": "٩",
  };
  const numberAsString = number.toString();
  let arabicNumber = "";
  for (const digit of numberAsString) {
    arabicNumber += arabicNumbers[digit] ?? digit;
  }
  return arabicNumber;
}
</script>

<template>
  <main class="p-2 flex flex-col items-center w-full max-w-xl gap-8">
    <div class="card shadow-md w-full" v-if="exercise" style="min-height: 390px">
      <div class="card-body flex flex-col items-center">
        <p class="border-b p-2" v-if="exercisesDoneThisSession < 3">
          Select the matching answers out of the four options below. If you are
          not sure, just guess!
        </p>
        <div id="prompt" class="text-3xl p-2">
          {{ prompt }}
        </div>
        <div class="card-actions flex-col justify-end mt-6 pt-2">
          <button style="line-height: 1em" class="btn text-2xl w-full lowercase p-2" :class="{
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
            'text-3xl': fieldUsedAsAnswer === 'ar',
            'shine-button wiggle-button':
              answer === correctAnswer &&
              streak < 3 &&
              !guessMade &&
              !userSawExerciseBefore(),
          }" v-for="(answer, index) in possibleAnswers" @click="handleAnswer(answer)">
            {{ answer }}
          </button>

          <button class="btn btn-primary mt-4 self-end" @click="getNextExercise" v-if="guessMade">
            Next
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-md w-full">
      <div class="card-body flex flex-col items-center">

        <h2 class="text-xl font-bold m-2">Missions</h2>
        <div class="m-2 flex flex-col max-w-md" v-for="(mission, name) in missions">
          {{ name }}
          <!-- progress bar: -->
          <progress class="w-full progress" :value="mission.progress"
            :max="mission.goals[mission.currentGoal]"></progress>
          <div>
            {{ convertNumberToArabicScript(mission.progress) }} /
            {{ convertNumberToArabicScript(mission.goals[mission.currentGoal]) }}
          </div>
        </div>

        <h2 class="text-xl font-bold m-2">Statistics</h2>

        <div class="grid gap-2" style="grid-template-columns: repeat(10, 1rem)">
          <div v-for="(number, index) in numberBank.sort((a, b) => a.val - b.val)" :key="index"
            class="w-4 h-4 flex items-center justify-center shadow-xs relative border border-gray-400 rounded">
            <!-- Battery bar -->
            <!-- make the bar go from 0=yellow to 10=green to 100=light-blue smoothly (so for example five will be a greenish yellow) -->
            <div class="absolute inset-0 bg-yellow-500 bottom-0 rounded" :style="{
              height: number.level * 10 + '%',
              backgroundColor: calculateColor(number.level),
            }" style="transition: height 0.5s ease"></div>
          </div>
        </div>
      </div>
    </div>

  </main>
  <footer class="border-t-2 mt-10 w-full p-4 text-sm">
        Made with ❤︎ by  
        <a class="underline" href="https://koljasam.com/">Kolja Sam</a>. Uses some functional cookies, but not for tracking. <a href="github.com/koljapluemer/arabic-numbers-practice">Open Source</a>.
  </footer>
</template>

<style scoped></style>
