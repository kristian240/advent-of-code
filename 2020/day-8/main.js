const fs = require('fs');
const path = require('path');

function main() {
  const input = fs.readFileSync(path.resolve(__dirname, 'input.txt'), 'utf-8');

  const commands = input.split('\n').map((commandString) => {
    const commandParts = commandString.split(' ');

    return {
      name: commandParts[0],
      value: parseInt(commandParts[1]),
    };
  });

  console.log('Part one solution: ', one([...commands]));

  console.log('Part two solution: ', two([...commands]));
}

const originalCommands = (commands) => [...commands.map(({ name, value }) => ({ name, value }))];

function runCommand(command) {
  if (command.name === 'jmp') return [0, command.value];

  if (command.name === 'nop') return [0, 1];

  if (command.name === 'acc') return [command.value, 1];

  return [];
}

function runProgram(commands) {
  let [acc, pc] = [0, 0];

  while (pc < commands.length && !commands[pc].executed) {
    const [accDiff, pcDiff] = runCommand(commands[pc]);

    commands[pc].executed = true;

    acc += accDiff;
    pc += pcDiff;
  }

  return [acc, pc];
}

function one(commands) {
  return runProgram(commands)[0];
}

function two(cmds) {
  const fix = { jmp: 'nop', nop: 'jmp' };

  for (let i = 0, l = cmds.length; i < l; i++) {
    const commands = originalCommands(cmds);

    if (commands[i].name === 'acc') continue;

    commands[i].name = fix[commands[i].name];

    const [acc, pc] = runProgram(commands);

    if (pc >= commands.length) return acc;
  }

  return null;
}

main();
