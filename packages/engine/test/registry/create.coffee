
registry = require '../../src/registry'

describe 'registry.create', ->

  it 'static', ->
    registry.create.should.be.a.Function()

  it 'instance', ->
    registry.create().create.should.be.a.Function()

  it 'instance inherit parent chain', ->
    res = await chain = 'hello'
    registry
    .create(chain: chain)
    .create().register 'key': (->)
    res.should.eql chain
