const Parser = require('expr-eval').Parser;

module.exports = {
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
