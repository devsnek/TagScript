const chevrotain = require('chevrotain');
const chalk = require('chalk');

Object.defineProperty(Array.prototype, 'last', { // eslint-disable-line
  get () {
    return this[this.length - 1];
  }
})

const Lexer = chevrotain.Lexer;

module.exports = (input, allTokens, highlight) => {
  return new Promise((resolve, reject) => {
    const SelectLexer = new Lexer(Object.values(allTokens), true);

    const tokenize = text => {
      var lexResult = SelectLexer.tokenize(text);

      if (lexResult.errors.length >= 1) {
        reject(lexResult.errors[0].message + ' ' + lexResult.errors[0].stack);
      }
      return lexResult;
    }

    let lexed = tokenize(input);
    let tokens = lexed.tokens;

    let highlighted = '';
    let scope = [];
    let run = [];
    let lastEX = 0;

    const prepare = (scoped, ex, called = false) => {
      delete scoped.next;
      let out = scoped;
      run.push({ex: ex, run: out, called: called, compiled: null});
    }

    const prepareBare = image => {
      run.push({ex: lastEX++, run: {'function': null, args: []}, compiled: image});
      scope.splice(scope.length - 1, 1);
    };

    const scopeTemplate = next => {
      return {'function': null, next: next, args: []}
    }

    const hilite = (text, color) => {
      if (highlight) highlighted += chalk[color](text);
    }

    tokens.forEach(token => {
      switch (token.constructor.name) {
        case 'FunctionOpen':
          if (!scope.last) scope.push(scopeTemplate);
          hilite(token.image, 'blue');
          switch (scope.last.next) {
            case 'args':
              scope.last.args.push(`EX_${lastEX}`);
              scope.push(scopeTemplate('function'));
              break;
            default:
              scope.push(scopeTemplate('function'));
              break;
          }
          break;
        case 'FunctionClose':
          hilite(token.image, 'blue');
          prepare(scope.last, lastEX++, (scope.length > 2));
          scope.splice(scope.length - 1, 1);
          break;
        case 'ArgumentSeperator':
          hilite(token.image, 'yellow');
          break;
        case 'Identifier':
          if (!scope.last) {
            hilite(token.image, 'white');
            return prepareBare(token.image);
          }
          switch (scope.last.next) {
            case 'function':
              hilite(token.image, 'red');
              scope.last.function = token.image;
              scope.last.next = 'args';
              break;
            case 'args':
              hilite(token.image, 'green');
              scope.last.args.push(token.image);
              break;
            default:
              hilite(token.image, 'white');
              prepareBare(token.image);
              break;
          }
          break;
        default:
          break;
      }
    });
    if (highlight) resolve(highlighted);
    else resolve(run);
  });
}
