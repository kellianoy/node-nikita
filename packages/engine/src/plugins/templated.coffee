
templated = require 'self-templated'

module.exports =
  name: '@nikitajs/engine/src/plugins/templated'
  hooks:
    'nikita:session:normalize': (action) ->
      action.metadata.templated ?= true
    'nikita:session:action': (action) ->
      return unless action.metadata.templated
      templated action,
        array: true
        compile: false
        mutate: true
        partial:
          metadata: true
          config: true
