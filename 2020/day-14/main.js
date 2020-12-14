const fs = require('fs');
const path = require('path');

function main() {
  const lines = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8').split('\n');

  console.log('Part one solution: ', one(lines));

  console.log('Part two solution: ', two(lines));
}

function applyMask(mask, value) {
  let binaryValue = parseInt(value).toString(2);

  binaryValue =
    Array.from({ length: mask.length - binaryValue.length }, () => '0').join('') + binaryValue;

  binaryValue = Array.from(binaryValue)
    .map((bit, i) => (mask.charAt(i) === 'X' ? bit : mask.charAt(i)))
    .reduce((acc, val) => acc + val, '');

  return parseInt(binaryValue, 2);
}

function* generateBinary(bitCount) {
  let i = 0;

  while (true) {
    const num = (i++).toString(2);

    yield Array.from({ length: bitCount - num.length }, () => '0').join('') + num;
  }
}

function one(lines) {
  let mask;
  const memory = {};

  for (const line of lines) {
    if (line.startsWith('mask = ')) {
      mask = line.split(' = ')[1];

      continue;
    }

    const { mem, value } = line.match(/^mem\[(?<mem>\d+)]\s=\s(?<value>\d+)$/).groups;

    memory[mem] = applyMask(mask, value);
  }

  return Object.values(memory).reduce((acc, val) => acc + val, 0);
}

function getMemoryLocations(mask, mem) {
  const xCount = (mask.match(/X/gi) || []).length;

  if (xCount === 0) return [xCount];

  const binaryNumber = generateBinary(xCount);
  const memLocations = [];
  let nextValue = binaryNumber.next().value;

  while (nextValue.length === xCount) {
    let memBinary = mem.toString(2);

    memBinary =
      Array.from({ length: mask.length - memBinary.length }, () => '0').join('') + memBinary;

    memBinary = Array.from(memBinary)
      .map((bit, i) => (mask.charAt(i) === 'X' ? 'X' : mask.charAt(i) === '0' ? bit : '1'))
      .reduce((acc, val) => acc + val, '');

    let memLocation = memBinary;

    for (const bit of nextValue) memLocation = memLocation.replace('X', bit);

    memLocations.push(parseInt(memLocation, 2));

    nextValue = binaryNumber.next().value;
  }

  return memLocations;
}

function two(lines) {
  let mask;
  const memory = {};

  for (const line of lines) {
    if (line.startsWith('mask = ')) {
      mask = line.split(' = ')[1];

      continue;
    }

    const { mem, value } = line.match(/^mem\[(?<mem>\d+)]\s=\s(?<value>\d+)$/).groups;

    const memoryLocations = getMemoryLocations(mask, parseInt(mem));

    for (const memoryLocation of memoryLocations) memory[memoryLocation] = value;
  }

  return Object.values(memory).reduce((acc, val) => acc + parseInt(val), 0);
}

main();
