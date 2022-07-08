/*
 * This section is related to max memory consumption measurement.
 * You set this callbacks before running your script.
 */
let maxMemoryConsumption = 0;
let timestamp;

/*
 * From Node.js:
 * "When we pass a function to `process.nextTick()`,
 * we instruct the engine to invoke this function at the end of
 * the current operation, before the next event loop tick starts"
 */
process.nextTick(() => {
  const memoryUsage = process.memoryUsage();

  /*
   * From Node.js (https://nodejs.org/api/process.html#processmemoryusage)
   * `rss`: Resident Set Size, is the amount of space occupied
   * in the main memory device (that is a subset of the total allocated memory)
   * for the process, including all C++ and JavaScript objects and code.
   */
  if (memoryUsage.rss > maxMemoryConsumption) {
    maxMemoryConsumption = memoryUsage.rss;
    timestamp = new Date();
  }
});

process.on("exit", () => {
  console.log(
    `Max memory consumption: ${maxMemoryConsumption} ` +
      `(${(maxMemoryConsumption / 1024 / 1024).toFixed(4)} MB) ` +
      `at ${timestamp}`
  );
});

// Run your script here
