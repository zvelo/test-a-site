"use strict"

define [
  "domReady"
  "listener"
  "sethtml"
  "zvelonet"
  "modal"
  "templates"
], (domReady, listener, setHtml, ZveloNET, Modal, templates) ->
  getEl = (selector) -> document.querySelector("#zvelonet #{selector or ""}")

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
      docEl = document.documentElement
      docEl.className = docEl.className.replace(/\bno-js\b/,'') + ' js'

      listener.add document, "keydown", @onKeyDown.bind(this)
      window.onpopstate = @onPopState.bind(this)

      @showLoadingModal()

      @zn.ready
        .then(@znReady.bind this)
        .then(@route.bind this)
        .otherwise(@showErrorModal.bind this)

    onKeyDown: (ev) ->
      return if Modal.current?

      input     = getEl "input"
      lookupBtn = getEl "button"

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

      return

    onPopState: (ev) -> @route ev.state

    route: (data) ->
      path = @getPath()

      switch path.page
        when ""       then path.page = "lookup"
        when "report" then path.page = "lookup" unless data?

      @show path.page, data, path

    show: (tpl, data, path) ->
      @loadingModal?.hide()
      @data = data or {}
      @data = {} unless @data?.url? or path?
      @data.page = tpl
      setHtml getEl(), templates[tpl](@data)

      ## setup listeners

      lookup = getEl(".btn.lookup")
      listener.add lookup, "click", @show.bind(this, "lookup")

      switch tpl
        when "lookup" then @showLookup()
        when "report" then @showReport()
        when "result"
          ## loading from an ajax query or history result
          return @showResult lookup if @data?.url?

          if path? ## loading from a url path
            @show "lookup", lookup
            @doLookup path.arg if path.arg?

    showResult: (lookup) ->
      @setPath "result", @data.url
      listener.add getEl(".btn.report"), "click",
        @show.bind(this, "report",
          url: @data.url
          categories: @categories)

    showLookup: ->
      @setPath "lookup"
      listener.add getEl("form"), "submit", @submitLookup.bind(this)

    showReport: ->
      @setPath "report"
      listener.add getEl("form"), "submit", @submitReport.bind(this)

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
      input = getEl "input"
      return unless input?
      input.value = url unless input.value.length
      @submitLookup()

    submitLookup: (ev) ->
      if ev?.preventDefault? then ev.preventDefault()
      else ev?.returnValue = false

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
      if ev?.preventDefault? then ev.preventDefault()
      else ev?.returnValue = false

      select = getEl "select"
      categoryId = parseInt select?.options[select?.selectedIndex]?.value, 10

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

    getPath: ->
      parts = location.hash[1..].split('/')
      page = parts.shift()
      arg = parts.join('/')

      ret = page: page
      ret["arg"] = arg if arg?.length
      return ret

    setPath: (page, arg) ->
      ## TODO(jrubin) it would be more helpful if the title were more
      ## descriptive for each "sub-page"
      curPath = @getPath()
      return if curPath.page is page and curPath.arg is arg

      path  = "#{page}"
      path += "/#{arg}" if arg?

      if window.history?.pushState?
        history.pushState @data,
                          document.title,
                          "#{location.pathname}##{path}"
      else
        location.hash = "##{path}"

    onLookupResponse: (data) ->
      @authModal.hide()
      @show "result", data

    onReportResponse: (data) ->
      new Modal(
        header: "Thank you"
        body: "We have received your request."
        btn: "Close"
        close: true
        onClose: @show.bind(this, "lookup")).show()

  return new TestASite
