const fs = require("fs");
const path = require("path");
const ivm = require("isolated-vm");

const SIZE = 100;
const PAUSE_MILLIS = 3000;

async function runIsolates() {
  /*
   * Step A - Create 100 isolates
   * `isolates` array will hold 100 Isolates (ref).
   */
  const n = SIZE;
  let isolates = [];

  for (let i = 0; i < n; i++) {
    const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
    isolates.push(isolate);
  }

  // Pause
  await sleep(PAUSE_MILLIS);

  /*
   * Step B - Compile scripts
   * `scripts` array will hold 100 `{ script, context }` objects.
   */
  let scripts = [];

  // code is read only once.
  const code = fs.readFileSync(
    path.resolve(__dirname, "fn-fetch-air-quality.js"),
    "utf8"
  );

  for (let i = 0; i < isolates.length; i++) {
    const isolate = isolates[i];

    const context = await isolate.createContext();

    const jail = context.global;
    jail.setSync("global", jail.derefInto());

    jail.setSync("log", function (...args) {
      console.log(...args);
    });

    context.evalClosureSync(
      `global.myFetch = function(fetchProps) {
        const data = $0.applySyncPromise(
          undefined,
          [fetchProps],
          { arguments: { copy: true } }
        );
        return data
      } `,
      [myFetch],
      {
        timeout: 50,
        arguments: { reference: true },
      }
    );

    const script = await isolate.compileScript(code);

    scripts.push({
      context,
      script,
    });
  }

  // Pause
  await sleep(PAUSE_MILLIS);

  /*
   * Step C - Run scripts
   * Based on `{ script, context }` array we build
   * a new array of Promises, and we run them concurrently.
   */
  Promise.allSettled(
    scripts.map(({ script, context }) => {
      return script.run(context, { timeout: 50 });
    })
  ).then((_results) => {
    // console.log(_results);
    // console.log(_results.map((result) => result.status));
    console.log("Script Ended");
  });
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function myFetch(...args) {
  const res = await fetch(...args);
  const data = await res.json();

  return new ivm.ExternalCopy(data).copyInto();
}

module.exports = runIsolates;
