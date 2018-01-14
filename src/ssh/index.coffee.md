
# `nikita.ssh(options)`

Get the ssh connection if any.

## Options

* `ssh` (boolean)   
  Return the SSH connection if any and if true, null if false.

## Source code

    module.exports = get: true, handler: (options) ->
      options.ssh ?= options.argument
      throw Error "Invalid Option: ssh must be a boolean value or null or undefined, got #{JSON.stringify options.ssh}" if options.ssh? and not typeof options.ssh is 'boolean'
      throw Error 'Unavailable Connection: requested to return a SSH connection but none is initialized' if options.ssh is true and not options.store.ssh
      return null if options.ssh is false
      return options.store.ssh