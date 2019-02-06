// Generated by CoffeeScript 2.3.2
// # `nikita.file.properties`

// Write a file in the Java properties format.

// ## Options

// * `comment` (boolean)   
//   Preserve comments, key is the comment while value is "null".
// * `target` (string)   
//   File to read and parse.
// * `trim` (boolean)   
//   Trim keys and value.
// * `separator` (string)   
//   The caracter to use for separating property and value. '=' by default.

// ## Exemple

// Use a custom delimiter with spaces around the equal sign.

// ```javascript
// require('nikita')
// .file.properties.read({
//   target: "/path/to/target.json",
//   separator: ' = '
// }, function(err, properties){
//   console.info(err || properties);
// })
// ```

// ## Source Code
var quote, string;

module.exports = {
  status: false,
  handler: function({options}, callback) {
    this.log({
      message: "Entering file.properties",
      level: 'DEBUG',
      module: 'nikita/lib/file/properties/read'
    });
    // Options
    if (options.separator == null) {
      options.separator = '=';
    }
    if (options.comment == null) {
      options.comment = false;
    }
    if (options.encoding == null) {
      options.encoding = 'utf8';
    }
    if (!options.target) {
      throw Error("Missing argument options.target");
    }
    return this.fs.readFile({
      ssh: options.ssh,
      target: options.target,
      encoding: options.encoding
    }, function(err, {data}) {
      var _, i, k, len, line, lines, properties, v;
      if (err) {
        return callback(err);
      }
      properties = {};
      // Parse
      lines = string.lines(data);
      for (i = 0, len = lines.length; i < len; i++) {
        line = lines[i];
        if (/^\s*$/.test(line)) { // Empty line
          continue;
        }
        if (/^#/.test(line)) { // Comment
          if (options.comment) {
            properties[line] = null;
          }
          continue;
        }
        [_, k, v] = RegExp(`^(.*?)${quote(options.separator)}(.*)$`).exec(line);
        if (options.trim) {
          k = k.trim();
        }
        if (options.trim) {
          v = v.trim();
        }
        properties[k] = v;
      }
      return callback(null, {
        properties: properties
      });
    });
  }
};

// ## Dependencies
quote = require('regexp-quote');

string = require('../../misc/string');