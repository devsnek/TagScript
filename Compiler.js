const ohsync = require('asyncawait/async');
const ohwait = require('asyncawait/await');
const Parser = require('expr-eval').Parser;

module.exports = (run, functions = {}) => {
  let runtimeArgs = {};
  const builtin = {
    'get': i => runtimeArgs[i],
    'set': (i, x) => {
      runtimeArgs[i] = x;
      return;
    },
    'math': (...args) => Parser.evaluate(args.join('')),
    'choose': (...args) => args[Math.floor(Math.random() * args.length)],
    'range': (min, max) => Math.floor(Math.random() * parseInt(max)) + parseInt(min),
    'lower': t => t.toLowerCase(),
    'upper': t => t.toUpperCase(),
    'length': t => t.length,
    'note': '',
    'l': '{',
    'r': '}',
    'semi': ';'
  }
  Object.keys(builtin).forEach(k => {
    if (k in functions) throw new Error(`"${k}" is a reserved function name`)
  })
  functions = Object.assign(builtin, functions);

  return ohsync(() => {
    run.forEach(i => {
      if (i.run.function === null) return;
      i.run.args = i.run.args.map(arg => {
        if (run.find(r => ('EX_' + r.ex) === arg)) {
          let replacement = run.find(r => 'EX_' + r.ex === arg).compiled;
          return replacement;
        } else {
          return arg;
        }
      });
      if (!(i.run.function in functions)) {
        i.compiled = '';
        return;
      }
      let compiled = functions[i.run.function];
      if (typeof compiled === 'string') {
        i.compiled = compiled;
      } else {
        compiled = compiled(...i.run.args);
        if (compiled instanceof Promise) {
          i.compiled = ohwait(compiled);
        } else {
          i.compiled = compiled;
        }
      }
    });
    let compiled = run.filter(e => !e.called).map(e => e.compiled).join('').trim();
    return compiled;
  })();
}
