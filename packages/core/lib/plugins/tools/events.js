// Generated by CoffeeScript 2.5.1
var EventEmitter;

({EventEmitter} = require('events'));

module.exports = {
  name: '@nikitajs/core/lib/plugins/tools/events',
  hooks: {
    'nikita:normalize': function(action, handler) {
      return async function() {
        // Handler execution
        action = (await handler.apply(null, arguments));
        // Register function
        if (action.tools == null) {
          action.tools = {};
        }
        action.tools.events = action.parent ? action.parent.tools.events : action.tools.events = new EventEmitter();
        return action;
      };
    },
    'nikita:action': function(action) {
      return action.tools.events.emit('nikita:action:start', {
        action: action
      });
    },
    'nikita:result': {
      after: '@nikitajs/core/lib/plugins/output/status',
      handler: function({action, error, output}, handler) {
        return async function({action}) {
          try {
            output = (await handler.apply(null, arguments));
            action.tools.events.emit('nikita:action:end', {
              action: action,
              error: void 0,
              output: output
            });
            return output;
          } catch (error1) {
            error = error1;
            action.tools.events.emit('nikita:action:end', {
              action: action,
              error: error,
              output: void 0
            });
            throw error;
          }
        };
      }
    },
    'nikita:resolved': function({action}) {
      return action.tools.events.emit('nikita:resolved', ...arguments);
    },
    'nikita:rejected': function({action}) {
      return action.tools.events.emit('nikita:rejected', ...arguments);
    }
  }
};
