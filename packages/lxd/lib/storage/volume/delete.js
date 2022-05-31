// Generated by CoffeeScript 2.7.0
// # `nikita.lxc.storage.volume.delete`

// Delete a storage volume in the selected pool.

// ## Output parameters

// * `$status`
//   True if the volume was deleted.

// ## Example

// ```js
// const {$status} = await @lxc.storage.volume.delete({
//   pool = 'default',
//   name = 'test',
// })
// console.info(`The volume was deleted: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'pool': {
        type: 'string',
        description: 'Name of the storage pool containing the volume to delete.'
      },
      'name': {
        type: 'string',
        description: 'Name of the storage volume to delete.'
      },
      'type': {
        enum: ["custom"],
        default: "custom",
        description: `Type of the storage volume to delete.`
      }
    },
    required: ['pool', 'name', 'type']
  }
};

// ## Handler
handler = async function({config}) {
  var $status;
  ({$status} = (await this.lxc.query({
    path: `/1.0/storage-pools/${config.pool}/volumes/${config.type}/${config.name}`,
    request: "DELETE",
    format: 'string',
    code: [0, 42]
  })));
  return {
    $status: $status
  };
};


// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions,
    shy: true
  }
};