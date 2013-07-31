(function() {
  "use strict";
  var createEl, hasClass, transitionEnd,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  hasClass = function(el, className) {
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
  };

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

  createEl = function(html) {
    var container;
    container = document.createElement("div");
    container.innerHTML = html;
    return container.firstChild;
  };

  define(["addevent", "removeevent", "event", "templates"], function(addEvent, removeEvent, Event, templates) {
    var Modal, addClass, onTransitionEnd, removeClass;
    onTransitionEnd = function(el, cb) {
      var transitionEndFn;
      if (transitionEnd == null) {
        if (cb != null) {
          cb();
        }
        return;
      }
      transitionEndFn = function(ev) {
        removeEvent(el, transitionEnd, transitionEndFn);
        if (cb != null) {
          return cb();
        }
      };
      return addEvent(el, transitionEnd, transitionEndFn);
    };
    addClass = function(el, className, cb) {
      if (!hasClass(el, className)) {
        el.className += " " + className;
        if (cb != null) {
          return onTransitionEnd(el, cb);
        }
      } else {
        if (cb != null) {
          return cb();
        }
      }
    };
    removeClass = function(el, className, cb) {
      var re;
      if (hasClass(el, className)) {
        re = new RegExp("(?:^|\\s)" + className + "(?!\\S)", 'g');
        el.className = el.className.replace(re, "");
        if (cb != null) {
          return onTransitionEnd(el, cb);
        }
      } else {
        if (cb != null) {
          return cb();
        }
      }
    };
    Modal = (function(_super) {
      __extends(Modal, _super);

      Modal.hideCurrent = function(cb) {
        if (!((Modal.current != null) || Modal.status === "hidden")) {
          if (cb != null) {
            cb();
          }
          return false;
        }
        if (cb != null) {
          Modal.current.on("hidden", cb, Event.ONCE);
        }
        Modal.current.hide();
        return true;
      };

      function Modal(ctx) {
        this.ctx = ctx;
        this._configure();
        this.el = createEl(templates["modal"](this.ctx));
        this.animate = hasClass(this.el, "fade");
        this.on("backdrop shown", this._onBackdropShown.bind(this));
        this.on("modal shown", this._onModalShown.bind(this));
        this.on("modal hidden", this._onModalHidden.bind(this));
        this.on("backdrop hidden", this._onBackdropHidden.bind(this));
      }

      Modal.prototype._configure = function() {
        return this.ctx != null ? this.ctx : this.ctx = {};
      };

      Modal.prototype._addClass = function(el, className, cb) {
        if (!this.animate) {
          addClass(el, className);
          if (cb != null) {
            cb();
          }
          return;
        }
        return addClass(el, className, cb);
      };

      Modal.prototype._removeClass = function(el, className, cb) {
        if (!this.animate) {
          removeClass(el, className);
          if (cb != null) {
            cb();
          }
          return;
        }
        return removeClass(el, className, cb);
      };

      Modal.prototype._showBackdrop = function() {
        if (this.status !== "showing") {
          return;
        }
        this.backdrop = createEl("<div class=\"modal-backdrop" + (this.animate ? " fade" : "") + "\"></div>");
        document.body.appendChild(this.backdrop);
        if (this.ctx.close) {
          addEvent(this.backdrop, "click", this.hide.bind(this));
        }
        this.backdrop.offsetWidth;
        return this._addClass(this.backdrop, "in", this.trigger.bind(this, "backdrop shown"));
      };

      Modal.prototype._hideBackdrop = function() {
        if (!(this.status === "hiding" && (this.backdrop != null))) {
          return;
        }
        return this._removeClass(this.backdrop, "in", this.trigger.bind(this, "backdrop hidden"));
      };

      Modal.prototype._setStatus = function(value) {
        if (this.status === "hiding" && (value === "showing" || value === "shown")) {
          return false;
        }
        this.status = value;
        this.trigger(value);
        return true;
      };

      Modal.prototype.setHeader = function(value) {
        this.el.getElementsByTagName('h3')[0].innerHTML = value;
        return this;
      };

      Modal.prototype.setBody = function(value) {
        this.el.getElementsByTagName('p')[0].innerHTML = value;
        return this;
      };

      Modal.prototype.show = function() {
        var _ref;
        if ((_ref = this.status) === "shown" || _ref === "showing") {
          return this;
        }
        if (!this._setStatus("showing")) {
          return this;
        }
        Modal.hideCurrent(this._show.bind(this));
        return this;
      };

      Modal.prototype._show = function() {
        var that;
        if (Modal.current != null) {
          return;
        }
        Modal.current = this;
        that = this;
        if (this.ctx.close) {
          this.onKeyUp = function(ev) {
            if (ev.which === 27) {
              return that.hide();
            }
          };
          addEvent(document.body, "keyup", this.onKeyUp);
        }
        document.body.appendChild(this.el);
        return this._showBackdrop();
      };

      Modal.prototype._onBackdropShown = function() {
        var btn, xBtn;
        if (this.status !== "showing") {
          return;
        }
        this.el.style.display = "block";
        this.el.offsetWidth;
        if (this.ctx.btn) {
          btn = this.el.getElementsByClassName("btn btn-primary")[0];
          addEvent(btn, "click", this.hide.bind(this));
        }
        if (this.ctx.close) {
          xBtn = this.el.getElementsByClassName("close")[0];
          addEvent(xBtn, "click", this.hide.bind(this));
        }
        return this._addClass(this.el, "in", this.trigger.bind(this, "modal shown"));
      };

      Modal.prototype._onModalShown = function() {
        return setTimeout(this._setStatus.bind(this, "shown"), 1);
      };

      Modal.prototype._onBackdropHidden = function() {
        this._removeBackdrop();
        return setTimeout(this._setStatus.bind(this, "hidden"), 1);
      };

      Modal.prototype._onModalHidden = function() {
        document.body.removeChild(this.el);
        this.el.style.display = "none";
        return this._hideBackdrop();
      };

      Modal.prototype.hide = function() {
        if (this.status === "showing") {
          return this.on("shown", this.hide.bind(this), Event.ONCE);
        }
        if (this.status !== "shown") {
          return;
        }
        this._setStatus("hiding");
        this._removeClass(this.el, "in", this.trigger.bind(this, "modal hidden"));
        return this;
      };

      Modal.prototype._removeBackdrop = function() {
        if (this.onKeyUp != null) {
          removeEvent(document.body, "keyup", this.onKeyUp, true);
        }
        if (this.backdrop != null) {
          document.body.removeChild(this.backdrop);
        }
        if (Modal.current === this) {
          delete Modal.current;
        }
        delete this.backdrop;
        if (this.ctx.onClose != null) {
          return this.ctx.onClose(this);
        }
      };

      Modal.prototype.toggle = function() {
        var _ref;
        if ((_ref = this.status) === "shown" || _ref === "showing") {
          return this.hide();
        } else {
          return this.show();
        }
      };

      return Modal;

    })(Event);
    return Modal;
  });

}).call(this);

/*
//@ sourceMappingURL=modal.js.map
*/