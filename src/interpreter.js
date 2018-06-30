'use strict';

const vm = require('vm');
const {
  TYPE_RAW,
  TYPE_CALL,
} = require('./constants');

const functions = {
  get: (state, [name]) => state.variables[name] || '',
  set: (state, [name, value]) => {
    state.variables[name] = value;
    return '';
  },

  object: (state, [obj, selector]) => {
    if (typeof obj === 'string') {
      obj = JSON.parse(obj);
    }
    let value = obj;
    for (const prop of selector.split('.')) {
      value = value[prop];
    }
    return value;
  },

  eval: (state, args) =>
    vm.runInNewContext(args.join(''), Object.create(null)),

  choose: (state, args) =>
    args[Math.floor(Math.random() * args.length)],

  range: (state, [min, max]) =>
    Math.floor(Math.random() * Number.parseInt(max, 10)) + Number.parseInt(min, 10),

  randstr: (state, [length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789']) => {
    let result = '';
    for (let i = Number.parseInt(length, 10); i > 0; i -= 1) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  },

  lower: (state, [t]) => t.toLowerCase(),
  upper: (state, [t]) => t.toUpperCase(),
  length: (state, [t]) => t.length,
  note: () => '',
};

const interpret = async (ast, options, state = {}) => {
  let output = '';

  if (state.variables === undefined) {
    state.variables = Object.create(null);
  }

  if (options !== undefined) {
    if (options.functions !== undefined) {
      state.functions = { ...functions, ...options.functions };
    } else {
      state.functions = { ...functions };
    }
  }

  const iterate = async (list) => {
    if (list.length === 0) {
      return [];
    }
    const iterator = list[Symbol.iterator]();
    const values = [];
    try {
      for await (const child of iterator) {
        values.push(await interpret(child, undefined, state));
      }
    } catch (e) {
      return [];
    }
    return values;
  };

  if (ast.type === TYPE_RAW) {
    output += ast.text;
    if (ast.children.length > 0) {
      output += (await iterate(ast.children)).join('');
    }
  } else if (ast.type === TYPE_CALL) {
    const args = ast.children.length > 0 ? await iterate(ast.children) : [];
    output += await functions[ast.text.trim()](state, args);
  }

  return output;
};

module.exports = interpret;
