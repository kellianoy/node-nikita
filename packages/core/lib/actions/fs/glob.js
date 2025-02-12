// Generated by CoffeeScript 2.7.0
// # `nikita.fs.glob`

// Search for files in a directory hierarchy.

// ## Implementation

// The action use the POXIX `find` command to fetch all files and filter the
// paths locally using the Minimatch package.

// ## Output

// * `files`   
//   List of files matching the globing expression.

// ## Examples

// Short notation:

// ```js
// const {files} = await nikita.fs.glob(`${process.cwd()}/*`)
// for(const file of files){
//   console.info(`Found: ${file}`)
// }
// ```

// Extended notation:

// ```js
// const {files} = await nikita.fs.glob({
//   dot: true,
//   target: `${process.cwd()}/*`
// })
// for(const file of files){
//   console.info(`Found: ${file}`)
// }
// ```

// ## Schema definitions
var Minimatch, definitions, getprefix, handler, utils;

definitions = {
  config: {
    type: 'object',
    properties: {
      'dot': {
        type: 'boolean',
        description: `Minimatch option to handle files starting with a ".".`
      },
      'target': {
        type: 'string',
        description: `Globbing expression of the directory tree to match.`
      },
      'trailing': {
        type: 'boolean',
        default: false,
        description: `Leave a slash at the end of directories.`
      },
      'minimatch': {
        type: 'object',
        description: `Pass any additionnal config to Minimatch.`
      }
    },
    required: ['target']
  }
};

// ## Handler
handler = async function({
    config,
    tools: {path}
  }) {
  var base, exit_code, files, minimatch, s, stdout;
  if (config.minimatch == null) {
    config.minimatch = {};
  }
  if (config.dot != null) {
    if ((base = config.minimatch).dot == null) {
      base.dot = config.dot;
    }
  }
  config.target = path.normalize(config.target);
  minimatch = new Minimatch(config.target, config.minimatch);
  ({stdout, exit_code} = (await this.execute({
    command: [
      'find',
      ...((function() {
        var i,
      len,
      ref,
      results;
        ref = minimatch.set;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          s = ref[i];
          results.push(getprefix(s));
        }
        return results;
      })()),
      // trailing slash
      '-type d -exec sh -c \'printf "%s/\\n" "$0"\' {} \\; -or -print'
    ].join(' '),
    $relax: true,
    trim: true
  })));
  // Find returns exit code 1 when no match is found, treat it as an empty output
  if (stdout == null) {
    stdout = '';
  }
  // Filter each entries
  files = utils.string.lines(stdout).filter(function(file) {
    return minimatch.match(file);
  });
  // Remove the trailing slash introduced by the find command
  if (!config.trailing) {
    files = files.map(function(file) {
      if (file.slice(-1) === '/') {
        return file.slice(0, -1);
      } else {
        return file;
      }
    });
  }
  return {
    files: files
  };
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    argument_to_config: 'target',
    definitions: definitions,
    shy: true
  }
};

// ## Dependencies
({Minimatch} = require('minimatch'));

utils = require('../../utils');

// ## Utility
getprefix = function(pattern) {
  var n, prefix;
  prefix = null;
  n = 0;
  while (typeof pattern[n] === "string") {
    n++;
  }
  // now n is the index of the first one that is *not* a string.
  // see if there's anything else
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      prefix = pattern.join('/');
      return prefix;
    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      return null;
    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's "absolute" like /foo/bar,
      // or "relative" like "../baz"
      prefix = pattern.slice(0, n);
      prefix = prefix.join('/');
      return prefix;
  }
};
