const fs = require('fs');
const path = require('path');

function main() {
  const lines = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8').split('\n');

  const timestamp = parseInt(lines[0]);

  const buses = lines[1]
    .split(',')
    .map((bus, i) => ({ id: bus === 'x' ? null : parseInt(bus), offset: i }))
    .filter(({ id }) => id);

  console.log('Part one solution: ', one(timestamp, buses));

  console.log('Part two solution: ', two(buses));
}

function findBusDepartingAt(buses, timestamp) {
  return buses.find(({ id }) => timestamp % id === 0);
}

function one(timestamp, buses) {
  let departureTimestamp = timestamp;
  let bus = findBusDepartingAt(buses, departureTimestamp);

  while (!bus) bus = findBusDepartingAt(buses, ++departureTimestamp);

  return bus.id * (departureTimestamp - timestamp);
}

function findTimestampFor(buses, timestamp = buses[0].id, jump = buses[0].id) {
  while (true) {
    let breaked = false;

    for (const { id, offset } of buses) {
      if ((timestamp + offset) % id !== 0) {
        breaked = true;

        break;
      }
    }

    if (!breaked) break;

    timestamp += jump;
  }

  return timestamp;
}

function findTimestamp(buses, size = buses.length) {
  if (size == 2) return findTimestampFor(buses);

  const prevTimestamp = findTimestamp(buses.slice(0, size), size - 1);

  return findTimestampFor(
    buses,
    prevTimestamp,
    buses.slice(0, -1).reduce((acc, { id }) => acc * id, 1)
  );
}

function two(buses) {
  return findTimestamp(buses);
}

main();
