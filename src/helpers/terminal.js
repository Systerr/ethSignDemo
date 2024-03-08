import readline from "node:readline/promises";

/**
 * Simple helper to waiting for user enter press
 * @param {*} [text]
 */
export const waitForEnter = async (text = "Press ENTER key to continue...") => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  await rl.question(text);
  await rl.close();
};
