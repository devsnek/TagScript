const TagScript = require('./index');
const superagent = require('superagent');

let compiler = new TagScript();

const functions = {
  // a simple replacement
  'fight': '(ง\'̀-\'́)ง',

  // a simple function
  'join': (joiner, ...args) => args.join(joiner),

  // an asyncronous example
  'http': (method, url, json, body = {}) => {
    return new Promise((resolve, reject) => {
      if (!(method in superagent)) reject('invalid method');
      superagent[method](url)
      .send(JSON.parse(`{${body}}`))
      .end((err, res) => {
        if (err) reject(err);
        if (json && json !== 'null') {
          let props = json.split('.');
          let value = res.body;
          for (const prop of props) value = value[prop];
          resolve(JSON.stringify(value));
        }
        resolve(res.text);
      })
    });
  }
}

let code = `{set;x;{math;1+1}}
{note: this will not show up}
yay x is {get;x}
{choose;this;that;the other thing}
{join;{fight};hello;how are you;are you good?}
Search for One Punch Man: {http;post;https://qeeqle.guscaplan.me;0.title;"query": "one punch man"}`;

compiler.highlight(code).then(console.log);
compiler.compile(code, functions).then(console.log);

// OR
// if you want more control, you can lex, then pass the lexed stuff manually, possibly
// modifying some things
//
// compiler.lex(code).then(lexed => {
//   compiler.compile(lexed.run, functions).then(console.log);
// })
