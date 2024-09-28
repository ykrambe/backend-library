// SOAL ALGORITMA

//SOAL 1
function reverseString(input) {
  const letters = input.replace(/[0-9]/g, ''); // get only letters
  const numbers = input.replace(/[a-zA-Z]/g, ''); // get only numbers

  const reversedLetters = letters.split('').reverse().join(''); // reverse letters
  return reversedLetters + numbers;
}

console.log("No 1.",reverseString("NEGIE1"));

//SOAL 2
function findLongestWord(sentence) {
  const words = sentence.split(' ');

  let longestWord = words[0];
    for (let word of words) {//looping to find longest word
    if (word.length > longestWord.length) {
      longestWord = word;
    }
  }

  return `${longestWord.length} character`;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
console.log("No 2.",findLongestWord(sentence));

//SOAL 3
function countOccurrences(input, query ) {
  return query.map(q => input.filter(word => word === q).length);
}

const input = ['xc', 'dz', 'bbb', 'dz'];
const query = ['bbb', 'ac', 'dz'];
console.log("No 3.",countOccurrences(input, query));

//SOAL 4
function sumDiagonalDifference(matrix) {
  const n = matrix.length;
  let primaryDiagonalSum = 0;
  let secondaryDiagonalSum = 0;

  for (let i = 0; i < n; i++) {
    primaryDiagonalSum += matrix[i][i]; // main diagonal
    secondaryDiagonalSum += matrix[i][n - 1 - i]; // secondary diagonal
  }

  return Math.abs(primaryDiagonalSum - secondaryDiagonalSum);
}

const matrix = [
  [1, 2, 0],
  [4, 5, 6],
  [7, 8, 9]
];

console.log("No 4.", sumDiagonalDifference(matrix));



