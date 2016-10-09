const chalk = require('chalk');
const colors = require('./config.json').colors;

module.exports = tokens => {
  let highlighted = '';
  let scope = [];

  const hilite = (text, color) => {
    highlighted += chalk[color](text);
  }

  const prepare = (scoped, ex, called = false) => {
    delete scoped.next;
  }

  const prepareBare = image => {
    scope.splice(scope.length - 1, 1);
  };

  const scopeTemplate = next => {
    return {'function': null, next: next, args: []}
  }

  return new Promise((resolve, reject) => {
    tokens.forEach(token => {
      switch (token.constructor.name) {
        case 'FunctionOpen':
          if (!scope.last) scope.push(scopeTemplate);
          hilite(token.image, colors.FunctionBrace);
          switch (scope.last.next) {
            case 'args':
              scope.push(scopeTemplate('function'));
              break;
            default:
              scope.push(scopeTemplate('function'));
              break;
          }
          break;
        case 'FunctionClose':
          hilite(token.image, colors.FunctionBrace);
          prepare(scope.last, 0, (scope.length > 2));
          scope.splice(scope.length - 1, 1);
          break;
        case 'ArgumentSeperator':
          hilite(token.image, colors.ArgumentSeperator);
          break;
        case 'Identifier':
          if (!scope.last) {
            hilite(token.image, colors.BareIdentifier);
            return prepareBare(token.image);
          }
          switch (scope.last.next) {
            case 'function':
              hilite(token.image, colors.FunctionName);
              scope.last.function = token.image;
              scope.last.next = 'args';
              break;
            case 'args':
              hilite(token.image, colors.Identifier);
              scope.last.args.push(token.image);
              break;
            default:
              hilite(token.image, colors.BareIdentifier);
              prepareBare(token.image);
              break;
          }
          break;
        default:
          break;
      }
    });
    resolve(highlighted);
  });
}
