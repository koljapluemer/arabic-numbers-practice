---
layout: post
title: A Spaced Repetition Algorithm to learn Arabic Numbers
tags:
  - learning
  - deliberate-practice
  - spaced-repetition
  - lessons-learned
  - arabic
  - "#its"
description: Lessons learned from designing a custom Intra-Session Spaced Reptition learning system for Arabic numbers.
---


I recently built [a little game](https://arabic-numbers.koljapluemer.com/) to practice the numbers from zero to hundred in Egyptian Arabic. To this end, I handcrafted a Spaced Repetition algorithm. This is a little write-up on the algorithm design. I'll not go into detail about the game's features, so if you want to follow along, it may be worth to honor the game with a minute or two of playing time first.

### The base

As usual, I started building the algo based on the [foundational 1967 Pimsleur paper](https://www.jstor.org/stable/321812?seq=1); meaning you start with an interval of a couple seconds, which you then rapidly grow when an item is remembered correctly. Pimsleur proposes a five second interval to start with and subsequently iterating the exponent - so you'd get 5s, 25s, 125s, 625s, and so on. I start with 10s, doubling the interval with every correct guess.

Why these values? Well, Pimsleur designed his math by making assumptions based on empirical forgetting curves, although he takes care to point out that his models are more of a best guess than a precise mapping. 

I'm somewhat worse; my values are picked by feeling alone. However, in my defense, there are other considerations beside optimal memory modeling to be made here. For example, Pimsleur assumes that we have a human teacher, prompting a student. I'm making a game where the user clicks a button to guess, then another to go to the next exercise. Both of these have what you may call a core game loop which takes a certain amount of time. Since I also have a pool of exercises that may be learned in, parallel, the interval between reviews is more of an expression of how many other exercises will be reviewed in-between review one and two of specific item X. Therefor, exact second values will in a way be "discretized", making it impossible to follow any forgetting curve cleanly (even if I had an accurate one for this use case lying around).

Nonetheless, my guessed math here is probably quite far off, so one of the things I did in this project is actually track pseudonymous learning data. However, I did not do any analysis of the data yet, so let's schedule that for a future post.

### Interval calculation details

Back to the algorithm. 

This is in fact the second time I'm implementing a hand-crafted, Pimsleur-inspired SR algo. Since I didn't actually collect data on [my previous implementation](https://koljapluemer.com/2023/08/12/pimsleur-intra-session-sr.html), the core flow of the algorithm is quite comparable:

- If an item was answered correctly... 
	- ...we double the interval and multiply it by the number of times the item was answered correctly consecutively.
	- However, when the item's last review was more than 16 hours (=a day) ago, we set the interval to at least 16 hours. Since an item that staid in memory for a day will likely do so for another day at least, it would be silly to give it an interval of, say, 20 seconds.
- If an item was answered incorrectly, we half the interval (but it will be kept at a minimum of 10s)

As mentioned, this is essentially the same naive implementation that I did last time. The only really interesting part is the "hack" with the sixteen hours. That's the kind of stuff that algos like SM-2 never had to deal with, since their smallest interval (as well as unit of calculation) is usually one day.

### Parent Items

In my previous implementations of learning systems, I always avoided any kind of levels, stepped progressions and the like. Not possible with this project: If you have several exercises (match Western script with Arabic script, match transliteration with English long-form, match Arabic long-form with Western script, ...) relating to a certain number (say: 16), it's pretty obvious that they all belong, well, to the number 16. Now you have to consider whether there is merit to ideas like learning one number before moving on to the next. And whether numbers should be practiced in order. And so on.

I attacked this problem by generating all possible exercises for all numbers from 0 to 100, clearly matching them to their parent number. Additionally, I gave the parent number SR properties like an interval and a due date as well, handled very similarly than the exercise's SR as well.

By the way, if you want to see the code, it's in [a public repo](https://github.com/koljapluemer/arabic-numbers-practice).

### Next Item Selection

The real intricacies happen in the selection of the next exercise item. This is also where the parent item idea starts to be useful. In summary, the next item is chosen as follows:

* (1) We check whether the player has done less than 10 exercises this session. If so, we limit the exercise pool to *easy exercises*.

An *easy exercise* is defined by the type of prompt and the type of answer. Specifically, *easy exercises* exclude items requiring the player to read Arabic script, which may be overwhelming for a total beginner (this is my nod towards having a "tutorial" or "intro", because I really just throw players into the game without much guidance). In code, *easy exercises* are selected as follows:

```
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

const easyExerciseTypes = ["val", "ar", "transliteration"];
```

Here is an example for each of the types:
- *val*: 2
- *ar*: ٢
- *ar_long*: اتنين
- *transliteration*: itneed
- *en*: two

Every exercise who does not have one of the *easy exercise types* as both answer and prompt is simply filtered out.

- (2) Next, we get a set of due exercises that the player has done before (*old set*), and another set of exercises never done (*new set*). Note that an exercise is only "due" if both the exercise and its parent are due. In practice, this prevents the boring scenario of having a seemingly endless stream of exercises relating to a specific number, which is boring.
- (3) Now, we decide whether to get an exercise from the *new* or the *old set*. At this point, I built in another mechanic dedicated to making the game more interesting: The more exercises the player gets right consecutively (*streak*), the likelier it is that a *new* exercise is picked (presuming that they are harder). In code, this is expressed as follows:

```
  const forNewExerciseMustBeLargerThan = Math.max(
    0.8 - streak.value * 0.03,
    0.1
  );
  let pickNewExercise =
    Math.random() > forNewExerciseMustBeLargerThan ||
    (oldDueExercises.length == 0 && newDueExercises.length > 0);
```

As you may have noticed, this also catches the case that no *old* exercises exist, in which case we always pick a *new* exercise. The case that no items are due at all is caught earlier. I learned in previous SR implementations that these kind of edge cases are as common as they're vicious. Take care.

- (4) A random exercise from the chosen set is picked, limited to the those 50 items that have been due for the longest time (this is an attempt to keep actual intervals sort of close to the calculated ideal ones [which are of course guessed, but hey]).

### Recap: Game design angle

I'm currently diving into the field of game design - recommendation for [The Art of Game Design](https://www.goodreads.com/book/show/3396933-the-art-of-game-design), by the way - and thus was inspired to make this learning system a bit more game-like. Not that I'm great at that (yet), but I think that may be an aspect often overlooked in SR applications. Anyways. I mentioned most of these items in some capacity already, but here is an overview of all game-y features:

- *Easy exercises* at the beginning to not overwhelm
- (Naively) picking harder exercises the more the player gets right
- Preventing players to feel "stuck" on one number by giving the numbers itself SR properties
- Very simple missions and statistics
- Shine and shake animation to point at the correct answer for new exercises, but only when the user does not have an ongoing streak of three items or more (difficulty/frustration modulation)

### Generation of answer options

Another thing I did for the first time is implementing single-choice-questions. Being able to check the correctness of an answer without having to rely on the player's self-judgement is great. However, it does open up the question on which answer options to show for each exercise.

My general implementation is probably not surprising: Every exercise has four possible answers the player may click. One is correct. The other three are randomly chosen from the exercise pool, although all answer options are of the same type (e.g., all are in Arabic script). Implementing is actually not entirely trivial, but uninteresting from an SR-design perspective.

But I did add a feature that I rather like: *Mean answer options*. A *mean answer option* is of the same type as the correct answer and also belonging to a number that neighbors the correct answer's parent number. My idea here is that it's probably harder (and more useful from a learning perspective) to differentiate 7 from 8 than it is to differentiate 7 from 43. I do not only use direct numbers; a *mean answer option* may be calculated by subtracting or adding 1,2 or 3 from the correct number.

In my own learning with this app, this helped me tremendously to practice differentiating actually similar numbers.

### Closing Thoughts

At the end of this somewhat jumbled accord, some more unconnected thoughts:

- This projects feeds into a larger question I've been entertaining for a while now: Is it better to have a single learning system that's capable of teaching all kinds of topics, or do specialized tools win in the end? On the one hand, I was able to code some neat features very specifically relating to practicing numbers, on the other hand, you can ostensibly learn the Arabic numbers by just creating Anki cards.
- I definitely need to parse, prepare and analyze the gathered learning data to see if all these algo design decisions actually make sense. Stay tuned.
- *Gamification* stays a weird topic. Learning systems definitely may be improved by making them an enjoyable game, yet creating something that is both an excellent *game* and a valuable tool for an intrinsically motivated user is very hard in a very strange way.