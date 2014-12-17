(function() {
  var transitionEnd;

  transitionEnd = (function() {
    var el, name, transEndEventNames;
    el = document.createElement("zveloFakeElement");
    transEndEventNames = {
      WebkitTransition: "webkitTransitionEnd",
      MozTransition: "transitionend",
      OTransition: "oTransitionEnd otransitionend",
      transition: "transitionend"
    };
    for (name in transEndEventNames) {
      if (el.style[name] != null) {
        return transEndEventNames[name];
      }
    }
  })();

  define(["when"], function(whn) {
    var $, Element;
    Element = (function() {
      function Element(el, _animate) {
        var container;
        this.el = el;
        this._animate = _animate;
        if (this._animate == null) {
          this._animate = true;
        }
        if (this.el == null) {
          return;
        }
        switch (typeof this.el) {
          case "string":
            container = document.createElement("div");
            container.innerHTML = this.el;
            this.el = container.firstChild;
            break;
          case "object":
            if (this.el instanceof Element) {
              this.el = this.el.el;
            }
        }
      }

      Element.prototype.animate = function(value) {
        if (value == null) {
          return this._animate;
        }
        this._animate = value;
        return this;
      };

      Element.prototype.html = function(value) {
        if (this.el == null) {
          return this;
        }
        if (value == null) {
          return this.el.innerHTML;
        }
        this.el.innerHTML = "";
        this.el.innerHTML = value;
        this.el.style.display = "block";
        return this;
      };

      Element.prototype.text = function() {
        var elem, ret, _ref, _ref1;
        if ((_ref = this.el.nodeType) === 3 || _ref === 4) {
          return this.el.nodeValue;
        }
        if ((_ref1 = this.el.nodeType) !== 1 && _ref1 !== 9 && _ref1 !== 11) {
          return "";
        }
        if (typeof this.el.textContent === "string") {
          return this.el.textContent;
        }
        ret = "";
        elem = $(this.el.firstChild);
        while (elem.el) {
          ret += elem.text();
          elem = $(elem.el.nextSibling);
        }
        return ret;
      };

      Element.prototype.on = function(ev, fn) {
        if (this.el == null) {
          return this;
        }
        if ("addEventListener" in this.el) {
          this.el.addEventListener(ev, fn, false);
        } else {
          this.el.attachEvent("on" + ev, fn);
        }
        return this;
      };

      Element.prototype.off = function(ev, fn) {
        if (this.el == null) {
          return this;
        }
        if ("removeEventListener" in this.el) {
          this.el.removeEventListener(ev, fn, false);
        } else {
          this.el.detachEvent("on" + ev, fn);
        }
        return this;
      };

      Element.prototype.find = function(selector) {
        if (this.el == null) {
          return this;
        }
        return $(this.el.querySelector(selector));
      };

      Element.prototype.attr = function(key, value) {
        if (this.el == null) {
          return this;
        }
        if (value == null) {
          return this.el.getAttribute(key);
        }
        this.el.setAttribute(key, value);
        return this;
      };

      Element.prototype.hasClass = function(className) {
        if (this.el == null) {
          return false;
        }
        return (" " + this.el.className + " ").indexOf(" " + className + " ") > -1;
      };

      Element.prototype.addClass = function(className, cb, scope) {
        var promise, resolver, _ref;
        if (this.el == null) {
          return this;
        }
        if (scope == null) {
          scope = this;
        }
        _ref = whn.defer(), promise = _ref.promise, resolver = _ref.resolver;
        if (cb != null) {
          promise.then(cb.bind(scope));
        }
        if (this.hasClass(className)) {
          resolver.resolve(this);
        } else {
          this.el.className += " " + className;
          this._onComplete(resolver);
        }
        return this;
      };

      Element.prototype.removeClass = function(className, cb, scope) {
        var promise, re, resolver, _ref;
        if (this.el == null) {
          return this;
        }
        if (scope == null) {
          scope = this;
        }
        _ref = whn.defer(), promise = _ref.promise, resolver = _ref.resolver;
        if (cb != null) {
          promise.then(cb.bind(scope));
        }
        if (!this.hasClass(className)) {
          resolver.resolve(this);
        } else {
          re = new RegExp("(?:^|\\s)" + className + "(?!\\S)", 'g');
          this.el.className = this.el.className.replace(re, "");
          this._onComplete(resolver);
        }
        return this;
      };

      Element.prototype._onComplete = function(resolver) {
        if (this._animate) {
          return this._onTransitionEnd(resolver);
        } else {
          return resolver.resolve(this);
        }
      };

      Element.prototype._onTransitionEnd = function(resolver) {
        var transitionEndFn;
        if (transitionEnd == null) {
          return resolver.resolve(this);
        }
        transitionEndFn = (function(ev) {
          this.off(transitionEnd, transitionEndFn);
          return resolver.resolve(this);
        }).bind(this);
        return this.on(transitionEnd, transitionEndFn);
      };

      Element.prototype.append = function(el) {
        if (!((this.el != null) && (el != null))) {
          return this;
        }
        el = $(el);
        if (el.el == null) {
          return this;
        }
        this.el.appendChild(el.el);
        return this;
      };

      Element.prototype.remove = function(el) {
        var _ref;
        el = $(el);
        if ((_ref = this.el) != null) {
          _ref.removeChild(el.el);
        }
        return this;
      };

      Element.prototype.display = function(value) {
        var _ref;
        if ((_ref = this.el) != null) {
          _ref.style.display = value;
        }
        return this;
      };

      Element.prototype.focus = function() {
        var _ref;
        if ((_ref = this.el) != null) {
          _ref.focus();
        }
        return this;
      };

      Element.prototype.blur = function() {
        var _ref;
        if ((_ref = this.el) != null) {
          _ref.blur();
        }
        return this;
      };

      Element.prototype.value = function(v) {
        if (this.el == null) {
          return this;
        }
        if (v == null) {
          return this.el.value;
        }
        this.el.value = v;
        return this;
      };

      Element.prototype.options = function(index) {
        var _ref, _ref1, _ref2;
        if (index == null) {
          return (_ref = this.el) != null ? _ref.options : void 0;
        }
        return (_ref1 = this.el) != null ? (_ref2 = _ref1.options) != null ? _ref2[index] : void 0 : void 0;
      };

      Element.prototype.selectedIndex = function() {
        var _ref;
        return (_ref = this.el) != null ? _ref.selectedIndex : void 0;
      };

      Element.prototype.reflow = function() {
        var _ref;
        if ((_ref = this.el) != null) {
          _ref.offsetWidth;
        }
        return this;
      };

      return Element;

    })();
    $ = function(el, animate) {
      return new Element(el, animate);
    };
    $.transitionEnd = transitionEnd;
    return $;
  });

}).call(this);

//# sourceMappingURL=element.js.map
