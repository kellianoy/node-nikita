// Generated by CoffeeScript 2.5.1
  // # `nikita.file.types.locale_gen`

// Update the locale definition file located in "/etc/locale.gen".

// ## Example

// ```js
  // const {$status} = await nikita.file.types.locale_gen({
  //   target: '/etc/locale.gen',
  //   rootdir: '/mnt',
  //   locales: ['fr_FR.UTF-8', 'en_US.UTF-8']
  // })
  // console.info(`File was updated: ${$status}`)
  // ```

// ## Schema
var handler, path, schema,
  indexOf = [].indexOf;

schema = {
  config: {
    type: 'object',
    properties: {
      'rootdir': {
        type: 'string',
        description: `Path to the mount point corresponding to the root directory, optional.`
      },
      'generate': {
        type: 'boolean',
        default: null,
        description: `Run \`locale-gen\` by default if target was modified or force running
the command if value is a boolean.`
      },
      'locales': {
        type: 'array',
        items: {
          type: 'string'
        },
        description: `List of supported locales, required.`
      },
      'target': {
        type: 'string',
        default: '/etc/locale.gen',
        description: `File to write, default to "/etc/locale.gen".`
      }
    },
    required: ['locales']
  }
};

// ## Handler
handler = async function({config}) {
  var data, i, j, len, locale, locales, match, ref, ref1, status;
  if (config.rootdir) {
    config.target = `${path.join(config.rootdir, config.target)}`;
  }
  // Write configuration
  ({data} = (await this.fs.base.readFile({
    target: config.target,
    encoding: 'ascii'
  })));
  status = false;
  locales = data.split('\n');
  for (i = j = 0, len = locales.length; j < len; i = ++j) {
    locale = locales[i];
    if (match = /^#([\w_\-\.]+)($| .+$)/.exec(locale)) {
      if (ref = match[1], indexOf.call(config.locales, ref) >= 0) {
        locales[i] = match[1] + match[2];
        status = true;
      }
    }
    if (match = /^([\w_\-\.]+)($| .+$)/.exec(locale)) {
      if (ref1 = match[1], indexOf.call(config.locales, ref1) < 0) {
        locales[i] = '#' + match[1] + match[2];
        status = true;
      }
    }
  }
  if (status) {
    data = locales.join('\n');
    await this.fs.base.writeFile({
      target: config.target,
      content: data
    });
  }
  // Reload configuration
  await this.execute({
    $if: config.generate != null ? config.generate : status,
    rootdir: config.rootdir,
    command: "locale-gen"
  });
  return {
    $status: status || config.generate
  };
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    schema: schema
  }
};

// ## Dependencies
path = require('path');
