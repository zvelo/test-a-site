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
      document.body.appendChild @el

      domReady @show.bind(this)

    _configure: ->
      @ctx ?= {}
      ## TODO(jrubin)

    @_createEl = (html) ->
      container = document.createElement "div"
      container.innerHTML = html
      return container.firstChild

    _backdrop: (cb) ->
      that = this

      if @isShown
        @backdrop = Modal._createEl "<div class=\"modal-backdrop\"/>"
        addClass @backdrop, "fade"
        document.body.appendChild @backdrop
        @backdrop.addEventListener "click", -> that.hide() if that.ctx.close
        @backdrop.offsetWidth  ## force reflow
        addClass @backdrop, "in"

        return unless cb?

        if transitionEnd?
          transitionEndFn = ->
            that.backdrop.removeEventListener transitionEnd, transitionEndFn, true
            cb()

          @backdrop.addEventListener transitionEnd, transitionEndFn, true
        else cb()
      else if not @isShown and @backdrop?
        removeClass @backdrop, "in"

        if transitionEnd?
          transitionEndFn = ->
            that.backdrop.removeEventListener transitionEnd, transitionEndFn, true
            cb()

          @backdrop.addEventListener transitionEnd, transitionEndFn, true
        else cb()
      else if cb? then cb()

    show: ->
      return if @isShown
      @isShown = true

      that = this

      @_backdrop ->
        that.el.style.display = "block"
        that.el.offsetWidth  ## force reflow
        addClass that.el, "in"

      return this

    hide: ->
      return unless @isShown
      @isShown = false

      removeClass @el, "in"

      if transitionEnd? then @hideWithTransition() else @hideModal()

    hideWithTransition: ->
      that = this

      timeout = setTimeout(->
        that.hideModal()
      , 7500)

      transitionEndFn = ->
        that.el.removeEventListener transitionEnd, transitionEndFn, true
        clearTimeout timeout
        that.hideModal()

      @el.addEventListener transitionEnd, transitionEndFn, true

      return this

    hideModal: ->
      @el.style.display = "none"
      that = this
      @_backdrop -> that.removeBackdrop()
      return this

    removeBackdrop: ->
      document.body.removeChild @backdrop if @backdrop?
      delete @backdrop

  return Modal
