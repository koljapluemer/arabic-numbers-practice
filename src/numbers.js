const numbers = [
  { val: 0, ar: "٠", ar_long: "صفر", en: "Zero", translit: "sifr", stats: [], level: 0 },
  { val: 1, ar: "١", ar_long: "واحد", en: "One", translit: "wahed", stats: [], level: 0 },
  { val: 2, ar: "٢", ar_long: "اتنين", en: "Two", translit: "itneen", stats: [], level: 0 },
  { val: 3, ar: "٣", ar_long: "تلاتة", en: "Three", translit: "talata", stats: [], level: 0 },
  { val: 4, ar: "٤", ar_long: "أربعة", en: "Four", translit: "arba'a", stats: [], level: 0 },
  { val: 5, ar: "٥", ar_long: "خمسة", en: "Five", translit: "khamsa", stats: [], level: 0 },
  { val: 6, ar: "٦", ar_long: "ستة", en: "Six", translit: "sitta", stats: [], level: 0 },
  { val: 7, ar: "٧", ar_long: "سبعة", en: "Seven", translit: "saba'a", stats: [], level: 0 },
  { val: 8, ar: "٨", ar_long: "تمنية", en: "Eight", translit: "tamanya", stats: [], level: 0 },
  { val: 9, ar: "٩", ar_long: "تسعة", en: "Nine", translit: "tes'a", stats: [], level: 0 },
  { val: 10, ar: "١٠", ar_long: "عشرة", en: "Ten", translit: "ashara", stats: [], level: 1 },
  { val: 11, ar: "١١", ar_long: "أحد عشر", en: "Eleven", translit: "ahad 'ashar", stats: [], level: 2 },
  { val: 12, ar: "١٢", ar_long: "اتنا عشر", en: "Twelve", translit: "itna 'ashar", stats: [], level: 2 },
  { val: 13, ar: "١٣", ar_long: "تلاتا عشر", en: "Thirteen", translit: "talata 'ashar", stats: [], level: 2 },
  { val: 14, ar: "١٤", ar_long: "أربعة عشر", en: "Fourteen", translit: "arba'a 'ashar", stats: [], level: 2 },
  { val: 15, ar: "١٥", ar_long: "خمسة عشر", en: "Fifteen", translit: "khamsa 'ashar", stats: [], level: 2 },
  { val: 16, ar: "١٦", ar_long: "ستة عشر", en: "Sixteen", translit: "sitta 'ashar", stats: [], level: 2 },
  { val: 17, ar: "١٧", ar_long: "سبعة عشر", en: "Seventeen", translit: "saba'a 'ashar", stats: [], level: 2 },
  { val: 18, ar: "١٨", ar_long: "تمنية عشر", en: "Eighteen", translit: "tamanya 'ashar", stats: [], level: 2 },
  { val: 19, ar: "١٩", ar_long: "تسعة عشر", en: "Nineteen", translit: "tes'a 'ashar", stats: [], level: 2 },
  { val: 20, ar: "٢٠", ar_long: "عشرين", en: "Twenty", translit: "ishreen", stats: [], level: 1 },
  { val: 21, ar: "٢١", ar_long: "واحد وعشرين", en: "Twenty-One", translit: "wahed w'ishreen", stats: [], level: 4 },
  { val: 22, ar: "٢٢", ar_long: "اتنين وعشرين", en: "Twenty-Two", translit: "itneen w'ishreen", stats: [], level: 4 },
  { val: 23, ar: "٢٣", ar_long: "تلاتة وعشرين", en: "Twenty-Three", translit: "talata w'ishreen", stats: [], level: 4 },
  { val: 24, ar: "٢٤", ar_long: "أربعة وعشرين", en: "Twenty-Four", translit: "arba'a w'ishreen", stats: [], level: 4 },
  { val: 25, ar: "٢٥", ar_long: "خمسة وعشرين", en: "Twenty-Five", translit: "khamsa w'ishreen", stats: [], level: 4 },
  { val: 26, ar: "٢٦", ar_long: "ستة وعشرين", en: "Twenty-Six", translit: "sitta w'ishreen", stats: [], level: 4 },
  { val: 27, ar: "٢٧", ar_long: "سبعة وعشرين", en: "Twenty-Seven", translit: "saba'a w'ishreen", stats: [], level: 4 },
  { val: 28, ar: "٢٨", ar_long: "تمنية وعشرين", en: "Twenty-Eight", translit: "tamanya w'ishreen", stats: [], level: 4 },
  { val: 29, ar: "٢٩", ar_long: "تسعة وعشرين", en: "Twenty-Nine", translit: "tes'a w'ishreen", stats: [], level: 4 },
  { val: 30, ar: "٣٠", ar_long: "تلاتين", en: "Thirty", translit: "talateen", stats: [], level: 3 },
  { val: 31, ar: "٣١", ar_long: "واحد وتلاتين", en: "Thirty-One", translit: "wahed w'talateen", stats: [], level: 4 },
  { val: 32, ar: "٣٢", ar_long: "اتنين وتلاتين", en: "Thirty-Two", translit: "itneen w'talateen", stats: [], level: 4 },
  { val: 33, ar: "٣٣", ar_long: "تلاتة وتلاتين", en: "Thirty-Three", translit: "talata w'talateen", stats: [], level: 4 },
  { val: 34, ar: "٣٤", ar_long: "أربعة وتلاتين", en: "Thirty-Four", translit: "arba'a w'talateen", stats: [], level: 4 },
  { val: 35, ar: "٣٥", ar_long: "خمسة وتلاتين", en: "Thirty-Five", translit: "khamsa w'talateen", stats: [], level: 4 },
  { val: 36, ar: "٣٦", ar_long: "ستة وتلاتين", en: "Thirty-Six", translit: "sitta w'talateen", stats: [], level: 4 },
  { val: 37, ar: "٣٧", ar_long: "سبعة وتلاتين", en: "Thirty-Seven", translit: "saba'a w'talateen", stats: [], level: 4 },
  { val: 38, ar: "٣٨", ar_long: "تمنية وتلاتين", en: "Thirty-Eight", translit: "tamanya w'talateen", stats: [], level: 4 },
  { val: 39, ar: "٣٩", ar_long: "تسعة وتلاتين", en: "Thirty-Nine", translit: "tes'a w'talateen", stats: [], level: 4 },
  { val: 40, ar: "٤٠", ar_long: "أربعين", en: "Forty", translit: "arba'een", stats: [], level: 3 },
  { val: 41, ar: "٤١", ar_long: "واحد وأربعين", en: "Forty-One", translit: "wahed w'arba'een", stats: [], level: 4 },
  { val: 42, ar: "٤٢", ar_long: "اتنين وأربعين", en: "Forty-Two", translit: "itneen w'arba'een", stats: [], level: 4 },
  { val: 43, ar: "٤٣", ar_long: "تلاتة وأربعين", en: "Forty-Three", translit: "talata w'arba'een", stats: [], level: 4 },
  { val: 44, ar: "٤٤", ar_long: "أربعة وأربعين", en: "Forty-Four", translit: "arba'a w'arba'een", stats: [], level: 4 },
  { val: 45, ar: "٤٥", ar_long: "خمسة وأربعين", en: "Forty-Five", translit: "khamsa w'arba'een", stats: [], level: 4 },
  { val: 46, ar: "٤٦", ar_long: "ستة وأربعين", en: "Forty-Six", translit: "sitta w'arba'een", stats: [], level: 4 },
  { val: 47, ar: "٤٧", ar_long: "سبعة وأربعين", en: "Forty-Seven", translit: "saba'a w'arba'een", stats: [], level: 4 },
  { val: 48, ar: "٤٨", ar_long: "تمنية وأربعين", en: "Forty-Eight", translit: "tamanya w'arba'een", stats: [], level: 4 },
  { val: 49, ar: "٤٩", ar_long: "تسعة وأربعين", en: "Forty-Nine", translit: "tes'a w'arba'een", stats: [], level: 4 },
  { val: 50, ar: "٥٠", ar_long: "خمسين", en: "Fifty", translit: "khamsin", stats: [], level: 3 },
  { val: 51, ar: "٥١", ar_long: "واحد وخمسين", en: "Fifty-One", translit: "wahed w'khamsin", stats: [], level: 4 },
  { val: 52, ar: "٥٢", ar_long: "اتنين وخمسين", en: "Fifty-Two", translit: "itneen w'khamsin", stats: [], level: 4 },
  { val: 53, ar: "٥٣", ar_long: "تلاتة وخمسين", en: "Fifty-Three", translit: "talata w'khamsin", stats: [], level: 4 },
  { val: 54, ar: "٥٤", ar_long: "أربعة وخمسين", en: "Fifty-Four", translit: "arba'a w'khamsin", stats: [], level: 4 },
  { val: 55, ar: "٥٥", ar_long: "خمسة وخمسين", en: "Fifty-Five", translit: "khamsa w'khamsin", stats: [], level: 4 },
  { val: 56, ar: "٥٦", ar_long: "ستة وخمسين", en: "Fifty-Six", translit: "sitta w'khamsin", stats: [], level: 4 },
  { val: 57, ar: "٥٧", ar_long: "سبعة وخمسين", en: "Fifty-Seven", translit: "saba'a w'khamsin", stats: [], level: 4 },
  { val: 58, ar: "٥٨", ar_long: "تمنية وخمسين", en: "Fifty-Eight", translit: "tamanya w'khamsin", stats: [], level: 4 },
  { val: 59, ar: "٥٩", ar_long: "تسعة وخمسين", en: "Fifty-Nine", translit: "tes'a w'khamsin", stats: [], level: 4 },
  { val: 60, ar: "٦٠", ar_long: "ستين", en: "Sixty", translit: "sittin", stats: [], level: 3 },
  { val: 61, ar: "٦١", ar_long: "واحد وستين", en: "Sixty-One", translit: "wahed w'sittin", stats: [], level: 4 },
  { val: 62, ar: "٦٢", ar_long: "اتنين وستين", en: "Sixty-Two", translit: "itneen w'sittin", stats: [], level: 4 },
  { val: 63, ar: "٦٣", ar_long: "تلاتة وستين", en: "Sixty-Three", translit: "talata w'sittin", stats: [], level: 4 },
  { val: 64, ar: "٦٤", ar_long: "أربعة وستين", en: "Sixty-Four", translit: "arba'a w'sittin", stats: [], level: 4 },
  { val: 65, ar: "٦٥", ar_long: "خمسة وستين", en: "Sixty-Five", translit: "khamsa w'sittin", stats: [], level: 4 },
  { val: 66, ar: "٦٦", ar_long: "ستة وستين", en: "Sixty-Six", translit: "sitta w'sittin", stats: [], level: 4 },
  { val: 67, ar: "٦٧", ar_long: "سبعة وستين", en: "Sixty-Seven", translit: "saba'a w'sittin", stats: [], level: 4 },
  { val: 68, ar: "٦٨", ar_long: "تمنية وستين", en: "Sixty-Eight", translit: "tamanya w'sittin", stats: [], level: 4 },
  { val: 69, ar: "٦٩", ar_long: "تسعة وستين", en: "Sixty-Nine", translit: "tes'a w'sittin", stats: [], level: 4 },
  { val: 70, ar: "٧٠", ar_long: "سبعين", en: "Seventy", translit: "saba'een", stats: [], level: 3 },
  { val: 71, ar: "٧١", ar_long: "واحد وسبعين", en: "Seventy-One", translit: "wahed w'saba'een", stats: [], level: 4 },
  { val: 72, ar: "٧٢", ar_long: "اتنين وسبعين", en: "Seventy-Two", translit: "itneen w'saba'een", stats: [], level: 4 },
  { val: 73, ar: "٧٣", ar_long: "تلاتة وسبعين", en: "Seventy-Three", translit: "talata w'saba'een", stats: [], level: 4 },
  { val: 74, ar: "٧٤", ar_long: "أربعة وسبعين", en: "Seventy-Four", translit: "arba'a w'saba'een", stats: [], level: 4 },
  { val: 75, ar: "٧٥", ar_long: "خمسة وسبعين", en: "Seventy-Five", translit: "khamsa w'saba'een", stats: [], level: 4 },
  { val: 76, ar: "٧٦", ar_long: "ستة وسبعين", en: "Seventy-Six", translit: "sitta w'saba'een", stats: [], level: 4 },
  { val: 77, ar: "٧٧", ar_long: "سبعة وسبعين", en: "Seventy-Seven", translit: "saba'a w'saba'een", stats: [], level: 4 },
  { val: 78, ar: "٧٨", ar_long: "تمنية وسبعين", en: "Seventy-Eight", translit: "tamanya w'saba'een", stats: [], level: 4 },
  { val: 79, ar: "٧٩", ar_long: "تسعة وسبعين", en: "Seventy-Nine", translit: "tes'a w'saba'een", stats: [], level: 4 },
  { val: 80, ar: "٨٠", ar_long: "تمانين", en: "Eighty", translit: "tamaneen", stats: [], level: 3 },
  { val: 81, ar: "٨١", ar_long: "واحد وتمانين", en: "Eighty-One", translit: "wahed w'tamaneen", stats: [], level: 4 },
  { val: 82, ar: "٨٢", ar_long: "اتنين وتمانين", en: "Eighty-Two", translit: "itneen w'tamaneen", stats: [], level: 4 },
  { val: 83, ar: "٨٣", ar_long: "تلاتة وتمانين", en: "Eighty-Three", translit: "talata w'tamaneen", stats: [], level: 4 },
  { val: 84, ar: "٨٤", ar_long: "أربعة وتمانين", en: "Eighty-Four", translit: "arba'a w'tamaneen", stats: [], level: 4 },
  { val: 85, ar: "٨٥", ar_long: "خمسة وتمانين", en: "Eighty-Five", translit: "khamsa w'tamaneen", stats: [], level: 4 },
  { val: 86, ar: "٨٦", ar_long: "ستة وتمانين", en: "Eighty-Six", translit: "sitta w'tamaneen", stats: [], level: 4 },
  { val: 87, ar: "٨٧", ar_long: "سبعة وتمانين", en: "Eighty-Seven", translit: "saba'a w'tamaneen", stats: [], level: 4 },
  { val: 88, ar: "٨٨", ar_long: "تمنية وتمانين", en: "Eighty-Eight", translit: "tamanya w'tamaneen", stats: [], level: 4 },
  { val: 89, ar: "٨٩", ar_long: "تسعة وتمانين", en: "Eighty-Nine", translit: "tes'a w'tamaneen", stats: [], level: 4 },
  { val: 90, ar: "٩٠", ar_long: "تسعين", en: "Ninety", translit: "tes'een", stats: [], level: 3 },
  { val: 91, ar: "٩١", ar_long: "واحد وتسعين", en: "Ninety-One", translit: "wahed w'tes'een", stats: [], level: 4 },
  { val: 92, ar: "٩٢", ar_long: "اتنين وتسعين", en: "Ninety-Two", translit: "itneen w'tes'een", stats: [], level: 4 },
  { val: 93, ar: "٩٣", ar_long: "تلاتة وتسعين", en: "Ninety-Three", translit: "talata w'tes'een", stats: [], level: 4 },
  { val: 94, ar: "٩٤", ar_long: "أربعة وتسعين", en: "Ninety-Four", translit: "arba'a w'tes'een", stats: [], level: 4 },
  { val: 95, ar: "٩٥", ar_long: "خمسة وتسعين", en: "Ninety-Five", translit: "khamsa w'tes'een", stats: [], level: 4 },
  { val: 96, ar: "٩٦", ar_long: "ستة وتسعين", en: "Ninety-Six", translit: "sitta w'tes'een", stats: [], level: 4 },
  { val: 97, ar: "٩٧", ar_long: "سبعة وتسعين", en: "Ninety-Seven", translit: "saba'a w'tes'een", stats: [], level: 4 },
  { val: 98, ar: "٩٨", ar_long: "تمنية وتسعين", en: "Ninety-Eight", translit: "tamanya w'tes'een", stats: [], level: 4 },
  { val: 99, ar: "٩٩", ar_long: "تسعة وتسعين", en: "Ninety-Nine", translit: "tes'a w'tes'een", stats: [], level: 4 },
  { val: 100, ar: "١٠٠", ar_long: "مئة", en: "Hundred", translit: "mi'a", stats: [], level: 4 },
];

export default numbers;
