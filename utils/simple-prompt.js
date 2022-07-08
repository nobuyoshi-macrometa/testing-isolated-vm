/*
 * This function `askToProceed` holds the script execution
 * until the user inputs <Enter> key. With this behavior,
 * user could run this script with `--inspect` flag like:
 * `node --inspect scenario-2`
 * and then open `chrome://inspect` in the browser to
 * start recording CPU or memory usage.
 */
function askToProceed(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

(async function () {
  await askToProceed("Press <Enter> to continue");

  // Run your script here
})();
