const TagScript = require('./index');
const superagent = require('superagent');

let compiler = new TagScript();

const functions = {
  'http': (method, url, json, body = {}) => {
    return new Promise((resolve, reject) => {
      if (!(method in superagent)) resolve('');
      superagent[method](url)
      .send(JSON.parse(`{${body}}`))
      .end((err, res) => {
        if (err) resolve('');
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

compiler.compile(`{set;x;{math;1+1}}
{note: this will not show up}
yay x is {get;x}
{choose;this;that;the other thing}
Search for One Punch Man: {http;post;https://qeeqle.guscaplan.me;0.title;"query": "one punch man"}`, functions).then(console.log);
