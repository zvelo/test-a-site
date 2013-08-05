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

onTransitionEnd = (el, resolver) ->
  return resolver.resolve(el) unless transitionEnd?

  transitionEndFn = (ev) ->
    el.off transitionEnd, transitionEndFn
    resolver.resolve(el)

  el.on transitionEnd, transitionEndFn

onComplete = (el, resolver) ->
  if el._animate then onTransitionEnd el, resolver
  else resolver.resolve(el)

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

    text: -> return @el.textContent

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
        onComplete this, resolver

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
        onComplete this, resolver

      return this

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
