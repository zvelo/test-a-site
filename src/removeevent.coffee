removeEvent = (obj, type, fn) ->
  return unless typeof obj is "object"

  if "removeEventListener" of obj
    obj.removeEventListener type, fn, false
  else
    obj.detachEvent "on#{type}", fn

define -> return removeEvent
