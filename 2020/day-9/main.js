const fs = require('fs');
const path = require('path');

function main() {
  const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

  const inputStream = input.split('\n').map((number) => {
    return parseInt(number);
  });

  const invalidNumber = one(inputStream);

  console.log('Part one solution: ', invalidNumber);

  console.log('Part two solution: ', two(inputStream, invalidNumber));
}

function isSumOfPrevious(number, array) {
  const workingArray = [...array].sort((a, b) => a - b);

  let low = 0;
  let high = workingArray.length - 1;
  let sum = workingArray[low] + workingArray[high];

  while (sum !== number) {
    if (high <= low) return false;
    if (sum < number) low++;
    else high--;

    sum = workingArray[low] + workingArray[high];
  }

  return true;
}

function one(inputStream) {
  const BUFFER_SIZE = 25;

  const buffer = inputStream.slice(0, BUFFER_SIZE);

  for (let i = BUFFER_SIZE; i < inputStream.length; i++) {
    if (!isSumOfPrevious(inputStream[i], buffer)) return inputStream[i];

    buffer[i % BUFFER_SIZE] = inputStream[i];
  }

  return null;
}

Array.prototype.sum = function sum() {
  return this.reduce((acc, curr) => acc + curr, 0);
};

function findContiguousSet(inputStream, invalidNumber) {
  const BUFFER_SIZE = 25;

  const buffer = inputStream.slice(0, BUFFER_SIZE);

  for (let i = BUFFER_SIZE; i < inputStream.length; i++) {
    if (inputStream.sum() < invalidNumber) continue;

    for (let j = 0; j < BUFFER_SIZE; j++) {
      let k = j;
      let sum = buffer[j];

      while (sum < invalidNumber && ++k < BUFFER_SIZE) sum += buffer[k];
      if (sum === invalidNumber) return buffer.slice(j, k);
    }

    buffer[i % BUFFER_SIZE] = inputStream[i];
  }
}

function two(inputStream, invalidNumber) {
  const contiguousSet = findContiguousSet(inputStream, invalidNumber) || [0];

  return Math.min(...contiguousSet) + Math.max(...contiguousSet);
}

main();
