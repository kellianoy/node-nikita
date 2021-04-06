// Generated by CoffeeScript 2.5.1
// # `nikita.file.types.my_cnf`

// Write file in the mysql ini format by default located in "/etc/my.cnf".

// ## Schema
var handler, schema, utils;

schema = {
  config: {
    type: 'object',
    properties: {
      // 'rootdir':
      //   type: 'string'
      //   description: '''
      //   Path to the mount point corresponding to the root directory, optional.
      //   '''
      'backup': {
        type: ['string', 'boolean'],
        description: `Create a backup, append a provided string to the filename extension or
a timestamp if value is not a string, only apply if the target file
exists and is modified.`
      },
      'clean': {
        type: 'boolean',
        description: `Remove all the lines whithout a key and a value, default to "true".`
      },
      'content': {
        type: 'object',
        description: `Object to stringify.`
      },
      'merge': {
        type: 'boolean',
        description: `Read the target if it exists and merge its content.`
      },
      'target': {
        type: 'string',
        default: '/etc/my.cnf',
        description: `Destination file.`
      }
    },
    required: ['content']
  }
};

// ## Handler
handler = async function({config}) {
  return (await this.file.ini({
    stringify: utils.ini.stringify_single_key
  }, config));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    schema: schema
  }
};

// ## Dependencies
utils = require('../utils');
