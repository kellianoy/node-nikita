
`nikita.file.types.pacman_conf`

Pacman is a package manager utility for Arch Linux. The file is usually located 
in "/etc/pacman.conf".
  
## Schema

    schema =
      type: 'object'
      properties:
        'rootdir':
          type: 'string'
          description: """
          Path to the mount point corresponding to the root directory, optional.
          """
        'backup':
          type: ['string', 'boolean']
          description: """
          Create a backup, append a provided string to the filename extension or
          a timestamp if value is not a string, only apply if the target file
          exists and is modified.
          """
        'clean':
          type: 'boolean'
          description: """
          Remove all the lines whithout a key and a value, default to "true".
          """
        'content':
          type: 'object'
          description: """
          Object to stringify.
          """
        'merge':
          type: 'boolean'
          description: """
          Read the target if it exists and merge its content.
          """
        'target':
          type: 'string', default: '/etc/pacman.conf'
          description: """
          Destination file.
          """
          
## Handler

    handler = ({config}) ->
      #log message: "Entering file.types.pacman_conf", level: 'DEBUG', module: 'nikita/lib/file/types/pacman_conf'
      config.target = "#{path.join config.rootdir, config.target}" if config.rootdir
      @file.ini
        stringify: utils.ini.stringify_single_key
      , config

## Exports

    module.exports =
      handler: handler
      schema: schema

## Dependencies

    path = require 'path'
    utils = require '../utils'