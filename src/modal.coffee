"use strict"

addClass = (el, className) ->
  el.className += " #{className}"

removeClass = (el, className) ->
  re = new RegExp "(?:^|\\s)#{className}(?!\\S)", 'g'
  el.className = el.className.replace re , ''

transitionEnd = (->
  el = document.createElement "zveloFakeElement"
  transEndEventNames =
    WebkitTransition: "webkitTransitionEnd"
    MozTransition:    "transitionend"
    OTransition:      "oTransitionEnd otransitionend"
    transition:       "transitionend"

  for name of transEndEventNames
    return transEndEventNames[name] if el.style[name]?
)()

define [ "domReady", "template/modal" ], (domReady, tpl) ->
  class Modal
    constructor: (@ctx) ->
      @_configure()
      @el = Modal._createEl tpl(@ctx)
      addClass @el, "fade"

      domReady @show.bind(this)

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

    show: ->
      return if @isShown
      @isShown = true

      that = this

      document.body.appendChild @el

      @_backdrop ->
        that.el.style.display = "block"
        that.el.offsetWidth  ## force reflow
        addClass that.el, "in"

      return this

    hide: ->
      return unless @isShown
      @isShown = false

      that = this

      removeClass @el, "in"
      Modal._transitionEnd @el, ->
        that.remove()
        if transitionEnd? then that.hideWithTransition() else that.hideModal()

    hideWithTransition: ->
      that = this

      timeout = setTimeout(->
        that.hideModal()
      , 500)

      Modal._transitionEnd @el, ->
        clearTimeout timeout
        that.hideModal()

      return this

    hideModal: ->
      @el.style.display = "none"
      that = this
      @_backdrop -> that.removeBackdrop()
      return this

    removeBackdrop: ->
      document.body.removeChild @backdrop if @backdrop?
      delete @backdrop

    remove: ->
      document.body.removeChild @el
      removeClass @el, "in"

  return Modal
