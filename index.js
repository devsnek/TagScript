const chevrotain = require('chevrotain');
const Compile = require('./Compiler');
const Lexer = require('./Lexer');

const extendToken = (name, find, color) => {
  let token = chevrotain.extendToken(name, find);
  token.STRING = token.PATTERN.toString().slice(1, -1);
  token.COLOR = color;
  return token;
};

class Compiler {
  constructor () {
    this.tokens = {
      FunctionOpen: extendToken('FunctionOpen', /{/, 'blue'),
      FunctionClose: extendToken('FunctionClose', /}/, 'blue'),
      ArgumentSeperator: extendToken('ArgumentSeperator', /;/, 'yellow'),
      Identifier: extendToken('Identifier', /([\u0020-\u003A]|[\u003C-\u007A]|[\u007E-\uFFFFF]|\u007C|[\r\n\v])+/i, 'green')
    };
  }

  lex (input) {
    return Lexer(input, this.tokens, false);
  }

  highlight (input) {
    return Lexer(input, this.tokens, true);
  }

  compile (input, functions = {}) {
    return new Promise((resolve, reject) => {
      this.lex(input).then(lexed => {
        Compile(lexed, functions).then(resolve).catch(reject);
      }).catch(reject);
    });
  }
}

module.exports = Compiler;
