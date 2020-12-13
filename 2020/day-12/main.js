const fs = require('fs');
const path = require('path');

function main() {
  const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

  const actions = input.split('\n').map((actionString) => {
    return {
      action: actionString.charAt(0),
      value: parseInt(actionString.substring(1)),
    };
  });

  console.log('Part one solution: ', one(actions));

  console.log('Part two solution: ', two(actions));
}

function doAction({ action, value }, ship) {
  switch (action) {
    case 'N':
      return { ...ship, y: ship.y + value };
    case 'S':
      return { ...ship, y: ship.y - value };
    case 'E':
      return { ...ship, x: ship.x + value };
    case 'W':
      return { ...ship, x: ship.x - value };
    case 'L':
      return { ...ship, a: ship.a + value };
    case 'R':
      return { ...ship, a: ship.a - value };
    case 'F':
      if (ship.a === 0) return doAction({ action: 'E', value }, ship);
      if (ship.a === 90) return doAction({ action: 'N', value }, ship);
      if (ship.a === 180) return doAction({ action: 'W', value }, ship);
      if (ship.a === 270) return doAction({ action: 'S', value }, ship);
      throw new Exception('Well f**k you');
    default:
      throw new Exception('Well f**k you 2');
  }
}

function normalizeAngle(ship) {
  if ([0, 90, 180, 270].includes(ship.a)) return ship;

  if (ship.a > 0) return { ...ship, a: ship.a % 360 };

  let a = ship.a;
  while (a < 0) a += 360;

  return { ...ship, a };
}

function one(actions) {
  let ship = { x: 0, y: 0, a: 0 };

  for (const action of actions) {
    ship = normalizeAngle(doAction(action, ship));
  }

  return Math.abs(ship.x) + Math.abs(ship.y);
}

function rotateAround({ action, value }, waypoint) {
  if (action === 'R') return rotateAround({ action: 'L', value: 360 - value }, waypoint);
  if (value === 0) return waypoint;
  if (value === 180) return { x: -waypoint.x, y: -waypoint.y };

  if (value % 90 !== 0) throw new Exception('Well f**k you 2');

  const radians = (value * Math.PI) / 180;

  const cos = Math.round(Math.cos(radians));
  const sin = Math.round(Math.sin(radians));

  return {
    x: cos * waypoint.x - sin * waypoint.y,
    y: sin * waypoint.x + cos * waypoint.y,
  };
}

function two(actions) {
  let waypoint = { x: 10, y: 1 };
  let ship = { x: 0, y: 0 };

  for (const action of actions) {
    if (action.action === 'F') {
      ship.x += waypoint.x * action.value;
      ship.y += waypoint.y * action.value;
    } else if (['R', 'L'].includes(action.action)) waypoint = rotateAround(action, waypoint);
    else waypoint = doAction(action, waypoint);
  }

  return Math.abs(ship.x) + Math.abs(ship.y);
}

main();
