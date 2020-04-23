// Generated by CoffeeScript 2.5.1
// # `nikita.lxd.config.device.show`

// Show full device configuration for containers or profiles

// ## Options

// * `container` (string, required)
//   The name of the container.
// * `device` (string, required)
//   Name of the device in LXD configuration, for example "eth0".

// ## Output parameters

// * `err`
//   Error object if any.
// * `result.status` (boolean)
//   True if the device was created or the configuraion updated.
// * `result.config` (object)   
//   Device configuration.

// ## Example

// ```js
// require('nikita')
// .lxd.config.device.show({
//   container: 'container1',
//   device: 'vpn'
// }, function(err, {config}){
//   console.log( err ? err.message : config);
//   # { connect: "udp:127.0.0.1:1194",
//   #   listen: "udp:51.68.116.44:1194",
//   #   type: proxy } }
// })
// ```

// ## Schema
var handler, schema, validate_container_name;

schema = {
  type: 'object',
  properties: {
    'container': {
      type: 'string'
    }
  }
};

// ## Handler
handler = function({options}, callback) {
  this.log({
    message: "Entering lxd config.device.show",
    level: "DEBUG",
    module: "@nikitajs/lxd/lib/config/device/show"
  });
  if (!options.container) {
    // Validation
    throw Error("Invalid Option: container is required");
  }
  validate_container_name(options.container);
  if (!options.device) {
    throw Error("Invalid Option: Device name (options.device) is required");
  }
  return this.system.execute({
    cmd: ['lxc', 'query', '/' + ['1.0', 'instances', options.container].join('/')].join(' ')
  }, function(err, {stdout}) {
    var config;
    if (err) {
      return callback(err);
    }
    config = JSON.parse(stdout);
    return callback(null, {
      status: true,
      config: config.devices[options.device]
    });
  });
};

// ## Exports
module.exports = {
  handler: handler,
  schema: schema,
  shy: true
};

// ## Dependencies
validate_container_name = require('../../misc/validate_container_name');