const fs = require('fs');
const path = require('path');

function main() {
  const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

  const map = input.split('\n').map((row) => {
    return row.split('');
  });

  console.log('Part one solution: ', one(map));

  console.log('Part two solution: ', two(map));
}

function getAliveNeightbors([x, y], map) {
  let aliveNeightbors = 0;

  if (x - 1 >= 0 && y - 1 >= 0 && map[y - 1]?.[x - 1] === '#') aliveNeightbors++;
  if (x - 1 >= 0 && map[y]?.[x - 1] === '#') aliveNeightbors++;
  if (x - 1 >= 0 && map[y + 1]?.[x - 1] === '#') aliveNeightbors++;

  if (map[y + 1]?.[x] === '#') aliveNeightbors++;

  if (map[y + 1]?.[x + 1] === '#') aliveNeightbors++;
  if (map[y]?.[x + 1] === '#') aliveNeightbors++;
  if (y - 1 >= 0 && map[y - 1]?.[x + 1] === '#') aliveNeightbors++;

  if (map[y - 1]?.[x] === '#') aliveNeightbors++;

  return aliveNeightbors;
}

function getStableMap(map, neighboutChecker, liveLimit = 4, cache = []) {
  let lastMap = null;
  let newMap = Array.from(map, (row) => Array.from(row));
  let emptyMap = Array.from(map, (row) => Array.from(row));

  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map.length; x++)
      if (map[y][x] === '.') emptyMap[y][x] = '.';
      else emptyMap[y][x] = '';

  do {
    lastMap = newMap;
    newMap = Array.from(emptyMap, (r) => [...r]);
    cache = [];

    for (let y = 0; y < lastMap.length; y++) {
      for (let x = 0; x < lastMap.length; x++) {
        if (lastMap[y][x] === '.') {
          // newMap[y][x] = '.';
          continue;
        }

        const aliveNeightbors = neighboutChecker([x, y], lastMap, cache);

        if (lastMap[y][x] === 'L' && aliveNeightbors === 0) {
          newMap[y][x] = '#';
          continue;
        }

        if (lastMap[y][x] === '#' && aliveNeightbors >= liveLimit) {
          newMap[y][x] = 'L';
          continue;
        }

        newMap[y][x] = lastMap[y][x];
      }
    }
  } while (JSON.stringify(lastMap) !== JSON.stringify(newMap));

  return newMap;
}

function one(map) {
  return getStableMap(map, getAliveNeightbors).reduce((acc, curr) => {
    acc += curr.reduce((a, c) => {
      a += c === '#' ? 1 : 0;

      return a;
    }, 0);

    return acc;
  }, 0);
}

const oppositeDirection = {
  T: 'B',
  TR: 'BL',
  R: 'L',
  BR: 'TL',
  B: 'T',
  BL: 'TR',
  L: 'R',
  TL: 'BR',
};

function findInDirection(direction, [x, y], map, cache) {
  if (cache[`${direction}-${x}-${y}`]) return cache[`${direction}-${x}-${y}`];

  const curr = { x, y };

  do {
    if (direction.includes('T')) curr.y--;
    if (direction.includes('R')) curr.x++;
    if (direction.includes('B')) curr.y++;
    if (direction.includes('L')) curr.x--;

    if (curr.x < 0 || curr.y < 0) break;
  } while (map[curr.y]?.[curr.x] === '.');

  if (curr.x < 0 || curr.y < 0) return 0;

  cache[`${oppositeDirection[direction]}-${curr.x}-${curr.y}`] = map[y]?.[x] === '#' ? 1 : 0;

  return map[curr.y]?.[curr.x] === '#' ? 1 : 0;
}

function getAliveNeightborsV2([x, y], map, cache) {
  let aliveNeightbors = 0;

  if (x !== 0) {
    aliveNeightbors += findInDirection('L', [x, y], map, cache);

    if (y !== 0) aliveNeightbors += findInDirection('TL', [x, y], map, cache);
    if (y !== map.length - 1) aliveNeightbors += findInDirection('BL', [x, y], map, cache);
  }

  if (x !== map.length - 1) {
    aliveNeightbors += findInDirection('R', [x, y], map, cache);

    if (y !== 0) aliveNeightbors += findInDirection('TR', [x, y], map, cache);
    if (y !== map.length - 1) aliveNeightbors += findInDirection('BR', [x, y], map, cache);
  }

  if (y !== 0) aliveNeightbors += findInDirection('T', [x, y], map, cache);
  if (y !== map.length - 1) aliveNeightbors += findInDirection('B', [x, y], map, cache);

  return aliveNeightbors;
}

function two(map) {
  return getStableMap([...map], getAliveNeightborsV2, 5).reduce((acc, curr) => {
    acc += curr.reduce((a, c) => {
      a += c === '#' ? 1 : 0;

      return a;
    }, 0);

    return acc;
  }, 0);
}

main();
