export type ExerciseType = 'val' | 'ar' | 'ar_long' | 'en' | 'transliteration'
export type AnswerValue = string | number

export interface SRState {
  interval: number
  repetitions: number
  dueAt: number | null
}

export interface NumberEntry {
  val: number
  ar: string
  ar_long: string
  en: string
  transliteration: string
  level: number
  sr: SRState
}

export interface ExerciseStat {
  guessWasCorrect: boolean
  guess: AnswerValue
  correctAnswer: AnswerValue
  prompt: AnswerValue
  promptType: ExerciseType
  answerType: ExerciseType
  timestamp: number
}

export interface Exercise {
  promptType: ExerciseType
  answerType: ExerciseType
  prompt: AnswerValue
  correctAnswer: AnswerValue
  stats: ExerciseStat[]
  sr: {
    repetitions: number
    interval: number
    dueAt: number
  }
  number: NumberEntry
}

export interface MissionProgress {
  goals: number[]
  progress: number
  currentGoal: number
}

export interface Missions {
  'Exercises Done': MissionProgress
  Streak: MissionProgress
}
