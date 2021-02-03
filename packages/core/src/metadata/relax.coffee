
utils = require '../utils'

module.exports =
  name: '@nikitajs/core/src/metadata/relax'
  hooks:
    'nikita:session:action': (action, handler) ->
      action.metadata.relax ?= false
      if typeof action.metadata.relax is 'string' or
      action.metadata.relax instanceof RegExp
        action.metadata.relax = [action.metadata.relax]
      unless typeof action.metadata.relax is 'boolean' or
      action.metadata.relax instanceof Array
        throw utils.error 'METADATA_RELAX_INVALID_VALUE', [
          "configuration `relax` expects a boolean, string, array or regexp",
          "value, got #{JSON.stringify action.metadata.relax}."
        ]
      return handler unless action.metadata.relax
      (args) ->
        action = args
        new Promise (resolve, reject) ->
          try
            prom = handler.call null, args
            # Not, might need to get inspiration from retry to
            # handle the returned promise
            prom
            .then resolve
            .catch (err) ->
              if typeof action.metadata.relax is 'boolean' or
              err.code in action.metadata.relax or
              action.metadata.relax.some((v) -> err.code.match v)
                resolve error: err
              reject err
          catch err
            resolve error: err