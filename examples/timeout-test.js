const ivm = require("isolated-vm");

const code = `(function() { while(true) {}; })()`;

const isolate = new ivm.Isolate({ memoryLimit: 8 /* MB */ });
const script = isolate.compileScriptSync(code);
const context = isolate.createContextSync();

// Prints "Hello, Isolate!"
script.runSync(context, { timeout: 100 });
