import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const ask = (q) => new Promise((res) => rl.question(q, res));

export { rl };
