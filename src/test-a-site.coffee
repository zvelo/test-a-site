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
        useCache: false

      domReady @onDomReady.bind(this)

    onDomReady: ->
      document.addEventListener "keydown", @onKeyDown.bind(this)

      @showLoadingModal()

      next = @zn.ready
        .then(@znReady.bind this)
        .then(@show.bind this, "lookup")

      defaultUrl = window.location.hash[1..]

      if defaultUrl
        last = next.then @doLookup.bind this, defaultUrl
      else
        that = this
        last = next.then ->
          that.loadingModal.hide()
          delete that.loadingModal

      last.otherwise @showErrorModal.bind(this)

    onKeyDown: (ev) ->
      return if Modal.current?

      input     = getEl("input")
      lookupBtn = getEl("button")

      return unless input? and lookupBtn?
      return if document.activeElement is input

      return if ev.altGraphKey or
                ev.metaKey     or
                ev.altKey      or
                ev.shiftKey    or
                ev.ctrlKey

      return if ev.keyCode in [ ENTER = 13, SPACE = 32, TAB = 65 ]

      input.focus()

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

      console?.error err, err?.stack

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
        close: true
        onClose: cb).show()

    showLoadingModal: ->
      @loadingModal = new Modal(
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
      return unless @authModal?.status is "shown"

      body = """
      <img src="./img/spinner-sending.gif"><br>
      Querying Server...
      """

      @authModal.setBody body

    doLookup: (url) ->
      input = getEl("input")
      return unless input?
      input.value = url unless input.value.length
      @submitLookup()

    submitLookup: (ev) ->
      ev?.preventDefault()
      url = getEl("input").value

      return unless url?.length

      document.activeElement.blur()

      @zn.lookup(
        url: url
        reputation: true
        onHashMash: @onHashMash.bind(this)
        onAjax: @onAjax.bind(this))
      .then(@onLookupResponse.bind this)
      .otherwise(@showErrorModal.bind this, @show.bind(this, "lookup"))

    submitReport: (ev) ->
      ev?.preventDefault()
      categoryId = parseInt getEl("select :selected")?.value, 10

      return @showWarning "Please choose a category" if isNaN categoryId

      url = getEl(".url").textContent

      document.activeElement.blur()

      @zn.report(
        url: url
        categoryIds: [ categoryId ]
        onHashMash: @onHashMash.bind(this)
        onAjax: @onAjax.bind(this))
      .then(@onReportResponse.bind this)
      .otherwise(@showErrorModal.bind this)

    onLookupResponse: (data) ->
      window.location.hash = "##{data.url}"
      @authModal.hide()
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
