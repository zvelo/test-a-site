"use strict"

define [
  "domReady"
  "zvelonet"
  "modal"
  "template/example"
], (domReady, ZveloNET, Modal, exampleTpl) ->
  class Example
    constructor: ->
      @show exampleTpl

      @_zn = new ZveloNET
        znhost: "http://10.211.55.130:3333"  ## TODO(jrubin) delete
        username: "zvelo.com"
        password: "7j25jx7XVAe"
        hashMashWorker: "/js/vendor/hashmash/worker.min.js"

      window.zn = @_zn ## TODO(jrubin) delete this
      domReady @onDomReady.bind(this)

    onDomReady: ->
      @setupListeners()
      @loadingModal "show"
      @_zn.ready.then @ready.bind(this)

    show: (tpl) -> domReady ->
      el = document.getElementById "zvelonet"
      el.innerHTML = tpl()

    loadingModal: (action) ->
      @_loadingModal ?= new Modal
        header: "Loading..."
        body: "Initializing zveloNET..."

      window.modal = @_loadingModal  ## TODO(jrubin) delete this

      @_loadingModal[action]()

    lookupModal: (action) ->
      @_lookupModal ?= new Modal
        header: "Authorizing..."
        body: "Verifying user credentials..."

      @_lookupModal[action]()

    setupListeners: ->
      @_form  = document.getElementById "zvelo-lookup"
      @_field = document.getElementById "zvelo-url"
      @_form.addEventListener "submit", @submit.bind(this)

    ready: ->
      @_loadingModal.hide()
      @_field.focus()

    submit: (ev) ->
      try
        ev.preventDefault()
        val = @_field.value
        return unless val?.length

        @lookupModal "show"

        @_zn.lookup(url: val, reputation: true)
          .then(@onResponse.bind this)
          .otherwise((err) -> throw err)

      catch e
        console.error e.stack

    onResponse: (data) ->
      console.log "got data", data
      @lookupModal "hide"

  return new Example
