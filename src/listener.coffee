addEvent = (obj, type, fn) ->
  return unless obj? and typeof obj is "object"

  if "addEventListener" of obj
    obj.addEventListener type, fn, false
  else
    obj.attachEvent "on#{type}", fn

define -> return addEvent
