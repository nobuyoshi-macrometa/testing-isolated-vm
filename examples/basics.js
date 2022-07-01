/*
 * `v8` is used to take the heap snapshot with `v8.getHeapSnapshot()`
 * `fs` and `path` is used to store the snapshot in a file.
 */
const v8 = require("node:v8");
const fs = require("fs");
const path = require("path");

const ivm = require("isolated-vm");

/*
 * The following string function (`code`) will be
 * compiled in each Isolate, and then
 * ran in each Isolate's context.
 */
const code = `(function() { return 1; })()`;

/*
 * We will create an array of functions with n-elements
 * where Isolates are instantiated.
 */
let promises = Array(100)
  .fill()
  .map(async () => {
    const isolate = new ivm.Isolate({ memoryLimit: 128 /* MB */ });
    const context = await isolate.createContext();
    const script = await isolate.compileScript(code);
    return await script.run(context);
  });

/*
 * Here we execute all the functions
 */
Promise.all(promises).then((results) => {
  const sum = results.reduce((a, b) => a + b, 0);
  console.log(sum);
});

/*
 * We take the heap snapshot here.
 */
const filename = "scenario-2-alt-1.heapsnapshot";
const stream = v8.getHeapSnapshot();
const file = path.join(__dirname, filename);
stream.pipe(fs.createWriteStream(file));

// Additional notes related to Chrome DevTools.
// - shallow size: the size of the object itself
// - retained size: the size of the object itself,
// plus the size of other objects that are kept
// alive by this object.
