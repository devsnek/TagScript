'use strict';

const {
  TYPE_RAW,
  TYPE_CALL,
} = require('./constants');

const node = (parent, type) => ({
  parent,
  type,
  children: [],
  text: '',
});

const lex = (source) => {
  let current = node(undefined, source[0] === '{' ? TYPE_CALL : TYPE_RAW);

  const down = (type) => {
    const n = node(current, type);
    current.children.push(n);
    current = n;
  };

  const up = () => {
    current = current.parent;
  };

  const over = (type) => {
    const n = node(current.parent, type);
    current.parent.children.push(n);
    current = n;
  };

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];

    if (current.type === undefined) {
      current.type = source[i - 1] === '{' ? TYPE_CALL : TYPE_RAW;
    }

    if (char === '{') {
      down(TYPE_CALL);
    } else if (char === '}') {
      up();
      if (source[i + 1]) {
        over();
      }
    } else if (char === ';') {
      if (current.type === TYPE_RAW &&
          !current.parent &&
          current.parent.type !== TYPE_CALL) {
        current.text += ';';
      } else if (current.type === TYPE_CALL) {
        down();
      } else {
        over();
      }
    } else {
      current.text += char;
    }
  }

  while (current.parent !== undefined) {
    up();
  }

  return current;
};

module.exports = lex;
