// Generated by CoffeeScript 1.10.0
var fs, misc, yaml;

module.exports = function(options, callback) {
  var content, destination, do_get, do_write, merge, ssh;
  merge = options.merge, destination = options.destination, content = options.content, ssh = options.ssh;
  if (options.clean == null) {
    options.clean = true;
  }
  if (!content) {
    return callback(new Error('Missing content'));
  }
  if (!destination) {
    return callback(new Error('Missing destination'));
  }
  do_get = function() {
    if (!merge) {
      return do_write();
    }
    options.log({
      message: "Get content for merge",
      level: 'DEBUG',
      module: 'mecano/lib/yaml'
    });
    return fs.exists(ssh, destination, function(err, exists) {
      if (err) {
        return callback(err);
      }
      if (!exists) {
        return do_write();
      }
      return fs.readFile(ssh, destination, 'ascii', function(err, c) {
        var error;
        if (err && err.code !== 'ENOENT') {
          return callback(err);
        }
        try {
          return yaml.safeLoadAll(c, function(data) {
            data = misc.yaml.clean(data, content, true);
            options.content = misc.yaml.merge(data, content);
            return do_write();
          });
        } catch (error1) {
          error = error1;
          return callback(error);
        }
      });
    });
  };
  do_write = (function(_this) {
    return function() {
      if (options.indent == null) {
        options.indent = 2;
      }
      if (options.clean) {
        options.log({
          message: "Clean content",
          level: 'INFO',
          module: 'mecano/lib/yaml'
        });
        misc.ini.clean(content);
      }
      options.log({
        message: "Serialize content",
        level: 'DEBUG',
        module: 'mecano/lib/yaml'
      });
      try {
        options.content = yaml.safeDump(options.content);
        return _this.write(options, function(err, written) {
          return callback(err, written);
        });
      } catch (error1) {}
    };
  })(this);
  return do_get();
};

fs = require('ssh2-fs');

misc = require('../misc');

yaml = require('js-yaml');