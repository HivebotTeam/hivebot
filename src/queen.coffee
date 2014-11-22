# Main robot functions

# connect to irc, react to sending and receiving

# each queen has one adapter, should connect to one service
# IRC as an example would have a thin irc client that connects
# to one channel, etc.
class Queen
  constructor: (adapter, test) ->
    #do things to prepare
    console.log 'Queen loading...'
    @adapter = adapter
    @listeners = []

    @test = test
    @test2 = false
    
    @loadAdapter()

  debug: ->
    console.log 'TEST' if @test
    console.log 'TEST2' if @test2
    console.log 'OK'

  # Called when receiving a message from an adapter
  receive: (message) ->
    # check if the received message triggers any listeners
    console.log "Received '#{message}'"
    for listener in @listeners
      console.log "Matched '#{listener.name}'" if listener.match message
  
  # Register a listener
  listen: (listener) ->
    @listeners.push listener

  loadAdapter: ->
    # this should try to set up an adapter

module.exports = Queen