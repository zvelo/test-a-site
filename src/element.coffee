transitionEnd = ( ->
  el = document.createElement "zveloFakeElement"
  transEndEventNames =
    WebkitTransition: "webkitTransitionEnd"
    MozTransition:    "transitionend"
    OTransition:      "oTransitionEnd otransitionend"
    transition:       "transitionend"

  for name of transEndEventNames
    return transEndEventNames[name] if el.style[name]?
)()

define ["when"], (whn) ->
  class Element
    constructor: (@el, @_animate) ->
      ## if @_animate is false, promises for addClass and removeClass
      ## resolve immediately, not after transitions end
      @_animate ?= true

      return unless @el?

      switch typeof @el
        when "string"
          container = document.createElement "div"
          container.innerHTML = @el
          @el = container.firstChild
        when "object"
          @el = @el.el if @el instanceof Element

    animate: (value) ->
      return @_animate unless value?
      @_animate = value
      return this

    html: (value) ->
      return this unless @el?
      return @el.innerHTML unless value?

      @el.innerHTML = ""
      @el.innerHTML = value
      @el.style.display = "block"

      return this

    text: ->
      return @el.nodeValue if @el.nodeType in [3, 4]
      return "" unless @el.nodeType in [1, 9, 11]
      return @el.textContent if typeof @el.textContent is "string"

      ret = ""
      elem = $(@el.firstChild)

      while elem.el
        ret += elem.text()
        elem = $(elem.el.nextSibling)

      return ret

    on: (ev, fn) ->
      return this unless @el?

      if "addEventListener" of @el
        @el.addEventListener ev, fn, false
      else
        @el.attachEvent "on#{ev}", fn

      return this

    off: (ev, fn) ->
      return this unless @el?

      if "removeEventListener" of @el
        @el.removeEventListener ev, fn, false
      else
        @el.detachEvent "on#{ev}", fn

      return this

    find: (selector) ->
      return this unless @el?
      return $(@el.querySelector selector)

    attr: (key, value) ->
      return this unless @el?

      return @el.getAttribute key unless value?
      @el.setAttribute key, value
      return this

    hasClass: (className) ->
      return false unless @el?
      return (" #{@el.className} ").indexOf(" #{className} ") > -1

    addClass: (className, cb, scope) ->
      return this unless @el?

      scope ?= this
      { promise, resolver } = whn.defer()
      promise.then cb.bind(scope) if cb?

      if @hasClass className
        resolver.resolve(this)
      else
        @el.className += " #{className}"
        @_onComplete resolver

      return this

    removeClass: (className, cb, scope) ->
      return this unless @el?

      scope ?= this
      { promise, resolver } = whn.defer()
      promise.then cb.bind(scope) if cb?

      unless @hasClass className
        resolver.resolve(this)
      else
        re = new RegExp "(?:^|\\s)#{className}(?!\\S)", 'g'
        @el.className = @el.className.replace re , ""
        @_onComplete resolver

      return this

    _onComplete: (resolver) ->
      if @_animate then @_onTransitionEnd resolver
      else resolver.resolve this

    _onTransitionEnd: (resolver) ->
      return resolver.resolve this unless transitionEnd?

      transitionEndFn = ((ev) ->
        @off transitionEnd, transitionEndFn
        resolver.resolve this
      ).bind(this)

      @on transitionEnd, transitionEndFn

    append: (el) ->
      return this unless @el? and el?
      el = $(el)
      return this unless el.el?
      @el.appendChild el.el
      return this

    remove: (el) ->
      el = $(el)
      @el?.removeChild el.el
      return this

    display: (value) ->
      @el?.style.display = value
      return this

    focus: ->
      @el?.focus()
      return this

    blur: ->
      @el?.blur()
      return this

    value: (v) ->
      return this unless @el?

      return @el.value unless v?
      @el.value = v
      return this

    options: (index) ->
      return @el?.options unless index?
      return @el?.options?[index]

    selectedIndex: -> return @el?.selectedIndex

    reflow: ->
      @el?.offsetWidth
      return this

  $ = (el, animate) -> return new Element el, animate
  $.transitionEnd = transitionEnd

  return $
