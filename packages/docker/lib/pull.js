// Generated by CoffeeScript 2.5.1
// # `nikita.docker.pull`

// Pull a container.

// ## Callback parameters

// * `err`   
//   Error object if any.
// * `status`   
//   True if container was pulled.
// * `stdout`   
//   Stdout value(s) unless `stdout` option is provided.
// * `stderr`   
//   Stderr value(s) unless `stderr` option is provided.

// ## Example

// ```js
// const {status} = await nikita.docker.pull({
//   tag: 'postgresql'
// })
// console.info(`Image was pulled: ${status}`)
// ```

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'tag': {
      type: 'string',
      description: `Name of the tag to pull.`
    },
    'version': {
      type: 'string',
      description: `Version of the tag to control. Default to \`latest\`.`
    },
    'all': {
      type: 'boolean',
      default: false,
      description: `Download all tagged images in the repository.`
    },
    'boot2docker': {
      $ref: 'module://@nikitajs/docker/lib/tools/execute#/properties/boot2docker'
    },
    'compose': {
      $ref: 'module://@nikitajs/docker/lib/tools/execute#/properties/compose'
    },
    'machine': {
      $ref: 'module://@nikitajs/docker/lib/tools/execute#/properties/machine'
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var status, version;
  log({
    message: "Entering Docker pull",
    level: 'DEBUG',
    module: 'nikita/lib/docker/pull'
  });
  // Validate parameters
  version = config.version || config.tag.split(':')[1] || 'latest';
  delete config.version; // present in misc.docker.config, will probably disappear at some point
  if (config.tag == null) {
    throw Error('Missing Tag Name');
  }
  ({status} = (await this.docker.tools.execute({
    command: ['images', `| grep '${config.tag}'`, !config.all ? `| grep '${version}'` : void 0].join(' '),
    code_skipped: 1
  })));
  return (await this.docker.tools.execute({
    unless: status,
    command: ['pull', config.all ? `-a ${config.tag}` : `${config.tag}:${version}`].join(' ')
  }));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'docker',
    schema: schema
  }
};
