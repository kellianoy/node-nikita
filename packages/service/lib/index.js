// Generated by CoffeeScript 2.5.1
  // # `nikita.service`

// Install, start/stop/restart and startup a service.

// The config "state" takes 3 possible values: "started", "stopped" and
  // "restarted". A service will only be restarted if it leads to a change of status.
  // Set the value to "['started', 'restarted']" to ensure the service will be always
  // started.

// ## Output

// * `$status`   
  //   Indicate a change in service such as a change in installation, update,
  //   start/stop or startup registration.
  // * `installed`   
  //   List of installed services.
  // * `updates`   
  //   List of services to update.

// ## Example

// ```js
  // const {$status} = await nikita.service([{
  //   name: 'ganglia-gmetad-3.5.0-99',
  //   srv_name: 'gmetad',
  //   state: 'stopped',
  //   startup: false
  // },{
  //   name: 'ganglia-web-3.5.7-99'
  // }])
  // console.info(`Service status: ${$status}`)
  // ```

// ## Hooks
var handler, merge, on_action, schema,
  indexOf = [].indexOf;

on_action = function({config, metadata}) {
  if (typeof config.state === 'string') {
    return config.state = config.state.split(',');
  }
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'cache': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/cacheonly'
    },
    'cacheonly': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/cacheonly'
    },
    'chk_name': {
      type: 'string',
      description: `Name used by the chkconfig utility, default to "srv_name" and "name".`
    },
    'installed': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/installed'
    },
    'name': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/name'
    },
    'outdated': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/outdated'
    },
    'pacman_flags': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/pacman_flags'
    },
    'srv_name': {
      type: 'string',
      description: `Name used by the service utility, default to "name".`
    },
    'startup': {
      type: ['boolean', 'string'],
      description: `Run service daemon on startup. If true, startup will be set to '2345',
use an empty string to not define any run level.`
    },
    'state': {
      type: 'array',
      items: {
        type: 'string',
        enum: ['started', 'stopped', 'restarted']
      },
      description: `Ensure the service in the requested state.`
    },
    'yaourt_flags': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/yaourt_flags'
    },
    'yum_name': {
      type: 'string',
      description: `Name used by the yum utility, default to "name".`
    }
  },
  dependencies: {
    'state': {
      anyOf: [
        {
          required: ['name']
        },
        {
          required: ['srv_name']
        },
        {
          required: ['chk_name']
        }
      ]
    },
    'startup': {
      anyOf: [
        {
          required: ['name']
        },
        {
          required: ['srv_name']
        },
        {
          required: ['chk_name']
        }
      ]
    }
  }
};


// ## Handler
handler = async function({config, parent, state}) {
  var $status, chkname, pkgname, srvname;
  pkgname = config.yum_name || config.name;
  chkname = config.chk_name || config.srv_name || config.name;
  srvname = config.srv_name || config.chk_name || config.name;
  if (pkgname) { // option name and yum_name are optional, skill installation if not present
    await this.service.install({
      name: pkgname,
      cache: config.cache,
      cacheonly: config.cacheonly,
      installed: config.installed,
      outdated: config.outdated,
      pacman_flags: config.pacman_flags,
      yaourt_flags: config.yaourt_flags
    });
    parent.state = merge(parent.state, state);
  }
  if (config.startup != null) {
    await this.service.startup({
      name: chkname,
      startup: config.startup
    });
  }
  if (config.state) {
    ({$status} = (await this.service.status({
      $shy: true,
      name: srvname
    })));
    if (!$status && indexOf.call(config.state, 'started') >= 0) {
      await this.service.start({
        name: srvname
      });
    }
    if ($status && indexOf.call(config.state, 'stopped') >= 0) {
      await this.service.stop({
        name: srvname
      });
    }
    if ($status && indexOf.call(config.state, 'restarted') >= 0) {
      return (await this.service.restart({
        name: srvname
      }));
    }
  }
};

// ## Export
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    argument_to_config: 'name',
    schema: schema
  }
};

// ## Dependencies
({merge} = require('mixme'));
