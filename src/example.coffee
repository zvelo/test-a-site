"use strict"

define [
  "domReady"
  "zvelonet"
  "modal"
  "template/example"
], (domReady, ZveloNET, Modal, example) ->
  domReady ->
    el = document.getElementById "zvelonet"
    el.innerHTML = example()

  modal = new Modal
    id: "modal-loading"
    header: "Loading..."
    body: "Initializing zveloNET..."

  window.zn = zn =new ZveloNET
    znhost: "http://10.211.55.130:3333"  ## TODO(jrubin) delete
    username: "zvelo.com"
    password: "7j25jx7XVAe"
    hashMashWorker: "/js/vendor/hashmash/worker.min.js"

  zn.ready.then ->
    domReady -> modal.hide()

    form = document.getElementById "zvelo-lookup"
    inp  = document.getElementById "zvelo-url"

    form.addEventListener "submit", (ev) ->
      try
        ev.preventDefault()
        val = inp.value
        return unless val?.length

        console.log "looking up", val

        zn.lookup(url: val, reputation: true)
          .then((data) ->
            console.log "got data", data, arguments
          )
          .otherwise((err) ->
            throw err
          )

      catch e
        console.error e.stack
