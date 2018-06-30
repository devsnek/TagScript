'use strict';

const lex = require('./lexer');
const interpret = require('./interpreter');

module.exports = async (source, options) => {
  const ast = lex(source, options);
  const out = await interpret(ast, options);
  return out;
};

module.exports.lex = lex;
module.exports.interpret = interpret;
