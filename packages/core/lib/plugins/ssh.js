// Generated by CoffeeScript 2.5.1
var merge, session, utils;

({merge} = require('mixme'));

utils = require('../utils');

session = require('../session');

/*
Pass an SSH connection or SSH information to an action. Disable SSH if the value
is `null` or `false`.
*/
module.exports = {
  name: '@nikitajs/core/lib/plugins/ssh',
  require: ['@nikitajs/core/lib/plugins/tools_find'],
  hooks: {
    // 'nikita:normalize': (action, handler) ->
    //   # Dont interfere with ssh actions
    //   return handler if action.metadata.namespace[0] is 'ssh'
    //   if action.hasOwnProperty 'ssh'
    //     ssh = action.ssh
    //     delete action.ssh
    //   ->
    //     action = await handler.call null, ...arguments
    //     action.ssh = ssh
    //     action
    'nikita:action': async function(action) {
      var i, len, ref, ref1, ref2, sibling, ssh;
      // Is there a connection to open
      if (action.ssh && !utils.ssh.is(action.ssh)) {
        ({ssh} = (await session.with_options([{}], {
          plugins: [require('../plugins/tools_events'), require('../plugins/tools_log'), require('../metadata/status'), require('../plugins/history')] // Need to inject `tools.log`
        }).ssh.open(action.ssh)));
        action.metadata.ssh_dispose = true;
        action.ssh = ssh;
        return;
      }
      // Find SSH connection in parent actions
      ssh = (await action.tools.find(function(action) {
        return action.ssh;
      }));
      if (ssh) {
        if (!utils.ssh.is(ssh)) {
          throw utils.error('NIKITA_SSH_INVALID_STATE', ['the `ssh` property is not a connection', `got ${JSON.stringify(ssh)}`]);
        }
        action.ssh = ssh;
        return;
      } else if (ssh === null || ssh === false) {
        if (action.ssh !== void 0) {
          action.ssh = null;
        }
        return;
      } else if (ssh !== void 0) {
        throw utils.error('NIKITA_SSH_INVALID_VALUE', ['when disabled, the `ssh` property must be `null` or `false`,', 'when enable, the `ssh` property must be a connection or a configuration object', `got ${JSON.stringify(ssh)}`]);
      }
      ref = action.siblings;
      // Find SSH open in previous siblings
      for (i = 0, len = ref.length; i < len; i++) {
        sibling = ref[i];
        if (sibling.metadata.module !== '@nikitajs/core/lib/actions/ssh/open') {
          continue;
        }
        if (sibling.output.ssh) {
          ssh = sibling.output.ssh;
          break;
        }
      }
      // Then only set the connection if still open
      if (ssh && (((ref1 = ssh._sshstream) != null ? ref1.writable : void 0) || ((ref2 = ssh._sock) != null ? ref2.writable : void 0))) {
        return action.ssh = ssh;
      }
    },
    'nikita:result': async function({action}) {
      if (action.metadata.ssh_dispose) {
        return (await session.with_options([{}], {
          plugins: [require('../plugins/tools_events'), require('../plugins/tools_log'), require('../metadata/status'), require('../plugins/history')] // Need to inject `tools.log`
        }).ssh.close({
          ssh: action.ssh
        }));
      }
    }
  }
};
