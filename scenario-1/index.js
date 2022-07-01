/*
 * `v8` is used to take the heap snapshot with `v8.getHeapSnapshot()`
 * `fs` and `path` is used to store the snapshot in a file.
 */
const v8 = require("node:v8");
const fs = require("fs");
const path = require("path");

/*
 * We will instantiate n = 100 isolates.
 */
const ivm = require("isolated-vm");

const n = 100; // 1000, 10000
let isolates = [];

for (let i = 0; i < n; i++) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
  isolates.push(isolate);
}

/*
 * Here we take the heap snapshot and
 * then we stored it in a file.
 */
const filename = "scenario-1.heapsnapshot";
const stream = v8.getHeapSnapshot();
const file = path.join(__dirname, filename);
stream.pipe(fs.createWriteStream(file));
