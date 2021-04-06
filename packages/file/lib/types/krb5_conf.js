// Generated by CoffeeScript 2.5.1
// # `nikita.file.types.krb5_conf`

// Modify the client Kerberos configuration file located by default in
// "/etc/krb5.conf". Kerberos is a network authentication protocol. It is designed
// to provide strong authentication for client/server applications by using
// secret-key cryptography.

// ## Example registering a new realm

// ```js
// const {$status} = await nikita.file.types.krb_conf({
//   merge: true,
//   content: {
//     realms: {
//       'MY.DOMAIN': {
//         kdc: 'ipa.domain.com:88',
//         admin_server: 'ipa.domain.com:749',
//         default_domain: 'domain.com'
//       }
//     }
//   }
// })
// console.info(`Configuration was updated: ${$status}`)
// ```

// ## Schema
var handler, schema, utils;

schema = {
  config: {
    type: 'object',
    properties: {
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
        default: '/etc/krb5.conf',
        description: `Destination file.`
      }
    },
    required: ['content']
  }
};

// ## Handler
handler = async function({config}) {
  return (await this.file.ini({
    parse: utils.ini.parse_brackets_then_curly,
    stringify: utils.ini.stringify_brackets_then_curly
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
