
session = require '../session'
utils = require '../utils'
exec = require 'ssh2-exec'

module.exports = ->
  module: '@nikitajs/engine/src/plugins/conditions_os'
  require: [
    '@nikitajs/engine/src/plugins/conditions'
  ]
  hooks:
    'nikita:session:normalize':
      after: '@nikitajs/engine/src/plugins/conditions'
      handler: (action, handler) ->
        ->
          action = handler.call null, action
          return unless action.conditions
          # Normalize conditions
          for config in [action.conditions.if_os, action.conditions.unless_os]
            continue unless config
            for condition in config
              condition.name ?= []
              condition.name = [condition.name] unless Array.isArray condition.name
              condition.version ?= []
              condition.version = [condition.version] unless Array.isArray condition.version
              condition.version = utils.semver.sanitize condition.version, 'x'
              condition.arch ?= []
              condition.arch = [condition.arch] unless Array.isArray condition.arch
          action
    'nikita:session:action':
      after: '@nikitajs/engine/src/plugins/conditions'
      before: '@nikitajs/engine/src/metadata/disabled'
      handler: (action) ->
        final_run = true
        for k, v of action.conditions
          continue unless handlers[k]?
          local_run = await handlers[k].call null, action
          final_run = false if local_run is false
        if not final_run
          action.metadata.disabled = true
        action

handlers =
  if_os: (action) ->
    final_run = true
    await session null, ({run}) ->
      run
        hooks:
          on_result: ({action}) -> delete action.parent
        metadata:
          condition: true
          depth: action.metadata.depth
        parent: action
      , ->
        {status, stdout} = await @execute
          cmd: utils.os.os
        return final_run = false unless status
        [arch, name, version] = stdout.split '|'
        name = 'redhat' if name.toLowerCase() is 'red hat'
        # Remove patch version (eg centos 7.8)
        version = "#{match[0]}" if match = /^(\d+)\.(\d+)/.exec version
        match = action.conditions.if_os.some (condition) ->
          a = !condition.arch.length || condition.arch.some (value) ->
            return true if typeof value is 'string' and value is arch
            return true if value instanceof RegExp and value.test arch
          n = !condition.name.length || condition.name.some (value) ->
            return true if typeof value is 'string' and value is name
            return true if value instanceof RegExp and value.test name
          v = !condition.version.length || condition.version.some (value) ->
            version = utils.semver.sanitize version, '0'
            return true if typeof value is 'string' and utils.semver.satisfies version, value
            return true if value instanceof RegExp and value.test version
          return a and n and v
        final_run = false unless match
    final_run
  unless_os: (action) ->
    final_run = true
    await session null, ({run}) ->
      run
        hooks:
          on_result: ({action}) -> delete action.parent
        metadata:
          condition: true
          depth: action.metadata.depth
        parent: action
      , ->
        {status, stdout} = await @execute
          cmd: utils.os.os
        return final_run = false unless status
        [arch, name, version] = stdout.split '|'
        name = 'redhat' if name.toLowerCase() is 'red hat'
        # Remove patch version (eg centos 7.8)
        version = "#{match[0]}" if match = /^(\d+)\.(\d+)/.exec version
        match = action.conditions.unless_os.some (condition) ->
          a = !condition.arch.length || condition.arch.some (value) ->
            return true if typeof value is 'string' and value is arch
            return true if value instanceof RegExp and value.test arch
          n = !condition.name.length || condition.name.some (value) ->
            return true if typeof value is 'string' and value is name
            return true if value instanceof RegExp and value.test name
          v = !condition.version.length || condition.version.some (value) ->
            version = utils.semver.sanitize version, '0'
            return true if typeof value is 'string' and utils.semver.satisfies version, value
            return true if value instanceof RegExp and value.test version
          return a and n and v
        final_run = false if match
    final_run