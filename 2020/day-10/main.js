const fs = require('fs');
const path = require('path');

function main() {
  const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

  const inputStream = [
    0,
    ...input.split('\n').map((number) => {
      return parseInt(number);
    }),
  ];

  inputStream.push(Math.max(...inputStream) + 3);

  const { oneJoint, threeJoint } = one(inputStream);

  console.log('Part one solution: ', oneJoint * threeJoint);

  console.log('Part two solution: ', two(inputStream));
}

function one(inputStream) {
  let [oneJoint, twoJoint, threeJoint, currentJoint] = [0, 0, 0, 0];

  while (true) {
    let diff = 0;

    if (inputStream.includes(currentJoint + 1)) diff = 1;
    else if (inputStream.includes(currentJoint + 2)) diff = 2;
    else if (inputStream.includes(currentJoint + 3)) diff = 3;

    if (!diff) break;

    if (diff === 1) oneJoint++;
    else if (diff === 2) twoJoint++;
    else if (diff === 3) threeJoint++;

    currentJoint += diff;
  }

  return { oneJoint, twoJoint, threeJoint };
}

function countSubsets(index, input, substring = [], cache = {}) {
  if (index === input.length - 1) return 1;

  const currNumber = input[index];

  if (cache[currNumber]) return cache[currNumber];

  let count = 0;

  const nextNumbers = input.slice(index + 1);
  let i = 0;

  for (const nextNumber of nextNumbers) {
    if (nextNumber - currNumber > 3) break;
    if (i++ === 6) break;
    if (index + i >= input.length) break;

    count += countSubsets(index + i, input, [...substring, nextNumber], cache);
  }

  cache[currNumber] = count;

  return count;
}

function two(inputStream) {
  return countSubsets(
    0,
    inputStream.sort((a, b) => a - b)
  );
}

main();
