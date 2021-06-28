// Generated by CoffeeScript 2.5.1
// # `nikita.execute`

// Run a command locally or with ssh if `host` or `ssh` is provided.

// ## Exit codes

// The properties `code` and `code_skipped` are important to determine whether an
// action failed or succeed with or without modifications. An action is expected to
// execute successfully with modifications if the exit code match one of the value
// in `code`, by default `0`. Otherwise, it is considered to have failed and an
// error is thrown. The `code_skipped` property is used to
// define one or more exit codes that are considered successfull but without
// creating any modifications.

// ## Output

// * `$status`   
//   Value is `true` if command exit equals property `code`, `0` by default, `false` if
//   command exit equals property `code_skipped`, `none` by default.
// * `stdout`   
//   Stdout value(s) unless `stdout` property is provided.
// * `stderr`   
//   Stderr value(s) unless `stderr` property is provided.

// ## Temporary directory

// A temporary directory is required under certain conditions. The action leverages
// the `tmpdir` plugins which is only activated when necessary. The conditions
// involves the usage of `sudo`, `chroot`, `arch_chroot` or `env_export`.

// For performance reason, consider declare the `metadata.tmpdir` property in your
// parent action to avoid the creation and removal of a tempory directory everytime
// the `execute` action is called.

// ## Events

// * `stdout`
// * `stdout_stream`
// * `stderr`
// * `stderr_stream`

// ## Create a user over SSH

// This example create a user on a remote server with the `useradd` command. It
// print the error message if the command failed or an information message if it
// succeed.

// An exit code equal to `9` defined by the `code_skipped` property indicates that
// the command is considered successfull but without any impact.

// ```js
// const {$status} = await nikita.execute({
//   ssh: ssh,
//   command: 'useradd myfriend',
//   code_skipped: 9
// })
// console.info(`User was created: ${$status}`)
// ```

// ## Run a command with bash

// ```js
// const {stdout} = await nikita.execute({
//   bash: true,
//   command: 'env'
// })
// console.info(stdout)
// ```

// ## Hooks
var definitions, exec, handler, on_action, utils, yaml;

on_action = {
  after: ['@nikitajs/core/lib/plugins/execute', '@nikitajs/core/lib/plugins/ssh', '@nikitajs/core/lib/plugins/tools/path'],
  before: ['@nikitajs/core/lib/plugins/metadata/schema', '@nikitajs/core/lib/plugins/metadata/tmpdir'],
  handler: function({
      config,
      metadata,
      ssh,
      tools: {find, path, walk}
    }) {
    var env_export;
    if (config.env == null) {
      config.env = !ssh && !config.env ? process.env : {};
    }
    env_export = config.env_export != null ? config.env_export : !!ssh;
    if (config.sudo || config.bash || (env_export && Object.keys(config.env).length)) {
      return metadata.tmpdir != null ? metadata.tmpdir : metadata.tmpdir = true;
    } else if (config.arch_chroot_rootdir) {
      return metadata.tmpdir != null ? metadata.tmpdir : metadata.tmpdir = function({os_tmpdir, tmpdir}) {
        // Note, Arch mount `/tmp` with tmpfs in memory
        // placing a file in the host fs will not expose it inside of chroot
        config.arch_chroot_tmpdir = path.join('/opt', tmpdir);
        return path.join(config.arch_chroot_rootdir, config.arch_chroot_tmpdir);
      };
    }
  }
};

// ## Schema definitions
definitions = {
  config: {
    type: 'object',
    properties: {
      'arch_chroot': {
        type: ['boolean', 'string'],
        description: `Run this command inside a root directory with the arc-chroot command
or any provided string, require the \`arch_chroot_rootdir\` property
if activated.`
      },
      'bash': {
        type: ['boolean', 'string'],
        description: `Serialize the command into a file and execute it with bash.`
      },
      'command': {
        oneOf: [
          {
            type: 'string'
          },
          {
            typeof: 'function'
          }
        ],
        description: `String, Object or array; Command to execute. A value provided as a
function is interpreted as an action and will be called by
forwarding the config object. The result is the expected to be the
command to execute.`
      },
      'cwd': {
        type: 'string',
        description: `Current working directory from where to execute the command.`
      },
      'code': {
        type: 'array',
        items: {
          type: 'integer'
        },
        default: [0],
        description: `Expected code(s) returned by the command, int or array of int,
default to 0.`
      },
      'code_skipped': {
        type: 'array',
        items: {
          type: 'integer'
        },
        default: [],
        description: `Expected code(s) returned by the command if it has no effect, executed
will not be incremented, int or array of int.`
      },
      'dirty': {
        type: 'boolean',
        default: false,
        description: `Leave temporary files on the filesystem.`
      },
      'dry': {
        type: 'boolean',
        description: `Run the action without executing any real command.`
      },
      'env': {
        type: 'object',
        description: `Environment variables as key-value pairs. With local execution, it
default to \`process.env\`. With remote execution over SSH, the
accepted environment variables is determined by the AcceptEnv server
setting and default to \`LANG,LC_*\`. See the \`env_export\` property to
get around this limitation.`,
        patternProperties: {
          '': {
            type: "string"
          }
        }
      },
      'env_export': {
        type: 'boolean',
        description: `Write a temporary file which exports the the environment variables
defined in the \`env\` property. The value is always \`true\` when
environment variables must be used with SSH.`
      },
      'format': {
        type: 'string',
        enum: ['json', 'yaml'],
        description: `Convert the stdout to a Javascript value or object.`
      },
      'gid': {
        type: 'integer',
        description: `Unix group id.`
      },
      'stdin_log': {
        type: 'boolean',
        default: true,
        description: `Log the executed command of type stdin, default is \`true\`.`
      },
      'stdout': {
        instanceof: 'Object', // must be `stream.Writable`
        description: `Writable EventEmitter in which the standard output of executed
commands will be piped.`
      },
      'stdout_return': {
        type: 'boolean',
        default: true,
        description: `Return the stderr content in the output, default is \`true\`.  It is
preferable to set this property to \`false\` and to use the \`stdout\`
property when expecting a large stdout output.`
      },
      'stdout_log': {
        type: 'boolean',
        default: true,
        description: `Pass stdout output to the logs of type "stdout_stream", default is
\`true\`.`
      },
      'stdout_trim': {
        type: 'boolean',
        default: false,
        description: `Trim the stdout output.`
      },
      'stderr': {
        instanceof: 'Object', // must be `stream.Writable`
        description: `Writable EventEmitter in which the standard error output of executed
command will be piped.`
      },
      'stderr_return': {
        type: 'boolean',
        default: true,
        description: `Return the stderr content in the output, default is \`true\`. It is
preferable to set this property to \`false\` and to use the \`stderr\`
property when expecting a large stderr output.`
      },
      'stderr_log': {
        type: 'boolean',
        default: true,
        description: `Pass stdout output to the logs of type "stdout_stream", default is
\`true\`.`
      },
      'stderr_trim': {
        type: 'boolean',
        default: false,
        description: `Trim the stderr output.`
      },
      'sudo': {
        type: 'boolean',
        // default: false
        description: `Run a command as sudo, desactivated if user is "root".`
      },
      'target': {
        type: 'string',
        description: `Temporary path storing the script, only apply with the \`bash\` and
\`arch_chroot\` properties, always disposed once executed. Unless
provided, the default location is \`{metadata.tmpdir}/{string.hash
config.command}\`. See the \`tmpdir\` plugin for additionnal
information.`
      },
      'trap': {
        type: 'boolean',
        default: false,
        description: `Exit immediately if a commands exits with a non-zero status.`
      },
      'trim': {
        type: 'boolean',
        default: false,
        description: `Trim both the stdout and stderr outputs.`
      },
      'uid': {
        type: 'integer',
        description: `Unix user id.`
      }
    },
    dependencies: {
      arch_chroot: {
        properties: {
          'arch_chroot_rootdir': {
            type: 'string',
            description: `Path to the mount point corresponding to the root directory,
required if the "arch_chroot" property is activated.`
          }
        },
        required: ['arch_chroot_rootdir']
      }
    },
    required: ['command']
  }
};


// ## Handler
handler = async function({
    config,
    metadata,
    parent,
    tools: {dig, find, log, path, walk},
    ssh
  }) {
  var command, current_username, dry, env_export, env_export_content, env_export_hash, env_export_target, k, stdout, target, target_in, v;
  // Validate parameters
  if (config.mode == null) {
    config.mode = 0o500;
  }
  if (typeof config.command === 'function') {
    config.command = (await this.call(config, config.command));
  }
  if (config.bash === true) {
    config.bash = 'bash';
  }
  if (config.arch_chroot === true) {
    config.arch_chroot = 'arch-chroot';
  }
  if (config.command && config.trap) {
    config.command = `set -e\n${config.command}`;
  }
  config.command_original = `${config.command}`;
  // sudo = await find ({config: {sudo}}) -> sudo
  dry = (await find(function({
      config: {dry}
    }) {
    return dry;
  }));
  if (['bash', 'arch_chroot'].filter(function(k) {
    return config[k];
  }).length > 1) {
    // TODO move next 2 lines this to schema or on_action ?
    throw Error("Incompatible properties: bash, arch_chroot");
  }
  // Environment variables are merged with parent
  // env = merge {}, ...await walk ({config: {env}}) -> env
  // Serialize env in a sourced file
  env_export = config.env_export != null ? config.env_export : !!ssh;
  if (env_export && Object.keys(config.env).length) {
    env_export_content = ((function() {
      var ref, results;
      ref = config.env;
      results = [];
      for (k in ref) {
        v = ref[k];
        results.push(`export ${k}=${utils.string.escapeshellarg(v)}\n`);
      }
      return results;
    })()).join('\n');
    env_export_hash = utils.string.hash(env_export_content);
  }
  // Guess current username
  current_username = ssh ? ssh.config.username : /^win/.test(process.platform) ? process.env['USERPROFILE'].split(path.win32.sep)[2] : process.env['USER'];
  // Sudo
  if (config.sudo) {
    if (current_username === 'root') {
      config.sudo = false;
    } else {
      if (!['bash', 'arch_chroot'].some(function(k) {
        return config[k];
      })) {
        config.bash = 'bash';
      }
    }
  }
  // User substitution
  // Determines if writing is required and eventually convert uid to username
  if (config.uid && current_username !== 'root' && !/\d/.test(`${config.uid}`)) {
    ({stdout} = (await this.execute({
      [`awk -v val=${config.uid} -F `]: " '$3==val{print $1}' /etc/passwd`"
    }, function(err, {stdout}) {})));
    config.uid = stdout.trim();
    if (!(config.bash || config.arch_chroot)) {
      config.bash = 'bash';
    }
  }
  if (env_export && Object.keys(config.env).length) {
    env_export_hash = utils.string.hash(env_export_content);
    env_export_target = path.join(metadata.tmpdir, env_export_hash);
    config.command = `source ${env_export_target}\n${config.command}`;
    log({
      message: `Writing env export to ${JSON.stringify(env_export_target)}`,
      level: 'INFO'
    });
    await this.fs.base.writeFile({
      $sudo: false,
      $arch_chroot: false,
      $arch_chroot_rootdir: false,
      content: env_export_content,
      mode: 0o500,
      target: env_export_target,
      uid: config.uid
    });
  }
  // Write script
  if (config.bash) {
    command = config.command;
    if (typeof target !== 'string') {
      target = path.join(metadata.tmpdir, utils.string.hash(config.command));
    }
    log({
      message: `Writing bash script to ${JSON.stringify(target)}`,
      level: 'INFO'
    });
    config.command = `${config.bash} ${target}`;
    if (config.uid) {
      config.command = `su - ${config.uid} -c '${config.command}'`;
    }
    if (!config.dirty) {
      config.command += `;code=\`echo $?\`; rm '${target}'; exit $code`;
    }
    await this.fs.base.writeFile({
      $sudo: false,
      $arch_chroot: false,
      $arch_chroot_rootdir: false,
      content: command,
      mode: config.mode,
      target: target,
      uid: config.uid
    });
  }
  if (config.arch_chroot) {
    // Note, with arch_chroot enabled, 
    // arch_chroot_rootdir `/mnt` gave birth to
    // tmpdir `/mnt/tmpdir/nikita-random-path`
    // and target is inside it
    command = config.command;
    if (typeof target !== 'string') {
      target_in = path.join(config.arch_chroot_tmpdir, utils.string.hash(config.command));
    }
    target = path.join(config.arch_chroot_rootdir, target_in);
    // target = "#{metadata.tmpdir}/#{utils.string.hash config.command}" if typeof config.target isnt 'string'
    log({
      message: `Writing arch-chroot script to ${JSON.stringify(target)}`,
      level: 'INFO'
    });
    config.command = `${config.arch_chroot} ${config.arch_chroot_rootdir} bash ${target_in}`;
    // config.command += ";code=`echo $?`; exit $code" unless config.dirty
    await this.fs.base.writeFile({
      $sudo: false,
      $arch_chroot: false,
      $arch_chroot_rootdir: false,
      target: `${target}`,
      content: `${command}`,
      mode: config.mode
    });
  }
  if (config.sudo) {
    config.command = `sudo ${config.command}`;
  }
  // Execute
  return new Promise(function(resolve, reject) {
    var child, result, stderr_stream_open, stdout_stream_open;
    if (config.stdin_log) {
      log({
        message: config.command_original,
        type: 'stdin',
        level: 'INFO'
      });
    }
    result = {
      $status: false,
      stdout: [],
      stderr: [],
      code: null,
      command: config.command_original
    };
    if (config.dry) {
      return resolve(result);
    }
    child = exec(config, {
      ssh: ssh,
      env: config.env
    });
    if (config.stdin) {
      config.stdin.pipe(child.stdin);
    }
    if (config.stdout) {
      child.stdout.pipe(config.stdout, {
        end: false
      });
    }
    if (config.stderr) {
      child.stderr.pipe(config.stderr, {
        end: false
      });
    }
    stdout_stream_open = stderr_stream_open = false;
    if (config.stdout_return || config.stdout_log) {
      child.stdout.on('data', function(data) {
        if (config.stdout_log) {
          stdout_stream_open = true;
        }
        if (config.stdout_log) {
          log({
            message: data,
            type: 'stdout_stream'
          });
        }
        if (config.stdout_return) {
          if (Array.isArray(result.stdout)) { // A string once `exit` is called
            return result.stdout.push(data);
          } else {
            return console.warn(['NIKITA_EXECUTE_STDOUT_INVALID:', 'stdout coming after child exit,', `got ${JSON.stringify(data.toString())},`, 'this is embarassing and we never found how to catch this bug,', 'we would really enjoy some help to replicate or fix this one.'].join(' '));
          }
        }
      });
    }
    if (config.stderr_return || config.stderr_log) {
      child.stderr.on('data', function(data) {
        if (config.stderr_log) {
          stderr_stream_open = true;
        }
        if (config.stderr_log) {
          log({
            message: data,
            type: 'stderr_stream'
          });
        }
        if (config.stderr_return) {
          if (Array.isArray(result.stderr)) { // A string once `exit` is called
            return result.stderr.push(data);
          } else {
            return console.warn(['NIKITA_EXECUTE_STDERR_INVALID:', 'stderr coming after child exit,', `got ${JSON.stringify(data.toString())},`, 'this is embarassing and we never found how to catch this bug,', 'we would really enjoy some help to replicate or fix this one.'].join(' '));
          }
        }
      });
    }
    return child.on("exit", function(code) {
      result.code = code;
      // Give it some time because the "exit" event is sometimes called
      // before the "stdout" "data" event when running `npm test`
      return setImmediate(function() {
        if (stdout_stream_open && config.stdout_log) {
          log({
            message: null,
            type: 'stdout_stream'
          });
        }
        if (stderr_stream_open && config.stderr_log) {
          log({
            message: null,
            type: 'stderr_stream'
          });
        }
        result.stdout = result.stdout.map(function(d) {
          return d.toString();
        }).join('');
        if (config.trim || config.stdout_trim) {
          result.stdout = result.stdout.trim();
        }
        result.stderr = result.stderr.map(function(d) {
          return d.toString();
        }).join('');
        if (config.trim || config.stderr_trim) {
          result.stderr = result.stderr.trim();
        }
        if (config.format && config.code.indexOf(code) !== -1) {
          result.data = (function() {
            switch (config.format) {
              case 'json':
                return JSON.parse(result.stdout);
              case 'yaml':
                return yaml.load(result.stdout);
            }
          })();
        }
        if (result.stdout && result.stdout !== '' && config.stdout_log) {
          log({
            message: result.stdout,
            type: 'stdout'
          });
        }
        if (result.stderr && result.stderr !== '' && config.stderr_log) {
          log({
            message: result.stderr,
            type: 'stderr'
          });
        }
        if (config.stdout) {
          child.stdout.unpipe(config.stdout);
        }
        if (config.stderr) {
          child.stderr.unpipe(config.stderr);
        }
        if (config.code.indexOf(code) === -1 && config.code_skipped.indexOf(code) === -1) {
          return reject(utils.error('NIKITA_EXECUTE_EXIT_CODE_INVALID', ['an unexpected exit code was encountered,', `command is ${JSON.stringify(utils.string.max(config.command_original, 50))},`, `got ${JSON.stringify(result.code)}`, config.code.length === 1 ? `instead of ${config.code}.` : `while expecting one of ${JSON.stringify(config.code)}.`], {
            ...result,
            exit_code: code
          }));
        }
        if (config.code_skipped.indexOf(code) === -1) {
          result.$status = true;
        } else {
          log({
            message: `Skip exit code \"${code}\"`,
            level: 'INFO'
          });
        }
        return resolve(result);
      });
    });
  });
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    argument_to_config: 'command',
    definitions: definitions
  }
};

// ## Dependencies
exec = require('ssh2-exec');

yaml = require('js-yaml');

utils = require('../../utils');
