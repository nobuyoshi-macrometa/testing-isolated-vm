/*
 * sources:
 * - https://github.com/laverdet/isolated-vm/issues/125
 */

const ivm = require("isolated-vm");

const isolate = new ivm.Isolate();
const context = isolate.createContextSync();

async function runCode() {
  isolate
    .compileScriptSync("function untrusted() { return Promise.resolve(123); }")
    .runSync(context);

  let jail = context.global;
  jail.setSync("_ivm", ivm);

  const forward = isolate
    .compileScriptSync(
      `(function(ivm) {
        delete _ivm;
        return new ivm.Reference(function forward(fn, resolve, reject) {
          fn().then(
            value => resolve.applyIgnored(undefined, [ value ]),
            error => reject.applyIgnored(undefined, [ ivm.ExternalCopy(error).copyInto() ])
          );
        });
      })(_ivm);`
    )
    .runSync(context);

  const fn = await jail.get("untrusted", { reference: true });

  const promise = new Promise((resolve, reject) => {
    forward.apply(undefined, [
      fn.derefInto(),
      new ivm.Reference(resolve),
      new ivm.Reference(reject),
    ]);
  });

  return promise;
}

(async () => {
  try {
    console.log(await runCode());
  } catch (e) {
    console.log(e);
  }
})();
