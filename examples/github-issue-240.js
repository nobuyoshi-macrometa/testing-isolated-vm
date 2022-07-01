/*
 * source: https://github.com/laverdet/isolated-vm/issues/240
 */

const ivm = require("isolated-vm");

let setup = async () => {
  const isolate = new ivm.Isolate();
  const context = await isolate.createContext();

  const fn = "async function execute(o) { return o }";
  const compiledFn = await isolate.compileScript(fn);
  await compiledFn.run(context);

  const fnReference = await context.global.get("execute", { reference: true });

  const result = await fnReference.apply(undefined, [{ a: 20 }], {
    arguments: { copy: true },
    result: { copy: true, promise: true },
  });

  return result;
};

setup()
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.log(err);
  });
