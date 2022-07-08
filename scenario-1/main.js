const ivm = require("isolated-vm");

/*
 * We will instantiate n = 100 isolates.
 */
function runIsolates() {
  const n = 100;
  let isolates = [];

  for (let i = 0; i < n; i++) {
    const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
    isolates.push(isolate);
  }

  process.exit(1);
}

module.exports = runIsolates;
