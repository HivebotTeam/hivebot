class Listener
  # Initially will take a regex that can be matched against
  constructor: (name, regex) ->
    @regex = regex
    @name  = name
    # constructor stuff will go here
    
  check: (message) ->
    # receive a message, check if it matches a regex
    return message.match @regex