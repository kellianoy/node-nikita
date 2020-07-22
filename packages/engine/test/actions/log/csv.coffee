
fs = require 'fs'
nikita = require '../../../src'
{tags, ssh} = require '../../test'
they = require('ssh2-they').configure ssh

return unless tags.posix

describe 'actions.log.csv', ->
  
  they 'write message', ({ssh}) ->
    nikita
      ssh: ssh
      tmpdir: true
    , ({metadata: {tmpdir}}) ->
      @log.csv basedir: tmpdir
      @call ({log}) -> log 'ok'
      content = await @fs.base.readFile "#{tmpdir}/localhost.log", encoding: 'ascii'
      content.should.eql 'text,INFO,"ok"\n'

  they 'write header', ({ssh}) ->
    nikita
      ssh: ssh
      tmpdir: true
    , ({metadata: {tmpdir}}) ->
      @log.csv basedir: tmpdir
      @call header: 'h1', ({log}) -> true
      content = await @fs.base.readFile "#{tmpdir}/localhost.log", encoding: 'ascii'
      content.should.eql 'header,,"h1"\n'
    