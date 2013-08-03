"use strict"

define ["element"], ($) ->
  ## Move the caret to the index position specified.
  ## Assumes that the element has focus
  moveCaret = (elem, index) ->
    if elem.createTextRange
      range = elem.createTextRange()
      range.move "character", index
      range.select()
    else if elem.selectionStart
      elem.focus()
      elem.setSelectionRange index, index

  ## Attempt to change the type property of an input element
  changeType = (elem, type) ->
    try
      elem.type = type
      return true
    catch e then return false  ## You can't change input type in IE8 and below

  inArray = (arr, item) -> arr.indexOf(item) isnt -1

  validTypes = [
    "text"
    "search"
    "url"
    "tel"
    "email"
    "password"
    "number"
    "textarea"
  ]

  ## The list of keycodes that are not allowed when the polyfill is configured
  ## to hide-on-input
  badKeys = [
    ## The following keys all cause the caret to
    ## jump to the end of the input value
    27  ## Escape
    33  ## Page up
    34  ## Page down
    35  ## End
    36  ## Home

    ## Arrow keys allow you to move the caret manually,
    ## which should be prevented when the placeholder is visible
    37  ## Left
    38  ## Up
    39  ## Right
    40  ## Down

    ## The following keys allow you to modify the placeholder text by removing
    ## characters, which should be prevented when the placeholder is visible
    8   ## Backspace
    46  ## Delete
  ]

  ## Styling variables
  placeholderStyleColor = "#ccc"
  placeholderClassName = "placeholdersjs"
  classNameRegExp = new RegExp "(?:^|\\s)#{placeholderClassName}(?!\\S)"

  ## The various data-* attributes used by the polyfill
  ATTR_CURRENT_VAL  = "data-placeholder-value"
  ATTR_ACTIVE       = "data-placeholder-active"
  ATTR_INPUT_TYPE   = "data-placeholder-type"
  ATTR_FORM_HANDLED = "data-placeholder-submit"
  ATTR_EVENTS_BOUND = "data-placeholder-bound"
  ATTR_OPTION_FOCUS = "data-placeholder-focus"
  ATTR_OPTION_LIVE  = "data-placeholder-live"

  ## Various other variables used throughout the rest of the script
  test = document.createElement "input"
  head = document.getElementsByTagName("head")[0]
  root = document.documentElement

  liveUpdates = true
  hideOnInput = true
  keydownVal  = undefined

  ## No-op (used in place of public methods when native support is detected)
  noop = ->

  ## Hide the placeholder value on a single element.
  ## Returns true if the placeholder was hidden and false if it was not
  ## (because it wasn't visible in the first place)
  hidePlaceholder = (elem) ->
    return false unless elem.value is elem.getAttribute(ATTR_CURRENT_VAL) and
                        elem.getAttribute(ATTR_ACTIVE) is "true"

    elem.setAttribute ATTR_ACTIVE, "false"
    elem.value = ""
    elem.className = elem.className.replace(classNameRegExp, "")

    ## If the polyfill has changed the type of the element
    ## we need to change it back
    type = elem.getAttribute ATTR_INPUT_TYPE
    elem.type = type if type

    return true

  ## Show the placeholder value on a single element.
  ## Returns true if the placeholder was shown and
  ## false if it was not (because it was already visible)
  showPlaceholder = (elem) ->
    val = elem.getAttribute ATTR_CURRENT_VAL

    return false unless elem.value is "" and val

    elem.setAttribute ATTR_ACTIVE, "true"
    elem.value = val
    elem.className += " #{placeholderClassName}"

    ## If the type of element needs to change, change it (e.g. password inputs)
    type = elem.getAttribute ATTR_INPUT_TYPE
    if type
      elem.type = "text"
    else if elem.type is "password" and changeType(elem, "text")
      elem.setAttribute ATTR_INPUT_TYPE, "password"

    return true

  handleElem = (node, callback) ->
    ## Check if the passed in node is an input/textarea
    ## (in which case it can't have any affected descendants)
    return callback node if node?.getAttribute ATTR_CURRENT_VAL

    ## If an element was passed in, get all affected descendants.
    ## Otherwise, get all affected elements in document
    if node then handleInputs = node.getElementsByTagName "input"
    else         handleInputs = inputs

    if node then handleTextareas = node.getElementsByTagName "textarea"
    else         handleTextareas = textareas

    ## Run the callback for each element
    callback elem for elem in handleInputs
    callback elem for elem in handleTextareas

  ## Return all affected elements to their normal state
  ## (remove placeholder value if present)
  disablePlaceholders = (node) -> handleElem node, hidePlaceholder

  ## Show the placeholder value on all appropriate elements
  enablePlaceholders = (node) -> handleElem node, showPlaceholder

  ## Returns a function that is used as a focus event handler
  makeFocusHandler = (elem) ->
    return ->
      ## Only hide the placeholder value if the (default)
      ## hide-on-focus behaviour is enabled
      if hideOnInput and
         elem.value is elem.getAttribute(ATTR_CURRENT_VAL) and
         elem.getAttribute(ATTR_ACTIVE) is "true"

        ## Move the caret to the start of the input
        ## (this mimics the behaviour of all browsers
        ##  that do not hide the placeholder on focus)
        moveCaret elem, 0

      ## Remove the placeholder
      else hidePlaceholder elem

  ## Returns a function that is used as a blur event handler
  makeBlurHandler = (elem) -> return -> showPlaceholder elem

  ## Functions that are used as event handlers when the hide-on-input behaviour
  ## has been activated - very basic implementation of the "input" event
  makeKeydownHandler = (elem) ->
    return (e) ->
      ## Prevent the use of the arrow keys
      ## (try to keep the cursor before the placeholder)
      return unless elem.getAttribute(ATTR_ACTIVE) is "true" and
                    inArray(badKeys, e.keyCode)

      keydownVal = elem.value

      if keydownVal is elem.getAttribute(ATTR_CURRENT_VAL)
        e.preventDefault() if e.preventDefault
        return false

  makeKeyupHandler = (elem) ->
    return ->
      if elem.getAttribute(ATTR_ACTIVE) is "true" and elem.value isnt keydownVal

        ## Remove the placeholder
        elem.className = elem.className.replace(classNameRegExp, "")
        elem.value = elem.value.replace(elem.getAttribute(ATTR_CURRENT_VAL), "")
        elem.setAttribute ATTR_ACTIVE, false

        ## If the type of element needs to change, change it
        ## (e.g. password inputs)
        type = elem.getAttribute(ATTR_INPUT_TYPE)
        elem.type = type if type

      ## If the element is now empty we need to show the placeholder
      if elem.value is ""
        elem.blur()
        moveCaret elem, 0

  makeClickHandler = (elem) ->
    return ->
      if elem is document.activeElement and
         elem.value is elem.getAttribute(ATTR_CURRENT_VAL) and
         elem.getAttribute(ATTR_ACTIVE) is "true"

        moveCaret elem, 0

  ## Returns a function that is used as a submit event handler on form elements
  ## that have children affected by this polyfill
  ## Turn off placeholders on all appropriate descendant elements
  makeSubmitHandler = (form) -> return -> disablePlaceholders form

  ## Bind event handlers to an element that we need to affect with the polyfill
  newElement = (elem, placeholder) ->
    elem = $(elem)

    ## If the element is part of a form,
    ## make sure the placeholder string is not submitted as a value
    if elem.el.form
      form = $(elem.el.form)

      ## Set a flag on the form so we know it's been handled
      ## (forms can contain multiple inputs)
      unless form.attr ATTR_FORM_HANDLED
        form
          .on("submit", makeSubmitHandler form.el)
          .attr(ATTR_FORM_HANDLED, "true")

    ## Bind event handlers to the element
    ## so we can hide/show the placeholder as appropriate
    elem
      .on("focus", makeFocusHandler elem.el)
      .on("blur",  makeBlurHandler  elem.el)

    ## If the placeholder should hide on input rather than on focus
    ## we need additional event handlers
    if hideOnInput
      elem
        .on("keydown", makeKeydownHandler elem.el)
        .on("keyup",   makeKeyupHandler   elem.el)
        .on("click",   makeClickHandler   elem.el)

    ## Remember that we've bound event handlers to this element
    elem.attr ATTR_EVENTS_BOUND, "true"
    elem.attr ATTR_CURRENT_VAL, placeholder

    ## If the element doesn't have a value, set it to the placeholder string
    showPlaceholder elem.el

  setupPlaceholder = (elem) ->
    ## Get the value of the placeholder attribute, if any.
    ## IE10 emulating IE7 fails with getAttribute,
    ## hence the use of the attributes node
    placeholder = elem.attributes.placeholder

    return unless placeholder

    ## IE returns an empty object instead of undefined
    ## if the attribute is not present
    placeholder = placeholder.nodeValue

    ## Only apply the polyfill if this element is of a type that supports
    ## placeholders, and has a placeholder attribute with a non-empty value
    if placeholder and inArray(validTypes, elem.type)
      newElement elem, placeholder

  addPlaceholder = (elem) ->
    ## Only apply the polyfill if this element is of a type that supports
    ## placeholders, and has a placeholder attribute with a non-empty value
    placeholder = elem.attributes.placeholder
    return unless placeholder

    placeholder = placeholder.nodeValue
    return unless placeholder and inArray(validTypes, elem.type)

    ## If the element hasn't had event handlers bound to it then add them
    newElement elem, placeholder unless elem.getAttribute(ATTR_EVENTS_BOUND)

    ## If the placeholder value has changed or not been initialised
    ## yet we need to update the display
    return unless placeholder isnt elem.getAttribute(ATTR_CURRENT_VAL) or
      (elem.type is "password" and not elem.getAttribute(ATTR_INPUT_TYPE))

    ## Attempt to change the type of password inputs (fails in IE < 9)
    if elem.type is "password" and
       not elem.getAttribute(ATTR_INPUT_TYPE) and
       changeType(elem, "text")

      elem.setAttribute ATTR_INPUT_TYPE, "password"

    ## If the placeholder value has changed and the placeholder
    ## is currently on display we need to change it
    elem.value = placeholder if elem.value is elem.getAttribute(ATTR_CURRENT_VAL)

    ## Keep a reference to the current placeholder value
    ## in case it changes via another script
    elem.setAttribute ATTR_CURRENT_VAL, placeholder

  nativeSupport = test.placeholder isnt undefined

  Placeholders =
    nativeSupport: nativeSupport
    ## Expose public methods
    disable: (if nativeSupport then noop else disablePlaceholders)
    enable:  (if nativeSupport then noop else enablePlaceholders)

  setup = ->
    return if nativeSupport

    ## Get references to all the input and textarea elements
    ## currently in the DOM
    ## (live NodeList objects to we only need to do this once)
    inputs    = document.getElementsByTagName "input"
    textareas = document.getElementsByTagName "textarea"

    ## Get any settings declared as data-* attributes on the root element
    ## (currently the only options are whether to hide the placeholder on focus
    ##  or input and whether to auto-update)
    hideOnInput = root.getAttribute(ATTR_OPTION_FOCUS) is   "false"
    liveUpdates = root.getAttribute(ATTR_OPTION_LIVE)  isnt "false"

    ## Create style element for placeholder styles
    ## (instead of directly setting style properties on elements
    ##  - allows for better flexibility alongside user-defined styles)
    styleElem = document.createElement "style"
    styleElem.type = "text/css"

    ## Create style rules as text node
    styleRules = document.createTextNode ".#{placeholderClassName} {"         +
                                         "  color: #{placeholderStyleColor};" +
                                         "}"

    ## Append style rules to newly created stylesheet
    if styleElem.styleSheet
      styleElem.styleSheet.cssText = styleRules.nodeValue
    else
      styleElem.appendChild styleRules

    ## Prepend new style element to the head
    ## (before any existing stylesheets, so user-defined rules take precedence)
    head.insertBefore styleElem, head.firstChild

    ## Set up the placeholders
    setupPlaceholder elem for elem in inputs
    setupPlaceholder elem for elem in textareas

    ## If enabled, the polyfill will repeatedly check for
    ## changed/added elements and apply to those as well
    intervalCheck = ->
      addPlaceholder elem for elem in inputs
      addPlaceholder elem for elem in textareas

      ## If live updates are not enabled cancel the timer
      clearInterval timer unless liveUpdates

    timer = setInterval intervalCheck, 100

  setup()

  return Placeholders
