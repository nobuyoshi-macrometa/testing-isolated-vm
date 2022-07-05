const readline = require("readline");
const runIsolates = require("./main");

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
  runIsolates();
})();
