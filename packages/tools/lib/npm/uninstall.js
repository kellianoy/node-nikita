// Generated by CoffeeScript 2.5.1
  // # `nikita.tools.npm.uninstall`

// Remove one or more NodeJS packages.

// ## Options

// * `name` (string|array, required)
  //   Name of the package(s).
  // * `global` (boolean)
  //   Uninstalls the current package context as a global package.

// ## Callback Parameters

// * `err`
  //   Error object if any.
  // * `status`
  //   Value "true" if the package was uninstalled.

// ## Example

// The following action uninstalls the coffescript package globally.

// ```javascript
  // require('nikita')
  // .tools.npm({
  //   name: 'coffeescript',
  //   global: true
  // }, (err, {status}) => {
  //   console.log(err ? err.message : 'Package uninstalled ' + status);
  // });
  // ```

// ## Schema
var handler, schema, string,
  indexOf = [].indexOf;

schema = {
  type: 'object',
  properties: {
    'name': {
      oneOf: [
        {
          type: 'string'
        },
        {
          type: 'array',
          items: {
            type: 'string'
          }
        }
      ],
      description: 'Name of the package(s).'
    },
    'global': {
      type: 'boolean',
      default: false,
      description: 'Uninstalls the current package context as a global package.'
    }
  },
  required: ['name']
};

// ## Handler
handler = function({options}, callback) {
  var global, installed;
  if (options.argument != null) {
    options.name = options.argument;
  }
  if (typeof options.name === 'string') {
    options.name = [options.name];
  }
  global = options.global ? ' -g' : '';
  installed = [];
  this.system.execute({
    cmd: `npm list --installed --json ${global}`,
    code: [0, 1],
    stdout_log: false,
    shy: true
  }, function(err, {stdout}) {
    var pkgs;
    if (err) {
      throw err;
    }
    pkgs = JSON.parse(stdout);
    pkgs = Object.keys(pkgs.dependencies);
    return installed = pkgs;
  });
  return this.call(function() {
    var uninstall;
    uninstall = options.name.filter(function(pkg) {
      return indexOf.call(installed, pkg) >= 0;
    });
    return this.system.execute({
      if: uninstall.length,
      cmd: `npm uninstall ${global} ${uninstall.join(' ')}`,
      sudo: options.sudo
    }, (err) => {
      return this.log({
        message: `NPM uninstalled packages: ${install.join(', ')}`
      });
    });
  });
};

// ## Export
module.exports = {
  handler: handler,
  schema: schema
};

// ## Dependencies
string = require('@nikitajs/core/lib/misc/string');