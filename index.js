const chevrotain = require('chevrotain');
const Compile = require('./Compiler');
const Lexer = require('./Lexer');
const Highlight = require('./Highlighter');

const extendToken = (name, find) => {
  let token = chevrotain.extendToken(name, find);
  token.STRING = token.PATTERN.toString().slice(1, -1);
  return token;
};

class Compiler {
  constructor () {
    this.tokens = {
      FunctionOpen: extendToken('FunctionOpen', /{/),
      FunctionClose: extendToken('FunctionClose', /}/),
      ArgumentSeperator: extendToken('ArgumentSeperator', /;/),
      Identifier: extendToken('Identifier', /([\u0020-\u003A]|[\u003C-\u007A]|[\u007E-\uFFFFF]|\u007C|[\r\n\v])+/i)
    };
  }

  /**
   * Runs the lexer on the input and returns json output for the compiler
   * @param {string} input The string of TagScript to be lexed.
   * @returns {Object} output Object containing information for the compiler
   */
  lex (input) {
    return Lexer(input, this.tokens);
  }

  /**
   * Runs a highlighter on the input and returns an ANSI formatted string.
   * @param {string} input The string of TagScript to be highlighted.
   * @returns {string} output An ANSI formatted string.
   */
  highlight (input) {
    return new Promise((resolve, reject) => {
      this.lex(input).then(lexed => {
        Highlight(lexed.raw).then(resolve).catch(reject)
      }).catch(reject);
    });
  }

  /**
   * Compiles a TagScript string or output from the Lexer.
   * @param {string|object} input Input in the form of a string or an object from the lexer.
   * @param {object} functions Functions to pass as executable items.
   * @returns {string} output The compiled TagScript in the form of a string.
   */
  compile (input, functions = {}) {
    if (typeof input === 'string') {
      return new Promise((resolve, reject) => {
        this.lex(input).then(lexed => {
          Compile(lexed.run, functions).then(resolve).catch(reject);
        }).catch(reject);
      });
    } else {
      return Compile(input, functions);
    }
  }
}

module.exports = Compiler;
