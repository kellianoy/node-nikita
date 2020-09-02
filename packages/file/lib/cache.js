// Generated by CoffeeScript 2.5.1
  // # `nikita.file.cache`

// Download a file and place it on a local or remote folder for later usage.

// ## Callback Parameters

// * `err`   
  //   Error object if any.   
  // * `status`   
  //   Value is "true" if cache file was created or modified.   

// ## HTTP example

// Cache can be used from the `file.download` action:

// ```js
  // require('nikita')
  // .file.download({
  //   source: 'https://github.com/wdavidw/node-nikita/tarball/v0.0.1',
  //   cache_dir: '/var/tmp'
  // }, function(err, {status}){
  //   console.info(err ? err.message : 'File downloaded: ' + status);
  // });
  // ```

// ## On config
var curl, error, errors, handler, on_action, path, protocols_ftp, protocols_http, schema, url,
  indexOf = [].indexOf;

on_action = function({config, metadata}) {
  if (metadata.argument != null) {
    // Options
    config.source = metadata.argument;
  }
  if (!(config.cache_file || config.target || config.cache_dir)) {
    throw Error("Missing one of 'target', 'cache_file' or 'cache_dir' option");
  }
  if (config.target == null) {
    config.target = config.cache_file;
  }
  if (config.target == null) {
    config.target = path.basename(config.source);
  }
  config.target = path.resolve(config.cache_dir, config.target);
  if (/^file:\/\//.test(config.source)) {
    config.source = config.source.substr(7);
  }
  if (config.http_headers == null) {
    config.http_headers = [];
  }
  return config.cookies != null ? config.cookies : config.cookies = [];
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'cache_dir': {
      type: 'string',
      description: `Path of the cache directory.`
    },
    'cache_file': {
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'boolean'
        }
      ],
      description: `Alias for 'target'.`
    },
    'cache_local': {
      type: 'boolean',
      description: `Apply to SSH mode, treat the cache file and directories as local from where
the command is used instead of over SSH.`
    },
    'cookies': {
      type: 'array',
      items: {
        type: 'string'
      },
      description: `Extra cookies  to include in the request when sending HTTP to a server.`
    },
    'fail': {
      type: 'boolean',
      description: `Send an error if the HTTP response code is invalid. Similar to the curl
option of the same name.`
    },
    'force': {
      type: 'boolean',
      description: `Overwrite the target file if it exists, bypass md5 verification.`
    },
    'http_headers': {
      type: 'array',
      items: {
        type: 'string'
      },
      description: `Extra header to include in the request when sending HTTP to a server.`
    },
    'location': {
      type: 'boolean',
      description: `If the server reports that the requested page has moved to a different
location (indicated with a Location: header and a 3XX response code), this
option will make curl redo the request on the new place.`
    },
    'md5': {
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'boolean'
        }
      ],
      default: false,
      description: `Validate file with md5 checksum (only for binary upload for now),
may be the string checksum or will be deduced from source if "true".`
    },
    'proxy': {
      type: 'string',
      description: `Use the specified HTTP proxy. If the port number is not specified, it is
assumed at port 1080. See curl(1) man page.`
    },
    'sha1': {
      default: false,
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'boolean'
        }
      ],
      description: `Validate file with sha1 checksum (only for binary upload for now),
may be the string checksum or will be deduced from source if "true".`
    },
    'sha256': {
      default: false,
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'boolean'
        }
      ],
      description: `Validate file with sha256 checksum (only for binary upload for now),
may be the string checksum or will be deduced from source if "true".`
    },
    'source': {
      type: 'string',
      description: `File, HTTP URL, FTP, GIT repository. File is the default protocol if source
is provided without any.`
    },
    'target': {
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'boolean'
        }
      ],
      description: `Cache the file on the executing machine, equivalent to cache unless an ssh
connection is provided. If a string is provided, it will be the cache path.
Default to the basename of source.`
    }
  },
  required: ['source']
};

// ## Handler
handler = async function({config, log}) {
  var _hash, algo, cookie, hash, header, ref, status, u;
  log({
    message: "Entering file.cache",
    level: 'DEBUG',
    module: 'nikita/lib/file/cache'
  });
  // todo, also support config.algo and config.hash
  if (config.md5 != null) {
    algo = 'md5';
    _hash = config.md5;
  } else if (config.sha1 != null) {
    algo = 'sha1';
    _hash = config.sha1;
  } else if (config.sha256 != null) {
    algo = 'sha256';
    _hash = config.sha256;
  } else {
    algo = 'md5';
    _hash = false;
  }
  u = url.parse(config.source);
  if (u.protocol !== null) {
    log({
      message: "Bypass source hash computation for non-file protocols",
      level: 'WARN',
      module: 'nikita/lib/file/cache'
    });
  } else {
    if (_hash === true) {
      _hash = (await this.fs.hash(config.source));
      _hash = (_hash != null ? _hash.hash : void 0) ? _hash.hash : false;
      log({
        message: `Computed hash value is '${_hash}'`,
        level: 'INFO',
        module: 'nikita/lib/file/cache'
      });
    }
  }
  // Download the file if
  // - file doesnt exist
  // - option force is provided
  // - hash isnt true and doesnt match
  ({status} = (await this.call(async function() {
    var exists, hash;
    log({
      message: `Check if target (${config.target}) exists`,
      level: 'DEBUG',
      module: 'nikita/lib/file/cache'
    });
    exists = (await this.fs.base.exists({
      target: config.target
    }));
    if (exists) {
      log({
        message: "Target file exists",
        level: 'INFO',
        module: 'nikita/lib/file/cache'
      });
      // If no checksum , we ignore MD5 check
      if (config.force) {
        log({
          message: "Force mode, cache will be overwritten",
          level: 'DEBUG',
          module: 'nikita/lib/file/cache'
        });
        return true;
      } else if (_hash && typeof _hash === 'string') {
        // then we compute the checksum of the file
        log({
          message: `Comparing ${algo} hash`,
          level: 'DEBUG',
          module: 'nikita/lib/file/cache'
        });
        ({hash} = (await this.fs.hash(config.target)));
        // And compare with the checksum provided by the user
        if (_hash === hash) {
          log({
            message: "Hashes match, skipping",
            level: 'DEBUG',
            module: 'nikita/lib/file/cache'
          });
          return false;
        }
        log({
          message: "Hashes don't match, delete then re-download",
          level: 'WARN',
          module: 'nikita/lib/file/cache'
        });
        this.fs.base.unlink({
          target: config.target
        });
        return true;
      } else {
        log({
          message: "Target file exists, check disabled, skipping",
          level: 'DEBUG',
          module: 'nikita/lib/file/cache'
        });
        return false;
      }
    } else {
      log({
        message: "Target file does not exists",
        level: 'INFO',
        module: 'nikita/lib/file/cache'
      });
      return true;
    }
  })));
  if (!status) {
    return status;
  }
  // Place into cache
  if (ref = u.protocol, indexOf.call(protocols_http, ref) >= 0) {
    this.fs.mkdir({
      ssh: config.cache_local ? false : config.ssh,
      target: path.dirname(config.target)
    });
    await this.execute({
      cmd: [
        'curl',
        config.fail ? '--fail' : void 0,
        u.protocol === 'https:' ? '--insecure' : void 0,
        config.location ? '--location' : void 0,
        ...((function() {
          var i,
        len,
        ref1,
        results;
          ref1 = config.http_headers;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            header = ref1[i];
            results.push(`--header '${header.replace('\'',
        '\\\'')}'`);
          }
          return results;
        })()),
        ...((function() {
          var i,
        len,
        ref1,
        results;
          ref1 = config.cookies;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            cookie = ref1[i];
            results.push(`--cookie '${cookie.replace('\'',
        '\\\'')}'`);
          }
          return results;
        })()),
        `-s ${config.source}`,
        `-o ${config.target}`,
        config.proxy ? `-x ${config.proxy}` : void 0
      ].join(' '),
      ssh: config.cache_local ? false : config.ssh,
      unless_exists: config.target
    });
  } else {
    this.fs.mkdir({ // todo: copy shall handle this
      target: `${path.dirname(config.target)}`
    });
    this.fs.copy({
      source: `${config.source}`,
      target: `${config.target}`
    });
  }
  // Validate the cache
  ({hash} = (await this.fs.hash({
    target: config.target,
    if: _hash
  })));
  if (hash == null) {
    hash = false;
  }
  if (_hash !== hash) {
    throw errors.NIKITA_FILE_INVALID_TARGET_HASH({
      config: config,
      hash: hash,
      _hash: _hash
    });
  }
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  schema: schema
};

module.exports.protocols_http = protocols_http = ['http:', 'https:'];

module.exports.protocols_ftp = protocols_ftp = ['ftp:', 'ftps:'];

// ## Errors
errors = {
  NIKITA_FILE_INVALID_TARGET_HASH: function({config, hash, _hash}) {
    return error('NIKITA_FILE_INVALID_TARGET_HASH', [`target ${JSON.stringify(config.target)} got ${hash} instead of ${_hash}`]);
  }
};

// ## Dependencies
path = require('path');

url = require('url');

curl = require('./utils/curl');

error = require('@nikitajs/engine/src/utils/error');