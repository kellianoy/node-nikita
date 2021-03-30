// Generated by CoffeeScript 2.5.1
var handlers, mutate, session, utils;

session = require('../../session');

utils = require('../../utils');

({mutate} = require('mixme'));

module.exports = {
  name: '@nikitajs/core/lib/plugins/assertions/exists',
  require: ['@nikitajs/core/lib/plugins/metadata/raw', '@nikitajs/core/lib/plugins/metadata/disabled'],
  hooks: {
    'nikita:normalize': {
      // This is hanging, no time for investigation
      // after: [
      //   '@nikitajs/core/lib/plugins/assertions'
      // ]
      handler: function(action, handler) {
        var assertions, property, ref, value;
        // Ventilate assertions properties defined at root
        assertions = {};
        ref = action.metadata;
        for (property in ref) {
          value = ref[property];
          if (/^(un)?assert_exists$/.test(property)) {
            if (assertions[property]) {
              throw Error('ASSERTION_DUPLICATED_DECLARATION', [`Property ${property} is defined multiple times,`, 'at the root of the action and inside assertions']);
            }
            if (!Array.isArray(value)) {
              value = [value];
            }
            assertions[property] = value;
            delete action.metadata[property];
          }
        }
        return async function() {
          action = (await handler.call(null, ...arguments));
          mutate(action.assertions, assertions);
          return action;
        };
      }
    },
    'nikita:result': async function({action, error, output}) {
      var final_run, k, local_run, ref, v;
      final_run = true;
      ref = action.assertions;
      for (k in ref) {
        v = ref[k];
        if (handlers[k] == null) {
          continue;
        }
        local_run = (await handlers[k].call(null, action));
        if (local_run === false) {
          final_run = false;
        }
      }
      if (!final_run) {
        throw utils.error('NIKITA_INVALID_ASSERTION', ['action did not validate the assertion']);
      }
    }
  }
};

handlers = {
  assert_exists: async function(action) {
    var assertion, final_run, i, len, ref, run;
    final_run = true;
    ref = action.assertions.assert_exists;
    for (i = 0, len = ref.length; i < len; i++) {
      assertion = ref[i];
      run = (await session({
        $bastard: true,
        $parent: action,
        $raw_output: true
      }, async function({parent}) {
        var exists;
        ({exists} = (await this.fs.base.exists({
          target: assertion
        })));
        return exists;
      }));
      if (run === false) {
        final_run = false;
      }
    }
    return final_run;
  },
  unassert_exists: async function(action) {
    var assertion, final_run, i, len, ref, run;
    final_run = true;
    ref = action.assertions.unassert_exists;
    for (i = 0, len = ref.length; i < len; i++) {
      assertion = ref[i];
      run = (await session({
        $bastard: true,
        $parent: action,
        $raw_output: true
      }, async function() {
        var exists;
        ({exists} = (await this.fs.base.exists({
          target: assertion
        })));
        return exists;
      }));
      if (run === true) {
        final_run = false;
      }
    }
    return final_run;
  }
};
