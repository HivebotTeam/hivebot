# Main robot functions

# connect to irc, react to sending and receiving

class Queen
  constructor: (test) ->
    #do things to prepare
    console.log 'Queen loading...'

    @test = test
    @test2 = false

  debug: ->
    console.log 'TEST' if @test
    console.log 'TEST2' if @test2
    console.log 'OK'

module.exports = Queen