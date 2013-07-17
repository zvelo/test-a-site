define ->
  class Event
    @ONCE = true

    on: (ev, fn, once) ->
      return unless ev? and fn?

      @_events ?= {}
      @_events[ev] ?=
        all:  []
        once: []

      if once is Event.ONCE then @_events[ev].once.push fn
      else                       @_events[ev].all.push  fn

      return

    off: (ev, fn) ->
      return unless ev? and fn? and @_events?[ev]?

      allArr  = @_events[ev].all
      onceArr = @_events[ev].once

      if (index = onceArr?.indexOf fn) > -1
        onceArr.splice index, 1

      if (index = allArr?.indexOf fn) > -1
        allArr.splice index, 1

      return

    trigger: (ev) ->
      return unless ev? and @_events? and @_events?[ev]?
      args = Array::slice.call arguments, 1

      fn.apply this, args for fn in @_events[ev].all
      fn.apply this, args for fn in @_events[ev].once

      @_events[ev].once = []

      return

  return Event
