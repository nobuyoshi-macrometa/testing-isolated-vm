/*
 * This script is still in progress.
 * You will get errors if you try to run it.
 */
const v8 = require("node:v8");
const fs = require("fs");
const path = require("path");

const ivm = require("isolated-vm");

const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
const context = isolate.createContextSync();

const jail = context.global;
jail.setSync("global", jail.derefInto());

const code = fs.readFileSync(path.resolve(__dirname, "fn-dummy.js"), "utf8");

const script = isolate.compileScriptSync(code);
script.runSync(context);

const fnRef = jail.getSync("dummy", { reference: true });

const result = fnRef
  .applySync(undefined, [], { result: { promise: true } })
  .then((result) => console.log(result));

/*
 * Here we take the heap snapshot and
 * then we stored it in a file.
 */
// const filename = "scenario-1.heapsnapshot";
// const stream = v8.getHeapSnapshot();
// const file = path.join(__dirname, filename);
// stream.pipe(fs.createWriteStream(file));
