(function() {
  "use strict";
  var addClass, hasClass, removeClass, transitionEnd;

  hasClass = function(el, className) {
    return (' ' + el.className + ' ').indexOf(' ' + className + ' ') > -1;
  };

  addClass = function(el, className) {
    return el.className += " " + className;
  };

  removeClass = function(el, className) {
    var re;
    re = new RegExp("(?:^|\\s)" + className + "(?!\\S)", 'g');
    return el.className = el.className.replace(re, "");
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

  define(["templates"], function(templates) {
    var Modal;
    Modal = (function() {
      Modal.hide = function(cb) {
        if (Modal.shown == null) {
          if (cb != null) {
            cb();
          }
          return false;
        }
        Modal.shown.hide(cb);
        return true;
      };

      function Modal(ctx) {
        this.ctx = ctx;
        this._configure();
        this.el = Modal._createEl(templates["modal"](this.ctx));
        addClass(this.el, "fade");
      }

      Modal.prototype._configure = function() {
        return this.ctx != null ? this.ctx : this.ctx = {};
      };

      Modal._createEl = function(html) {
        var container;
        container = document.createElement("div");
        container.innerHTML = html;
        return container.firstChild;
      };

      Modal._transitionEnd = function(el, cb) {
        var transitionEndFn;
        if (transitionEnd == null) {
          if (cb != null) {
            cb();
          }
          return;
        }
        transitionEndFn = function() {
          el.removeEventListener(transitionEnd, transitionEndFn, true);
          return cb();
        };
        return el.addEventListener(transitionEnd, transitionEndFn, true);
      };

      Modal.prototype._backdrop = function(cb) {
        var that;
        that = this;
        if (this.isShown) {
          this.backdrop = Modal._createEl("<div class=\"modal-backdrop\"/>");
          addClass(this.backdrop, "fade");
          document.body.appendChild(this.backdrop);
          this.backdrop.addEventListener("click", function() {
            if (that.ctx.close) {
              return that.hide();
            }
          });
          this.backdrop.offsetWidth;
          addClass(this.backdrop, "in");
          return Modal._transitionEnd(this.backdrop, cb);
        } else if (!this.isShown && (this.backdrop != null)) {
          removeClass(this.backdrop, "in");
          return Modal._transitionEnd(this.backdrop, cb);
        }
      };

      Modal.prototype.show = function() {
        if (this.isShown) {
          return;
        }
        Modal.hide(this._show.bind(this));
        return this;
      };

      Modal.prototype._show = function() {
        var that;
        if (this.isShown || (Modal.shown != null)) {
          return;
        }
        Modal.shown = this;
        this.isShown = true;
        that = this;
        if (this.ctx.close) {
          this.onKeyUp = function(ev) {
            if (ev.which === 27) {
              return that.hide();
            }
          };
          document.body.addEventListener("keyup", this.onKeyUp, true);
        }
        document.body.appendChild(this.el);
        return this._backdrop(function() {
          var btn, closeBtn, xBtn;
          that.el.style.display = "block";
          that.el.offsetWidth;
          addClass(that.el, "in");
          if (that.ctx.btn) {
            btn = that.el.getElementsByClassName("btn btn-primary")[0];
            if (that.ctx.onBtn != null) {
              btn.addEventListener("click", that.ctx.onBtn.bind(that), true);
            }
          }
          if (that.ctx.close) {
            closeBtn = that.el.getElementsByClassName("btn btn-close")[0];
            closeBtn.addEventListener("click", that.hide.bind(that), true);
            xBtn = that.el.getElementsByClassName("close")[0];
            return xBtn.addEventListener("click", that.hide.bind(that), true);
          }
        });
      };

      Modal.prototype.hide = function(cb) {
        var that;
        if (!(this.isShown && Modal.shown === this)) {
          return;
        }
        delete Modal.shown;
        this.isShown = false;
        that = this;
        removeClass(this.el, "in");
        Modal._transitionEnd(this.el, function() {
          that._remove();
          if (transitionEnd != null) {
            return that._hideWithTransition(cb);
          } else {
            return that._hideModal(cb);
          }
        });
        return this;
      };

      Modal.prototype._hideWithTransition = function(cb) {
        var that, timeout;
        that = this;
        timeout = setTimeout(function() {
          return that._hideModal(cb);
        }, 500);
        Modal._transitionEnd(this.el, function() {
          clearTimeout(timeout);
          return that._hideModal(cb);
        });
        return this;
      };

      Modal.prototype._hideModal = function(cb) {
        var that;
        this.el.style.display = "none";
        that = this;
        this._backdrop(function() {
          return that._removeBackdrop(cb);
        });
        return this;
      };

      Modal.prototype._removeBackdrop = function(cb) {
        if (this.backdrop != null) {
          document.body.removeChild(this.backdrop);
        }
        delete this.backdrop;
        if (this.onKeyUp != null) {
          document.body.removeEventListener("keyup", this.onKeyUp, true);
        }
        if (this.ctx.onClose != null) {
          this.ctx.onClose(this);
        }
        if (cb != null) {
          return cb(this);
        }
      };

      Modal.prototype._remove = function() {
        document.body.removeChild(this.el);
        return removeClass(this.el, "in");
      };

      Modal.prototype.toggle = function() {
        if (this.isShown) {
          return this.hide();
        } else {
          return this.show();
        }
      };

      return Modal;

    })();
    return Modal;
  });

}).call(this);

/*
//@ sourceMappingURL=modal.js.map
*/