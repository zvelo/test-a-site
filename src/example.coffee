"use strict"

define [
  "domReady"
  "zvelonet"
  "modal"
  "templates"
], (domReady, ZveloNET, Modal, templates) ->
  class Example
    constructor: ->
      @_modals = {}  ## TODO(jrubin) do we really still need this?

      @_zn = new ZveloNET
        znhost: "http://10.211.55.130:3333"  ## TODO(jrubin) delete
        username: "zvelo.com"
        password: "7j25jx7XVAe"
        hashMashWorker: "/js/vendor/hashmash/worker.min.js"

      domReady @onDomReady.bind(this)

    onDomReady: ->
      @show "lookup"
      @showLoading()
      @_zn.ready.then @lookupReady.bind(this)

    show: (tpl, ctx) ->
      el = document.getElementById "zvelonet"
      el.innerHTML = templates[tpl] ctx

      ## setup listeners
      @_tpl = {}
      switch tpl
        when "lookup"
          @_tpl =
            form:  el.getElementsByTagName("form")[0]
            field: el.getElementsByTagName("input")[0]
          @_tpl.form.addEventListener "submit", @submit.bind(this)
          @_tpl.field.focus()
        when "result"
          @_tpl =
            btn: el.getElementsByTagName("button")[0]
          @_tpl.btn.addEventListener "click", @show.bind(this, "lookup")
          @_tpl.btn.focus()

    showError: ->
      for arg in arguments
        if typeof arg is "function" then cb = arg
        else err = arg

      new Modal(
        header: "Error!"
        close: "Dismiss"
        body: err
        onClose: cb).show()

    showLoading: ->
      new Modal(
        header: "Loading..."
        body: "Initializing zveloNET...").show()

    authorizingModal: (action) ->
      action ?= "show"

      @_modals["authorizing"] ?= new Modal
        header: "Authorizing..."
        body: "Verifying user credentials..."

      @_modals["authorizing"][action]()

    lookupReady: ->
      Modal.hide()
      @_tpl.field.focus()

    submit: (ev) ->
      try
        ev.preventDefault()
        val = @_tpl.field.value
        @_tpl.field.blur()
        return unless val?.length

        @_zn.lookup(
          url: val
          reputation: true
          onHashMash: @authorizingModal.bind(this, "show")
          onAjax: console.log.bind console, "ajax")  ## TODO(jrubin)
          .then(@onResponse.bind this)
          .otherwise(@showError.bind(this, @lookupReady.bind(this)))
      catch e
        console.error e.stack
        @showError e.message, @lookupReady.bind(this)

    onResponse: (data) ->
      console.log "got data", data
      Modal.hide()
      ## TODO(jrubin) check for uncat, show that template
      @show "result", data

  return new Example
