const chevrotain = require('chevrotain');

const Highlight = require('../src/Highlighter');
const Lexer = require('../src/Lexer');

const extendToken = (name, find) => {
  let token = chevrotain.extendToken(name, find);
  token.STRING = token.PATTERN.toString().slice(1, -1);
  return token;
};

const tokens = {
  FunctionOpen: extendToken('FunctionOpen', /{/),
  FunctionClose: extendToken('FunctionClose', /}/),
  ArgumentSeperator: extendToken('ArgumentSeperator', /;/),
  Identifier: extendToken('Identifier', /([\u0020-\u003A]|[\u003C-\u007A]|[\u007E-\uFFFFF]|\u007C|[\r\n\v])+/i)
};

const highlight = input => {
  return new Promise((resolve, reject) => {
    Lexer(input, tokens).then(lexed => {
      resolve(Highlight(lexed.raw, true));
    }).catch(reject);
  });
}

window.highlight = highlight;
window.highlightColors = require('../src/config.json').colors;
