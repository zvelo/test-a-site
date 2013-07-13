"use strict"

define [
  "domReady"
  "sizzle"
  "zvelonet"
  "modal"
  "templates"
], (domReady, Sizzle, ZveloNET, Modal, templates) ->
  getEl = (selector) -> Sizzle("#zvelonet #{selector or ""}")[0]

  class Example
    constructor: ->
      @zn = new ZveloNET
        znhost: "http://10.211.55.130:3333"  ## TODO(jrubin) delete
        username: "zvelo.com"
        password: "7j25jx7XVAe"
        hashMashWorker: "/js/vendor/hashmash/worker.min.js"

      domReady @onDomReady.bind(this)

    onDomReady: ->
      @showLoadingModal()

      next = @zn.ready
        .then(@znReady.bind this)
        .then(@show.bind this, "lookup")

      defaultUrl = window?.location?.hash?[1..]

      if defaultUrl then last = next.then @doLookup.bind this, defaultUrl
      else               last = next.then Modal.hide

      last.otherwise @showErrorModal.bind(this)

    znReady: ->
      categories = ZveloNET.categorySort(@zn["categories.txt"])

      @categories = categories.filter (value) ->
        return false if value.name.indexOf("Custom User Type ") is 0
        return true

    show: (tpl, ctx) ->
      @ctx = ctx or {}
      getEl().innerHTML = templates[tpl] @ctx

      ## setup listeners

      lookup = getEl(".btn.lookup")
      lookup?.addEventListener "click", @show.bind(this, "lookup")

      switch tpl
        when "lookup"
          getEl("input").focus()
          getEl("form").addEventListener "submit", @submitLookup.bind(this)
        when "result"
          lookup.focus()

          getEl(".btn.report").addEventListener "click",
            @show.bind(this, "report",
              url: @ctx.url
              categories: @categories)
        when "report"
          getEl("form").addEventListener "submit", @submitReport.bind(this)
          getEl("select").focus()

    showErrorModal: ->
      for arg in arguments
        if typeof arg is "function" then cb = arg
        else err = arg

      console?.error err

      console.log "error cb", cb

      wrappedCb = ->
        @hide()
        cb() if cb?

      new Modal(
        header: "Error!"
        btn: "Dismiss"
        body: err
        onBtn: wrappedCb).show()

    showWarning: (body, cb) ->
      wrappedCb = ->
        @hide()
        cb() if cb?

      new Modal(
        header: "Warning"
        body: body
        btn: "OK"
        onBtn: wrappedCb).show()

    showLoadingModal: ->
      new Modal(
        header: "Loading..."
        body: "Initializing zveloNET...").show()

    showAuthorizingModal: ->
      new Modal(
        header: "Authorizing..."
        body: "Verifying user credentials...").show()

    doLookup: (url) ->
      @zn.lookup(
        url: url
        reputation: true
        onHashMash: @showAuthorizingModal.bind(this, "show")
        onAjax: console.log.bind console, "ajax")  ## TODO(jrubin)
      .then(@onLookupResponse.bind this)
      .otherwise(@showErrorModal.bind this, @show.bind(this, "lookup"))

    doReport: (url, categoryId) ->
      @zn.report(
        url: url
        categoryIds: [ categoryId ]
        onHashMash: @showAuthorizingModal.bind(this, "show")
        onAjax: console.log.bind console, "ajax")  ## TODO(jrubin)
      .then(@onReportResponse.bind this)
      .otherwise(@showErrorModal.bind this)

    submitLookup: (ev) ->
      ev.preventDefault()
      document.activeElement.blur()
      url = getEl("input").value
      return unless url?.length
      @doLookup url

    submitReport: (ev) ->
      ev.preventDefault()
      document.activeElement.blur()
      categoryId = parseInt getEl("select :selected")?.value, 10
      return @showWarning "Please choose a category" if isNaN categoryId

      url = getEl(".url").textContent
      console.log "submitReport", ev, url, categoryId
      @doReport url, categoryId

    onLookupResponse: (data) ->
      Modal.hide()
      ## TODO(jrubin) check for uncat, show that template
      @show "result", data

    onReportResponse: (data) ->
      Modal.hide()
      console.log "onReportResponse", data
      ## TODO(jrubin)

  return new Example
