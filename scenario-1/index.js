const runIsolates = require("./main");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

(async function () {
  await sleep(3000);

  runIsolates(); // Here we run our test scenario
})();
