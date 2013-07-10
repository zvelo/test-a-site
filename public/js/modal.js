(function() {
  "use strict";
  var addClass, removeClass, transitionEnd;

  addClass = function(el, className) {
    return el.className += " " + className;
  };

  removeClass = function(el, className) {
    var re;
    re = new RegExp("(?:^|\\s)" + className + "(?!\\S)", 'g');
    return el.className = el.className.replace(re, '');
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

  define(["template/modal"], function(tpl) {
    var Modal;
    Modal = (function() {
      function Modal(ctx) {
        this.ctx = ctx;
        this._configure();
        this.el = Modal._createEl(tpl(this.ctx));
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
        var that;
        if (this.isShown) {
          return;
        }
        this.isShown = true;
        that = this;
        document.body.appendChild(this.el);
        this._backdrop(function() {
          that.el.style.display = "block";
          that.el.offsetWidth;
          return addClass(that.el, "in");
        });
        return this;
      };

      Modal.prototype.hide = function() {
        var that;
        if (!this.isShown) {
          return;
        }
        this.isShown = false;
        that = this;
        removeClass(this.el, "in");
        return Modal._transitionEnd(this.el, function() {
          that.remove();
          if (transitionEnd != null) {
            return that.hideWithTransition();
          } else {
            return that.hideModal();
          }
        });
      };

      Modal.prototype.hideWithTransition = function() {
        var that, timeout;
        that = this;
        timeout = setTimeout(function() {
          return that.hideModal();
        }, 500);
        Modal._transitionEnd(this.el, function() {
          clearTimeout(timeout);
          return that.hideModal();
        });
        return this;
      };

      Modal.prototype.hideModal = function() {
        var that;
        this.el.style.display = "none";
        that = this;
        this._backdrop(function() {
          return that.removeBackdrop();
        });
        return this;
      };

      Modal.prototype.removeBackdrop = function() {
        if (this.backdrop != null) {
          document.body.removeChild(this.backdrop);
        }
        return delete this.backdrop;
      };

      Modal.prototype.remove = function() {
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