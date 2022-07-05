const fs = require("fs");
const path = require("path");

const ivm = require("isolated-vm");

const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
const context = isolate.createContextSync();

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

context.eval(code);
