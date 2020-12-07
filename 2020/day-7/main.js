const fs = require('fs');
const path = require('path');

function main() {
  const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

  const rules = input.split('\n').map((rule) => {
    const ruleParts = rule.substring(0, rule.length - 1).split(' contain ');

    return {
      bagColor: ruleParts[0].split('bag')[0].trim(),
      contain: ruleParts[1]
        .split(', ')
        .map((bag) => {
          const match = bag.match(/^(?<count>\d+)\s(?<bagColor>(\w+\s?)+)\sbags?$/);

          if (!match) return null;

          return match.groups;
        })
        .filter(Boolean),
    };
  });

  console.log('Part one solution: ', one(rules)); // 287

  console.log('Part two solution: ', two(rules)); // 48160
}

function one(rules) {
  rules = rules.filter(({ contain }) => contain.length);

  const bagColor = 'shiny gold';

  let prev = [];
  let curr = rules
    .filter((rule) => rule.contain.map((b) => b.bagColor).includes(bagColor))
    .map((rule) => rule.bagColor)
    .filter((v, i, s) => s.indexOf(v) === i);

  while (prev.length !== curr.length) {
    prev = curr;
    curr = [
      ...prev,
      ...rules
        .filter((rule) => rule.contain.some((c) => prev.includes(c.bagColor)))
        .map((rule) => rule.bagColor),
    ].filter((v, i, s) => s.indexOf(v) === i);
  }

  return curr.length;
}

function two(rules) {
  return sumForColor(rules, 'shiny gold');
}

function sumForColor(rules, color) {
  const { contain } = rules.find((rule) => rule.bagColor === color);

  if (contain.length === 0) return 0;

  return contain
    .map(({ count, bagColor }) => count * (sumForColor(rules, bagColor) + 1))
    .reduce((acc, curr) => acc + curr, 0);
}

main();
