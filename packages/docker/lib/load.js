// Generated by CoffeeScript 2.5.1
// # `nikita.docker.load`

// Load Docker images.

// ## Output

// * `err`   
//   Error object if any.
// * `$status`   
//   True if container was loaded.
// * `stdout`   
//   Stdout value(s) unless `stdout` option is provided.
// * `stderr`   
//   Stderr value(s) unless `stderr` option is provided.

// ## Example

// ```js
// const {$status} = await nikita.docker.load({
//   image: 'nikita/load_test:latest',
//   machine: machine,
//   source: source + "/nikita_load.tar"
// })
// console.info(`Image was loaded: ${$status}`);
// ```

// ## Schema
var handler, schema, utils;

schema = {
  type: 'object',
  properties: {
    'checksum': {
      type: 'string',
      description: `If provided, will check if attached input archive to checksum already
exist, not native to docker but implemented to get better performance.`
    },
    'docker': {
      $ref: 'module://@nikitajs/docker/lib/tools/execute#/properties/docker'
    },
    'input': {
      type: 'string',
      description: `TAR archive file to read from.`
    },
    'source': {
      type: 'string',
      description: `Alias for the "input" option.`
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var command, i, image, images, infos, j, k, len, len1, new_image, new_images, new_k, ref, ref1, status, stderr, stdout;
  // Validate parameters
  if (config.input == null) {
    config.input = config.source;
  }
  if (config.input == null) {
    throw Error('Missing input parameter');
  }
  command = `load -i ${config.input}`;
  // need to records the list of image to see if status is modified or not after load
  // for this we print the existing images as REPOSITORY:TAG:IMAGE
  // parse the result to record images as an array of   {'REPOSITORY:TAG:'= 'IMAGE'}
  images = {};
  delete config.command;
  log({
    message: 'Storing previous state of image',
    level: 'INFO'
  });
  if (config.checksum == null) {
    log({
      message: 'No checksum provided',
      level: 'INFO'
    });
  }
  if (config.checksum) {
    log({
      message: `Checksum provided :${config.checksum}`,
      level: 'INFO'
    });
  }
  if (config.checksum == null) {
    config.checksum = '';
  }
  ({stdout} = (await this.docker.tools.execute({
    command: "images | grep -v '<none>' | awk '{ print $1\":\"$2\":\"$3 }'"
  })));
  // skip header line, wi skip it here instead of in the grep  to have
  // an array with at least one not empty line
  if (utils.string.lines(stdout).length > 1) {
    ref = utils.string.lines(stdout);
    for (i = 0, len = ref.length; i < len; i++) {
      image = ref[i];
      image = image.trim();
      if (image !== '') {
        infos = image.split(':');
        if (infos[2] === config.checksum) {
          // if image is here we skip
          log({
            message: `Image already exist checksum :${config.checksum}, repo:tag \"${infos[0]}:${infos[1]}\"`,
            level: 'INFO'
          });
        }
        if (infos[2] === config.checksum) {
          return false;
        }
        images[`${infos[0]}:${infos[1]}`] = `${infos[2]}`;
      }
    }
  }
  log({
    message: `Start Loading ${config.input} `,
    level: 'INFO'
  });
  await this.docker.tools.execute({
    command: command
  });
  ({stdout, stderr} = (await this.docker.tools.execute({
    command: 'images | grep -v \'<none>\' | awk \'{ print $1":"$2":"$3 }\''
  })));
  new_images = {};
  status = false;
  log({
    message: 'Comparing new images',
    level: 'INFO'
  });
  if (utils.string.lines(stdout).length > 1) {
    ref1 = utils.string.lines(stdout.toString());
    for (j = 0, len1 = ref1.length; j < len1; j++) {
      image = ref1[j];
      if (image !== '') {
        infos = image.split(':');
        new_images[`${infos[0]}:${infos[1]}`] = `${infos[2]}`;
      }
    }
  }
  for (new_k in new_images) {
    new_image = new_images[new_k];
    if (images[new_k] == null) {
      status = true;
      break;
    } else {
      for (k in images) {
        image = images[k];
        if (image !== new_image && new_k === k) {
          status = true;
          log({
            message: 'Identical images',
            level: 'INFO'
          });
          break;
        }
      }
    }
  }
  return {
    $status: status,
    stdout: stdout,
    stderr: stderr
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

// ## Dependencies
utils = require('./utils');
