// Generated by CoffeeScript 2.5.1
// # `nikita.docker.inspect`

// Send signal to containers using SIGKILL or a specified signal.
// Note if container is not running , SIGKILL is not executed and
// return status is UNMODIFIED. If container does not exist nor is running
// SIGNAL is not sent.

// ## Callback parameters

// * `err`   
//   Error object if any.
// * `status`   
//   True if container was killed.

// ## Example

// Inspect a single container.

// ```js
// const {info} = await nikita.docker.inspect({
//   name: 'my_container'
// })
// console.info(`Container id is ${info.Id}`)
// ```

// Inspect multiple containers.

// ```js
// const {info} = await nikita.docker.inspect({
//   name: 'my_container'
// })
// info.map( (container) =>
//   console.info(`Container id is ${container.Id}`)
// )
// ```

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'container': {
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
      description: `Name/ID of the container (array of containers not yet implemented).`
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
  },
  required: ['container']
};

// ## Handler
handler = async function({args, config}) {
  var arg, exists, i, info, isCointainerArray, len;
  for (i = 0, len = args.length; i < len; i++) {
    arg = args[i];
    isCointainerArray = Array.isArray(arg != null ? arg.container : void 0);
  }
  ({
    data: info
  } = (await this.docker.tools.execute({
    command: ['inspect', ...(isCointainerArray ? config.container : [config.container])].join(' '),
    format: 'json'
  })));
  return {
    info: isCointainerArray ? info : info[0]
  };
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'docker',
    schema: schema
  }
};
