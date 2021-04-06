// Generated by CoffeeScript 2.5.1
// # `nikita.file.types.systemd.timesyncd`

// ## Example

// Overwrite `/usr/lib/systemd/timesyncd.conf.d/10_timesyncd.conf` in `/mnt` to
// set a list of NTP servers by using an array and a single fallback server by
// using a string.

// ```js
// const {$status} = await nikita.file.types.systemd.timesyncd({
//   target: "/usr/lib/systemd/timesyncd.conf.d/10_timesyncd.conf",
//   rootdir: "/mnt",
//   content:
//     NTP: ["ntp.domain.com", "ntp.domain2.com", "ntp.domain3.com"]
//     FallbackNTP: "fallback.domain.com"
// })
// console.info(`File was overwritten: ${$status}`)
// ```

// Write to the default target file (`/etc/systemd/timesyncd.conf`). Set a single
// NTP server using a string and also modify the value of RootDistanceMaxSec.
// Note: with `merge` set to true, this wont overwrite the target file, only
// specified values will be updated.

// ```js
// const {$status} = await nikita.file.types.systemd.timesyncd({
//   content:
//     NTP: "0.arch.pool.ntp.org"
//     RootDistanceMaxSec: 5
//   merge: true
// })
// console.info(`File was written: ${$status}`)
// ```

// ## Schema
var handler, path, schema;

schema = {
  config: {
    type: 'object',
    properties: {
      'content': {
        type: 'object',
        description: `The configuration object`
      },
      'merge': {
        type: 'boolean',
        description: `Merge the original content with the provided content.`
      },
      'reload': {
        type: 'boolean',
        description: `Defaults to true. If set to true the following command will be
executed \`systemctl daemon-reload && systemctl restart
systemd-timesyncd\` after having wrote the configuration file.`
      },
      'rootdir': {
        type: 'string',
        description: `Path to the mount point corresponding to the root directory, optional.`
      },
      'target': {
        type: 'string',
        default: '/etc/systemd/timesyncd.conf',
        description: `File to write.`
      }
    }
  }
};

// This action uses `file.ini` internally, therefore it honors all
// arguments it provides. `backup` is true by default and `separator` is
// overridden by "=".

// ## Handler

// The timesyncd configuration file requires all its fields to be under a single
// section called "Time". Thus, everything in `content` will be automatically put
// under a "Time" key so that the user doesn't have to do it manually.
handler = async function({config}) {
  var $status;
  if (config.rootdir) {
    // Configs
    config.target = `${path.join(config.rootdir, config.target)}`;
  }
  if (Array.isArray(config.content.NTP)) {
    config.content.NTP = config.content.NTP.join(" ");
  }
  if (Array.isArray(config.content.FallbackNTP)) {
    config.content.FallbackNTP = config.content.FallbackNTP.join(" ");
  }
  // Write configuration
  ({$status} = (await this.file.ini({
    separator: "=",
    target: config.target,
    content: {
      'Time': config.content
    },
    merge: config.merge
  })));
  return (await this.execute({
    $if: function() {
      if (config.reload != null) {
        return config.reload;
      } else {
        return $status;
      }
    },
    sudo: true,
    command: `systemctl daemon-reload
systemctl restart systemd-timesyncd`,
    trap: true
  }));
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
