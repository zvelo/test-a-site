listener =
  add: (obj, type, fn) ->
    return unless obj? and typeof obj is "object"

    if "addEventListener" of obj
      obj.addEventListener type, fn, false
    else
      obj.attachEvent "on#{type}", fn

  remove: (obj, type, fn) ->
    return unless typeof obj is "object"

    if "removeEventListener" of obj
      obj.removeEventListener type, fn, false
    else
      obj.detachEvent "on#{type}", fn

define -> return listener
