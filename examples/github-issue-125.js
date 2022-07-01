/*
 * sources:
 * - https://github.com/laverdet/isolated-vm/issues/125
 */

const ivm = require("isolated-vm");

const isolate = new ivm.Isolate();
const context = isolate.createContextSync();

async function runCode() {
  const fn = await context.eval(
    "(function untrusted() { return Promise.resolve(123); })",
    { reference: true }
  );
  return fn.apply(undefined, [], { result: { promise: true } });
}

runCode()
  .then((value) => console.log(value))
  .catch((error) => console.error(error));
