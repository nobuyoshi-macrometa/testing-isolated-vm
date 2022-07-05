const fs = require("fs");
const path = require("path");

const ivm = require("isolated-vm");

function runIsolates() {
  let promises = Array(100)
    .fill()
    .map(async () => {
      const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
      const context = await isolate.createContext();

      const jail = context.global;
      jail.setSync("global", jail.derefInto());

      // log
      jail.setSync("log", function (...args) {
        console.log(...args);
      });

      // fetch
      async function myFetch(...args) {
        const res = await fetch(...args);
        const data = await res.json();

        return new ivm.ExternalCopy(data).copyInto();
      }

      context.evalClosureSync(
        `global.myFetch = function(fetchProps) {
        const data = $0.applySyncPromise(
          undefined,
          [fetchProps],
          { arguments: { copy: true } }
        );

        return data
      }`,
        [myFetch],
        { arguments: { reference: true } }
      );

      const code = fs.readFileSync(
        path.resolve(__dirname, "fn-fetch-air-quality.js"),
        "utf8"
      );

      const script = await isolate.compileScript(code);
      return script.run(context);
    });

  Promise.all(promises).then((_results) => {
    console.log("Script Ended");
  });
}

module.exports = runIsolates;
