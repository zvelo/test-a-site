"use strict"

hasClass = (el, className) ->
  return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1

addClass = (el, className) ->
  el.className += " #{className}"

removeClass = (el, className) ->
  re = new RegExp "(?:^|\\s)#{className}(?!\\S)", 'g'
  el.className = el.className.replace re , ""

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

define [ "templates" ], (templates) ->
  class Modal
    @hide = (cb) ->
      unless Modal.shown?
        cb() if cb?
        return false

      Modal.shown.hide cb
      return true

    constructor: (@ctx) ->
      @_configure()
      @el = Modal._createEl templates["modal"](@ctx)
      addClass @el, "fade"

    _configure: ->
      @ctx ?= {}
      ## TODO(jrubin)

    @_createEl = (html) ->
      container = document.createElement "div"
      container.innerHTML = html
      return container.firstChild

    @_transitionEnd = (el, cb) ->
      unless transitionEnd?
        cb() if cb?
        return

      transitionEndFn = ->
        el.removeEventListener transitionEnd, transitionEndFn, true
        cb()

      el.addEventListener transitionEnd, transitionEndFn, true

    _backdrop: (cb) ->
      that = this

      if @isShown
        @backdrop = Modal._createEl "<div class=\"modal-backdrop\"/>"
        addClass @backdrop, "fade"
        document.body.appendChild @backdrop
        @backdrop.addEventListener "click", -> that.hide() if that.ctx.close
        @backdrop.offsetWidth  ## force reflow
        addClass @backdrop, "in"

        Modal._transitionEnd @backdrop, cb
      else if not @isShown and @backdrop?
        removeClass @backdrop, "in"
        Modal._transitionEnd @backdrop, cb

    setHeader: (value) ->
      @ctx.header = value
      @el.innerHTML = templates["modal"] @ctx
      return this

    setBody: (value) ->
      @ctx.body = value
      @el.innerHTML = templates["modal"] @ctx
      return this

    show: ->
      return this if @isShown
      Modal.hide @_show.bind this
      return this

    _show: ->
      return if @isShown or Modal.shown?
      Modal.shown = this
      @isShown = true

      that = this

      if @ctx.close
        @onKeyUp = (ev) -> that.hide() if ev.which is 27  ## escape
        document.body.addEventListener "keyup", @onKeyUp, true

      document.body.appendChild @el

      @_backdrop ->
        that.el.style.display = "block"
        that.el.offsetWidth  ## force reflow
        addClass that.el, "in"

        if that.ctx.btn
          btn = that.el.getElementsByClassName("btn btn-primary")[0]
          btn.addEventListener "click", that.hide.bind(that), true

        if that.ctx.close
          xBtn = that.el.getElementsByClassName("close")[0]
          xBtn.addEventListener "click", that.hide.bind(that), true

    hide: (cb) ->
      return this unless @isShown and Modal.shown is this
      delete Modal.shown
      @isShown = false

      that = this

      removeClass @el, "in"
      Modal._transitionEnd @el, ->
        that._remove()
        if transitionEnd? then that._hideWithTransition(cb) else that._hideModal(cb)

      return this

    _hideWithTransition: (cb) ->
      that = this

      timeout = setTimeout(->
        that._hideModal cb
      , 500)

      Modal._transitionEnd @el, ->
        clearTimeout timeout
        that._hideModal cb

      return this

    _hideModal: (cb) ->
      @el.style.display = "none"
      that = this
      @_backdrop -> that._removeBackdrop cb
      return this

    _removeBackdrop: (cb) ->
      document.body.removeChild @backdrop if @backdrop?
      delete @backdrop

      document.body.removeEventListener "keyup", @onKeyUp, true if @onKeyUp?
      @ctx.onClose this if @ctx.onClose?
      cb this if typeof cb is "function"

    _remove: ->
      document.body.removeChild @el
      removeClass @el, "in"

    toggle: -> if @isShown then @hide() else @show()

  return Modal
