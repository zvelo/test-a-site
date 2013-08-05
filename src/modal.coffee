"use strict"

define [ "templates", "event", "element" ], (templates, Event, $) ->
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
      @el = $(templates["modal"] @ctx)
      @el.animate @el.hasClass "fade"

      @on "backdrop shown",  @_onBackdropShown.bind(this)
      @on "modal shown",     @_onModalShown.bind(this)
      @on "modal hidden",    @_onModalHidden.bind(this)
      @on "backdrop hidden", @_onBackdropHidden.bind(this)

    _configure: ->
      @ctx ?= {}
      ## TODO(jrubin)

    _showBackdrop: ->
      return unless @status is "showing"

      @backdrop = $("<div>", @el.animate())
        .addClass("modal-backdrop")

      @backdrop.addClass @ctx.class if @ctx.class?
      @backdrop.addClass "fade"     if @el.animate()

      $(document.body).append(@backdrop)

      @backdrop.on("click", @hide.bind this) if @ctx.close

      @backdrop
        .reflow()
        .addClass("in", @trigger.bind(this, "backdrop shown"))

    _hideBackdrop: ->
      return unless @status is "hiding" and @backdrop?
      @backdrop.removeClass("in", @trigger.bind(this, "backdrop hidden"))

    _setStatus: (value) ->
      return false if @status is "hiding" and value in [ "showing", "shown" ]
      @status = value
      @trigger value
      return true

    setHeader: (value) ->
      @el.find("h3").html(value)
      return this

    setBody: (value) ->
      @el.find("p").html(value)
      return this

    show: ->
      return this if @status in [ "shown", "showing" ]
      return this unless @_setStatus "showing"
      Modal.hideCurrent @_show.bind(this)
      return this

    _show: ->
      return if Modal.current?
      Modal.current = this

      that = this

      if @ctx.close
        @onKeyUp = (ev) -> that.hide() if ev.which is 27  ## escape
        $(document.body).on("keyup", @onKeyUp)

      $(document.body).append @el

      @_showBackdrop()

    _onBackdropShown: ->
      return unless @status is "showing"

      @el.display("block").reflow()

      if @ctx.btn
        @el.find(".btn.btn-primary")
          .on("click", @hide.bind this)

      if @ctx.close
        @el.find(".close")
          .on("click", @hide.bind this)

      @el.addClass("in", @trigger.bind(this, "modal shown"))

    _onModalShown: ->
      ## this ensures all transitions complete before shown is set
      setTimeout @_setStatus.bind(this, "shown"), 1

    _onBackdropHidden: ->
      @_removeBackdrop()
      setTimeout @_setStatus.bind(this, "hidden"), 1

    _onModalHidden: ->
      $(document.body).remove(@el.display "none")
      @_hideBackdrop()

    hide: ->
      if @status is "showing"
        return @on "shown", @hide.bind(this), Event.ONCE

      return unless @status is "shown"

      @_setStatus "hiding"
      @el.removeClass("in", @trigger.bind(this, "modal hidden"))

      return this

    _removeBackdrop: ->
      body = $(document.body)
      body.off("keyup", @onKeyUp) if @onKeyUp?
      body.remove @backdrop if @backdrop?
      delete Modal.current if Modal.current is this
      delete @backdrop

      @ctx.onClose this if @ctx.onClose?

    toggle: -> if @status in [ "shown", "showing" ] then @hide() else @show()

  return Modal
