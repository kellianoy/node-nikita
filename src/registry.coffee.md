
## Register all functions

    module.exports =
      # Core
      backup: require './core/backup'
      cache: require './core/cache'
      chmod: require './core/chmod'
      chown: require './core/chown'
      compress: require './core/compress'
      copy: require './core/copy'
      download: require './core/download'
      execute: require './core/execute'
      extract: require './core/extract'
      git: require './core/git'
      group: require './core/group'
      iptables: require './core/iptables'
      link: require './core/link'
      mkdir: require './core/mkdir'
      move: require './core/move'
      remove: require './core/remove'
      render: require './core/render'
      system_limits: require './core/system_limits'
      touch: require './core/touch'
      upload: require './core/upload'
      user: require './core/user'
      # Cron
      cron_add: require './cron/add'
      cron_remove: require './cron/remove'
      # Docker
      docker_build: require './docker/build'
      docker_checksum: require './docker/checksum'
      docker_cp: require './docker/cp'
      docker_exec: require './docker/exec'
      docker_kill: require './docker/kill'
      docker_load: require './docker/load'
      docker_pause: require './docker/pause'
      docker_restart: require './docker/restart'
      docker_rm: require './docker/rm'
      docker_rmi: require './docker/rmi'
      docker_run: require './docker/run'
      docker_save: require './docker/save'
      docker_service: require './docker/service'
      docker_start: require './docker/start'
      docker_status: require './docker/status'
      docker_stop: require './docker/stop'
      docker_unpause: require './docker/unpause'
      docker_volume_create: require './docker/volume_create'
      docker_volume_rm: require './docker/volume_rm'
      docker_wait: require './docker/wait'
      # Java
      java_keystore_add: require './java/keystore_add'
      java_keystore_remove: require './java/keystore_remove'
      # Kerberos
      krb5_addprinc: require './krb5/addprinc'
      krb5_delprinc: require './krb5/delprinc'
      krb5_ktadd: require './krb5/ktadd'
      # LDAP
      ldap_acl: require './ldap/acl'
      ldap_add: require './ldap/add'
      ldap_delete: require './ldap/delete'
      ldap_index: require './ldap/index'
      ldap_schema: require './ldap/schema'
      ldap_user: require './ldap/user'
      # Service
      service: require './service'
      service_install: require './service/install'
      service_remove: require './service/remove'
      service_restart: require './service/restart'
      service_start: require './service/start'
      service_startup: require './service/startup'
      service_status: require './service/status'
      service_stop: require './service/stop'
      # Wait
      wait: require './wait/time'
      wait_connect: require './wait/connect'
      wait_execute: require './wait/execute'
      wait_exist: require './wait/exist'
      # Write
      write: require './write'
      write_ini: require './write/ini'
      write_properties: require './write/properties'
      write_yaml: require './write/yaml'

    Object.defineProperty module.exports, 'registered', 
      configurable: true
      enumerable: false
      get: -> (name) ->
        !!module.exports[name]
          
    Object.defineProperty module.exports, 'register', 
      configurable: true
      enumerable: false
      get: -> (name, handler) ->
        return module.exports.unregister name unless handler
        throw Error "Function already defined '#{name}'" if module.exports.registered name
        module.exports[name] = handler
            
    Object.defineProperty module.exports, 'unregister', 
      configurable: true
      enumerable: false
      get: -> (name) ->
        delete module.exports[name]
        