// const readline = require("readline");
const runIsolates = require("./main");

// /*
//  * This section is related to max memory consumption measurement.
//  */
// let maxMemoryConsumption = 0;
// let timestamp;

// /*
//  * From Node.js:
//  * "When we pass a function to `process.nextTick()`,
//  * we instruct the engine to invoke this function at the end of
//  * the current operation, before the next event loop tick starts"
//  */
// process.nextTick(() => {
//   const memoryUsage = process.memoryUsage();

//   /*
//    * From Node.js (https://nodejs.org/api/process.html#processmemoryusage)
//    * `rss`: Resident Set Size, is the amount of space occupied
//    * in the main memory device (that is a subset of the total allocated memory)
//    * for the process, including all C++ and JavaScript objects and code.
//    */
//   if (memoryUsage.rss > maxMemoryConsumption) {
//     maxMemoryConsumption = memoryUsage.rss;
//     timestamp = new Date();
//   }
// });

// process.on("exit", () => {
//   console.log(
//     `Max memory consumption: ${maxMemoryConsumption} ` +
//       `(${(maxMemoryConsumption / 1024 / 1024).toFixed(4)} MB) ` +
//       `at ${timestamp}`
//   );
// });

// /*
//  * This function `askToProceed` holds the script execution
//  * until the user inputs <Enter> key. With this behavior,
//  * user could run this script with `--inspect` flag like:
//  * `node --inspect scenario-2`
//  * and then open `chrome://inspect` in the browser to
//  * start recording CPU or memory usage before `runIsolates()`
//  */
// function askToProceed(query) {
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });

//   return new Promise((resolve) =>
//     rl.question(query, (ans) => {
//       rl.close();
//       resolve(ans);
//     })
//   );
// }

(async function () {
  // this line is commented out. We don't need it for `pm2`
  // await askToProceed("Press <Enter> to continue");

  runIsolates(); // Here we run our test scenario
})();
