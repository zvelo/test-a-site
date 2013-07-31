"use strict"

hasClass = (el, className) ->
  return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1

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

createEl = (html) ->
  container = document.createElement "div"
  container.innerHTML = html
  return container.firstChild

define [
  "addevent"
  "removeevent"
  "purge"
  "sethtml"
  "event"
  "templates"
], (addEvent, removeEvent, purge, setHtml, Event, templates) ->
  onTransitionEnd = (el, cb) ->
    unless transitionEnd?
      cb() if cb?
      return

    transitionEndFn = (ev) ->
      removeEvent el, transitionEnd, transitionEndFn
      cb() if cb?

    addEvent el, transitionEnd, transitionEndFn

  addClass = (el, className, cb) ->
    unless hasClass el, className
      el.className += " #{className}"
      onTransitionEnd el, cb if cb?
    else cb() if cb?

  removeClass = (el, className, cb) ->
    if hasClass el, className
      re = new RegExp "(?:^|\\s)#{className}(?!\\S)", 'g'
      el.className = el.className.replace re , ""
      onTransitionEnd el, cb if cb?
    else
      cb() if cb?

  class Modal extends Event
    @hideCurrent: (cb) ->
      unless Modal.current? or Modal.status is "hidden"
        cb() if cb?
        return false

      Modal.current.on "hidden", cb, Event.ONCE if cb?
      Modal.current.hide()

      return true

    constructor: (@ctx) ->
      @_configure()
      @el = createEl templates["modal"](@ctx)
      @animate = hasClass @el, "fade"

      @on "backdrop shown",  @_onBackdropShown.bind(this)
      @on "modal shown",     @_onModalShown.bind(this)
      @on "modal hidden",    @_onModalHidden.bind(this)
      @on "backdrop hidden", @_onBackdropHidden.bind(this)

    _configure: ->
      @ctx ?= {}
      ## TODO(jrubin)

    _addClass: (el, className, cb) ->
      unless @animate
        addClass el, className
        cb() if cb?
        return

      addClass el, className, cb

    _removeClass: (el, className, cb) ->
      unless @animate
        removeClass el, className
        cb() if cb?
        return

      removeClass el, className, cb

    _showBackdrop: ->
      return unless @status is "showing"

      @backdrop = createEl "<div class=\"modal-backdrop" +
                           (if @animate then " fade" else "") +
                           "\"></div>"
      document.body.appendChild @backdrop

      addEvent @backdrop, "click", @hide.bind(this) if @ctx.close

      @backdrop.offsetWidth  ## force reflow
      @_addClass @backdrop, "in", @trigger.bind(this, "backdrop shown")

    _hideBackdrop: ->
      return unless @status is "hiding" and @backdrop?
      @_removeClass @backdrop, "in", @trigger.bind(this, "backdrop hidden")

    _setStatus: (value) ->
      return false if @status is "hiding" and value in [ "showing", "shown" ]
      @status = value
      @trigger value
      return true

    setHeader: (value) ->
      setHtml @el.querySelector("h3"), value
      return this

    setBody: (value) ->
      setHtml @el.querySelector("p"), value
      return this

    show: ->
      return this if @status in [ "shown", "showing" ]
      return this unless @_setStatus "showing"
      Modal.hideCurrent @_show.bind this
      return this

    _show: ->
      return if Modal.current?
      Modal.current = this

      that = this

      if @ctx.close
        @onKeyUp = (ev) -> that.hide() if ev.which is 27  ## escape
        addEvent document.body, "keyup", @onKeyUp

      document.body.appendChild @el

      @_showBackdrop()

    _onBackdropShown: ->
      return unless @status is "showing"

      @el.style.display = "block"
      @el.offsetWidth  ## force reflow

      if @ctx.btn
        btn = @el.querySelector("btn btn-primary")
        addEvent btn, "click", @hide.bind(this)

      if @ctx.close
        xBtn = @el.querySelector("close")
        addEvent xBtn, "click", @hide.bind(this)

      @_addClass @el, "in", @trigger.bind(this, "modal shown")

    _onModalShown: ->
      ## this ensures all transitions complete before shown is set
      setTimeout @_setStatus.bind(this, "shown"), 1

    _onBackdropHidden: ->
      @_removeBackdrop()
      setTimeout @_setStatus.bind(this, "hidden"), 1

    _onModalHidden: ->
      purge @el
      document.body.removeChild @el
      @el.style.display = "none"
      @_hideBackdrop()

    hide: ->
      if @status is "showing"
        return @on "shown", @hide.bind(this), Event.ONCE

      return unless @status is "shown"

      @_setStatus "hiding"
      @_removeClass @el, "in", @trigger.bind(this, "modal hidden")

      return this

    _removeBackdrop: ->
      removeEvent document.body, "keyup", @onKeyUp, true if @onKeyUp?
      purge @backdrop
      document.body.removeChild @backdrop if @backdrop?
      delete Modal.current if Modal.current is this
      delete @backdrop

      @ctx.onClose this if @ctx.onClose?

    toggle: -> if @status in [ "shown", "showing" ] then @hide() else @show()

  return Modal
