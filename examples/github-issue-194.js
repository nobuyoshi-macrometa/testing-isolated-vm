/*
 * source: https://github.com/laverdet/isolated-vm/issues/194
 */

const ivm = require("isolated-vm");

let isolate = new ivm.Isolate();
let context = isolate.createContextSync();

let jail = context.global;
jail.setSync("global", jail.derefInto());

jail.setSync("log", function (...args) {
  console.log(...args);
});

async function findRows() {
  // In actual app all these rows are fetched async
  let rows = [
    { label: "A", value: "a" },
    { label: "B", value: "b" },
  ];

  // Must use `ExternalCopy` manually because of
  // `applySyncPromise` limitation.
  // This is the same as { return: {copy: true} }
  return new ivm.ExternalCopy(rows).copyInto();
}

context.evalClosureSync(
  `global.findRows = function(callback) {
    const rows = $0.applySyncPromise();
    for (const row of rows) {
      callback(row);
    }
  }`,
  [findRows],
  { arguments: { reference: true } }
);

context.eval(`
  findRows(function(row) {
    log(row)
  })
`);

async function processRow(row) {
  return `process: ${JSON.stringify(row)}`;
}

context.evalClosureSync(
  `global.processRow = function(row) {
    return $0.applySyncPromise(undefined, [row], { arguments: {copy: true } });
  }`,
  [processRow],
  { arguments: { reference: true } }
);

context.eval(`
  findRows(function(row) {
    // This break as processRow cannot be run from the main thread.
    // How do I get this to be executed in the isolate thread?
    log(processRow(row))
  })
`);
