"use strict"

define [
  "domReady"
  "sizzle"
  "zvelonet"
  "modal"
  "templates"
], (domReady, Sizzle, ZveloNET, Modal, templates) ->
  getEl = (selector) -> Sizzle("#zvelonet #{selector or ""}")[0]

  class TestASite
    constructor: ->
      @zn = new ZveloNET
        znhost: "https://query.zvelo.com:3333"  ## TODO(jrubin) delete
        ###
        these credentials are ok to be publicly visible
        they should only be used on zvelo.com though
        zvelo may revoke them at any time
        when writing your own code,
        please request your own credentials from zvelo
        ###
        username: "zvelo.com"
        password: "7j25jx7XVAe"
        hashMashWorker: "./js/vendor/hashmash/worker.min.js"

      domReady @onDomReady.bind(this)

    onDomReady: ->
      @showLoadingModal()

      next = @zn.ready
        .then(@znReady.bind this)
        .then(@show.bind this, "lookup")

      defaultUrl = window.location.hash[1..]

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
          window.location.hash = ""

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
        when "uncategorized"
          lookup.focus()

    showErrorModal: ->
      for arg in arguments
        if typeof arg is "function" then cb = arg
        else err = arg

      console?.error err

      new Modal(
        header: "Error!"
        btn: "Dismiss"
        body: err
        onClose: cb).show()

    showWarning: (body, cb) ->
      new Modal(
        header: "Warning"
        body: body
        btn: "OK"
        onClose: cb).show()

    showLoadingModal: ->
      new Modal(
        header: "Loading..."
        body: "Initializing zveloNET...").show()

    onHashMash: ->
      @authModal ?= new Modal
        class: "authorizing"
        header: "Authorizing..."

      body = """
      <img src="./img/spinner-calculating.gif"><br>
      Verifying user credentials...
      """

      @authModal
        .setBody(body)
        .show()

    onAjax: ->
      return unless @authModal?.isShown

      body = """
      <img src="./img/spinner-sending.gif"><br>
      Querying Server...
      """

      @authModal.setBody body

    doLookup: (url) ->
      @zn.lookup(
        url: url
        reputation: true
        onHashMash: @onHashMash.bind(this)
        onAjax: @onAjax.bind(this))
      .then(@onLookupResponse.bind this)
      .otherwise(@showErrorModal.bind this, @show.bind(this, "lookup"))

    doReport: (url, categoryId) ->
      @zn.report(
        url: url
        categoryIds: [ categoryId ]
        onHashMash: @onHashMash.bind(this, "show")
        onAjax: @onAjax.bind(this))
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
      @doReport url, categoryId

    onLookupResponse: (data) ->
      window.location.hash = "##{data.url}"
      Modal.hide()
      if data?.categories? and Object.keys(data.categories).length
        @show "result", data
      else
        @show "uncategorized", data

    onReportResponse: (data) ->
      new Modal(
        header: "Thank you"
        body: "We have received your request."
        btn: "Close"
        close: true
        onClose: @show.bind(this, "lookup")).show()

  return new TestASite
