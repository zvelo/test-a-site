(function() {
  "use strict";
  define(["listener"], function(listener) {
    var ATTR_ACTIVE, ATTR_CURRENT_VAL, ATTR_EVENTS_BOUND, ATTR_FORM_HANDLED, ATTR_INPUT_TYPE, ATTR_OPTION_FOCUS, ATTR_OPTION_LIVE, Placeholders, addPlaceholder, badKeys, changeType, classNameRegExp, disablePlaceholders, enablePlaceholders, handleElem, head, hideOnInput, hidePlaceholder, inArray, keydownVal, liveUpdates, makeBlurHandler, makeClickHandler, makeFocusHandler, makeKeydownHandler, makeKeyupHandler, makeSubmitHandler, moveCaret, nativeSupport, newElement, noop, placeholderClassName, placeholderStyleColor, root, setup, setupPlaceholder, showPlaceholder, test, validTypes;
    moveCaret = function(elem, index) {
      var range;
      if (elem.createTextRange) {
        range = elem.createTextRange();
        range.move("character", index);
        return range.select();
      } else if (elem.selectionStart) {
        elem.focus();
        return elem.setSelectionRange(index, index);
      }
    };
    changeType = function(elem, type) {
      var e;
      try {
        elem.type = type;
        return true;
      } catch (_error) {
        e = _error;
        return false;
      }
    };
    inArray = function(arr, item) {
      return arr.indexOf(item) !== -1;
    };
    validTypes = ["text", "search", "url", "tel", "email", "password", "number", "textarea"];
    badKeys = [27, 33, 34, 35, 36, 37, 38, 39, 40, 8, 46];
    placeholderStyleColor = "#ccc";
    placeholderClassName = "placeholdersjs";
    classNameRegExp = new RegExp("(?:^|\\s)" + placeholderClassName + "(?!\\S)");
    ATTR_CURRENT_VAL = "data-placeholder-value";
    ATTR_ACTIVE = "data-placeholder-active";
    ATTR_INPUT_TYPE = "data-placeholder-type";
    ATTR_FORM_HANDLED = "data-placeholder-submit";
    ATTR_EVENTS_BOUND = "data-placeholder-bound";
    ATTR_OPTION_FOCUS = "data-placeholder-focus";
    ATTR_OPTION_LIVE = "data-placeholder-live";
    test = document.createElement("input");
    head = document.getElementsByTagName("head")[0];
    root = document.documentElement;
    liveUpdates = true;
    hideOnInput = true;
    keydownVal = void 0;
    noop = function() {};
    hidePlaceholder = function(elem) {
      var type;
      if (!(elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true")) {
        return false;
      }
      elem.setAttribute(ATTR_ACTIVE, "false");
      elem.value = "";
      elem.className = elem.className.replace(classNameRegExp, "");
      type = elem.getAttribute(ATTR_INPUT_TYPE);
      if (type) {
        elem.type = type;
      }
      return true;
    };
    showPlaceholder = function(elem) {
      var type, val;
      val = elem.getAttribute(ATTR_CURRENT_VAL);
      if (!(elem.value === "" && val)) {
        return false;
      }
      elem.setAttribute(ATTR_ACTIVE, "true");
      elem.value = val;
      elem.className += " " + placeholderClassName;
      type = elem.getAttribute(ATTR_INPUT_TYPE);
      if (type) {
        elem.type = "text";
      } else if (elem.type === "password" && changeType(elem, "text")) {
        elem.setAttribute(ATTR_INPUT_TYPE, "password");
      }
      return true;
    };
    handleElem = function(node, callback) {
      var elem, handleInputs, handleTextareas, _i, _j, _len, _len1, _results;
      if (node != null ? node.getAttribute(ATTR_CURRENT_VAL) : void 0) {
        return callback(node);
      }
      if (node) {
        handleInputs = node.getElementsByTagName("input");
      } else {
        handleInputs = inputs;
      }
      if (node) {
        handleTextareas = node.getElementsByTagName("textarea");
      } else {
        handleTextareas = textareas;
      }
      for (_i = 0, _len = handleInputs.length; _i < _len; _i++) {
        elem = handleInputs[_i];
        callback(elem);
      }
      _results = [];
      for (_j = 0, _len1 = handleTextareas.length; _j < _len1; _j++) {
        elem = handleTextareas[_j];
        _results.push(callback(elem));
      }
      return _results;
    };
    disablePlaceholders = function(node) {
      return handleElem(node, hidePlaceholder);
    };
    enablePlaceholders = function(node) {
      return handleElem(node, showPlaceholder);
    };
    makeFocusHandler = function(elem) {
      return function() {
        if (hideOnInput && elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true") {
          return moveCaret(elem, 0);
        } else {
          return hidePlaceholder(elem);
        }
      };
    };
    makeBlurHandler = function(elem) {
      return function() {
        return showPlaceholder(elem);
      };
    };
    makeKeydownHandler = function(elem) {
      return function(e) {
        if (!(elem.getAttribute(ATTR_ACTIVE) === "true" && inArray(badKeys, e.keyCode))) {
          return;
        }
        keydownVal = elem.value;
        if (keydownVal === elem.getAttribute(ATTR_CURRENT_VAL)) {
          if (e.preventDefault) {
            e.preventDefault();
          }
          return false;
        }
      };
    };
    makeKeyupHandler = function(elem) {
      return function() {
        var type;
        if (elem.getAttribute(ATTR_ACTIVE) === "true" && elem.value !== keydownVal) {
          elem.className = elem.className.replace(classNameRegExp, "");
          elem.value = elem.value.replace(elem.getAttribute(ATTR_CURRENT_VAL), "");
          elem.setAttribute(ATTR_ACTIVE, false);
          type = elem.getAttribute(ATTR_INPUT_TYPE);
          if (type) {
            elem.type = type;
          }
        }
        if (elem.value === "") {
          elem.blur();
          return moveCaret(elem, 0);
        }
      };
    };
    makeClickHandler = function(elem) {
      return function() {
        if (elem === document.activeElement && elem.value === elem.getAttribute(ATTR_CURRENT_VAL) && elem.getAttribute(ATTR_ACTIVE) === "true") {
          return moveCaret(elem, 0);
        }
      };
    };
    makeSubmitHandler = function(form) {
      return function() {
        return disablePlaceholders(form);
      };
    };
    newElement = function(elem, placeholder) {
      var form;
      if (elem.form) {
        form = elem.form;
        if (!form.getAttribute(ATTR_FORM_HANDLED)) {
          listener.add(form, "submit", makeSubmitHandler(form));
          form.setAttribute(ATTR_FORM_HANDLED, "true");
        }
      }
      listener.add(elem, "focus", makeFocusHandler(elem));
      listener.add(elem, "blur", makeBlurHandler(elem));
      if (hideOnInput) {
        listener.add(elem, "keydown", makeKeydownHandler(elem));
        listener.add(elem, "keyup", makeKeyupHandler(elem));
        listener.add(elem, "click", makeClickHandler(elem));
      }
      elem.setAttribute(ATTR_EVENTS_BOUND, "true");
      elem.setAttribute(ATTR_CURRENT_VAL, placeholder);
      return showPlaceholder(elem);
    };
    setupPlaceholder = function(elem) {
      var placeholder;
      placeholder = elem.attributes.placeholder;
      if (!placeholder) {
        return;
      }
      placeholder = placeholder.nodeValue;
      if (placeholder && inArray(validTypes, elem.type)) {
        return newElement(elem, placeholder);
      }
    };
    addPlaceholder = function(elem) {
      var placeholder;
      placeholder = elem.attributes.placeholder;
      if (!placeholder) {
        return;
      }
      placeholder = placeholder.nodeValue;
      if (!(placeholder && inArray(validTypes, elem.type))) {
        return;
      }
      if (!elem.getAttribute(ATTR_EVENTS_BOUND)) {
        newElement(elem, placeholder);
      }
      if (!(placeholder !== elem.getAttribute(ATTR_CURRENT_VAL) || (elem.type === "password" && !elem.getAttribute(ATTR_INPUT_TYPE)))) {
        return;
      }
      if (elem.type === "password" && !elem.getAttribute(ATTR_INPUT_TYPE) && changeType(elem, "text")) {
        elem.setAttribute(ATTR_INPUT_TYPE, "password");
      }
      if (elem.value === elem.getAttribute(ATTR_CURRENT_VAL)) {
        elem.value = placeholder;
      }
      return elem.setAttribute(ATTR_CURRENT_VAL, placeholder);
    };
    nativeSupport = test.placeholder !== void 0;
    Placeholders = {
      nativeSupport: nativeSupport,
      disable: (nativeSupport ? noop : disablePlaceholders),
      enable: (nativeSupport ? noop : enablePlaceholders)
    };
    setup = function() {
      var elem, inputs, intervalCheck, styleElem, styleRules, textareas, timer, _i, _j, _len, _len1;
      if (nativeSupport) {
        return;
      }
      inputs = document.getElementsByTagName("input");
      textareas = document.getElementsByTagName("textarea");
      hideOnInput = root.getAttribute(ATTR_OPTION_FOCUS) === "false";
      liveUpdates = root.getAttribute(ATTR_OPTION_LIVE) !== "false";
      styleElem = document.createElement("style");
      styleElem.type = "text/css";
      styleRules = document.createTextNode(("." + placeholderClassName + " {") + ("  color: " + placeholderStyleColor + ";") + "}");
      if (styleElem.styleSheet) {
        styleElem.styleSheet.cssText = styleRules.nodeValue;
      } else {
        styleElem.appendChild(styleRules);
      }
      head.insertBefore(styleElem, head.firstChild);
      for (_i = 0, _len = inputs.length; _i < _len; _i++) {
        elem = inputs[_i];
        setupPlaceholder(elem);
      }
      for (_j = 0, _len1 = textareas.length; _j < _len1; _j++) {
        elem = textareas[_j];
        setupPlaceholder(elem);
      }
      intervalCheck = function() {
        var _k, _l, _len2, _len3;
        for (_k = 0, _len2 = inputs.length; _k < _len2; _k++) {
          elem = inputs[_k];
          addPlaceholder(elem);
        }
        for (_l = 0, _len3 = textareas.length; _l < _len3; _l++) {
          elem = textareas[_l];
          addPlaceholder(elem);
        }
        if (!liveUpdates) {
          return clearInterval(timer);
        }
      };
      return timer = setInterval(intervalCheck, 100);
    };
    setup();
    return Placeholders;
  });

}).call(this);

/*
//@ sourceMappingURL=placeholders.js.map
*/