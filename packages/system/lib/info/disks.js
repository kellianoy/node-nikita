// Generated by CoffeeScript 2.5.1
// # `nikita.system.info.disks`

// Expose disk information. Internally, it parse the result of the "df" command. 
// The properties "total", "used" and "available" are expressed in bytes.

// ## Implementation

// The action rely on the `df` command and the presence of the `--output` option.

// Tests are filtered with the `system_info_disks` tag.

// ## Callback

// The following properties are available:

// - `filesystem` (string)   
//   The source of the mount point, usually a device; alias of the "source"
//   property of the `df` command.
// - `total` (integer)   
//   Total space available in bytes; derivated from the "itotal" output property of
//   the `df` command.
// - `used` (integer)   
//   Total space used in bytes; derivated from the "iused" output property of
//   the `df` command.
// - `available` (integer)   
//   Total space available in bytes; derivated from the "iavail" output property of
//   the `df` command.
// - `available_pourcent` (string)   
//   Total space available in pourcentage; alias of the "ipcent" output
//   property of the `df` command.
// - `mountpoint` (string)
//   The mount point location; alias of the "target" output property of the `df`
//   command.

// Additionnaly, the `df` property export the low level information obtained from
// the `df` command:

// - `disks[].df.source` (string)   
//   The source of the mount point, usually a device; correspond to the
//   "Filesystem" header of the `df` command.
// - `disks[].df.fstype` (string)   
//   File system type; correspond to the "Type" header of the `df` command.
// - `disks[].df.itotal` (integer)   
//   Total number of inodes, in bytes; correspond to the "Inodes" header of the
//   `df` command.
// - `disks[].df.iused` (integer)   
//   Number of used inodes, in bytes; correspond to the "IUsed" header of the `df`
//   command.
// - `disks[].df.iavail` (integer)   
//   Number of available inodes, in bytes; correspond to the "IFree" header of the
//   `df` command.
// - `disks[].df.ipcent` (string)   
//   Percentage of iused divided by itotal; correspond to the "IUse%" header of the
//   `df` command.
// - `disks[].df.size` (integer)   
//   The total space available, measured in 1kB units; correspond to the
//   "1K-blocks" header of the `df` command.
// - `disks[].df.used` (integer)   
//   Number of used blocks; correspond to the "Used" header of the `df` command.
// - `disks[].df.avail` (integer)   
//   Number of available blocks; correspond to the
//   "Avail" header of the `df` command.
// - `disks[].df.pcent` (float)   
//   Percentage of used divided by size; correspond to the
//   "Use%" header of the `df` command.
// - `disks[].df.target` (string)   
//   The mount point; correspond to the
//   "Mounted on" header of the `df` command.

// Note that if you add The Used and Available columns you don't get the total size
// shown; this is because of blocks that are reserved for root as shown in the
// output of `dumpe2fs` as "Reserved block count:". Those blocks can only be used by
// root, the idea behind this is that if a user fills up the filesystem, critical
// stuff still works and root can fix the problem.

// ## Example

// ```js
// const {disks} = await nikita.system.info.disks()
// disks.forEach((disk) => {
//   console.info('File system:', disk.filesystem)
//   console.info('Total space:', disk.total)
//   console.info('Used space:', disk.used)
//   console.info('Available space:', disk.available)
//   console.info('Available space (pourcent):', disk.available_pourcent)
//   console.info('Mountpoint:', disk.mountpoint)
// })
// ```

// Here is how the output may look like:

// ```json
// [ { filesystem: '/dev/sda1',
//     total: '8255928',
//     used: '1683700',
//     available: '6152852',
//     available_pourcent: '22%',
//     mountpoint: '/' },
//   { filesystem: 'tmpfs',
//     total: '961240',
//     used: '0',
//     available: '961240',
//     available_pourcent: '0%',
//     mountpoint: '/dev/shm' } ]
// ```

// ## Schema definitions
var definitions, handler, utils;

definitions = {
  config: {
    type: 'object',
    properties: {
      'output': {
        type: 'array',
        default: ['source', 'fstype', 'itotal', 'iused', 'iavail', 'ipcent', 'size', 'used', 'avail', 'pcent', 'target'],
        items: {
          type: 'string',
          enum: ['source', 'fstype', 'itotal', 'iused', 'iavail', 'ipcent', 'size', 'used', 'avail', 'pcent', 'target'] //todo use and test $ref /properties/output/default
        },
        description: `The list of properties to be returned, default to all of them.`
      }
    }
  }
};

// ## Handler
handler = async function({config}, callback) {
  var disk, disks, i, line, property, stdout;
  ({stdout} = (await this.execute({
    command: `df --output='${config.output.join(',')}'`
  })));
  disks = (function() {
    var j, k, len, len1, ref, ref1, results;
    ref = utils.string.lines(stdout);
    results = [];
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      line = ref[i];
      if (i === 0) {
        continue;
      }
      if (/^\s*$/.test(line)) {
        continue;
      }
      line = line.split(/\s+/);
      disk = {
        df: {}
      };
      ref1 = config.output;
      for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
        property = ref1[i];
        disk.df[property] = line[i];
      }
      disk.filesystem = disk.df.source;
      disk.total = disk.df.itotal * 1024;
      disk.used = disk.df.iused * 1024;
      disk.available = disk.df.avail * 1024;
      disk.available_pourcent = disk.df.pcent;
      disk.mountpoint = disk.df.target;
      results.push(disk);
    }
    return results;
  })();
  return {
    disks: disks
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

// ## Dependencies
utils = require('../utils');
