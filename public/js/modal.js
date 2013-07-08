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

  define(["domReady", "template/modal"], function(domReady, tpl) {
    var Modal;
    Modal = (function() {
      function Modal(ctx) {
        this.ctx = ctx;
        this._configure();
        this.el = Modal._createEl(tpl(this.ctx));
        addClass(this.el, "fade");
        document.body.appendChild(this.el);
        domReady(this.show.bind(this));
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

      Modal.prototype._backdrop = function(cb) {
        var that, transitionEndFn;
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
          if (cb == null) {
            return;
          }
          if (transitionEnd != null) {
            transitionEndFn = function() {
              that.backdrop.removeEventListener(transitionEnd, transitionEndFn, true);
              return cb();
            };
            return this.backdrop.addEventListener(transitionEnd, transitionEndFn, true);
          } else {
            return cb();
          }
        } else if (!this.isShown && (this.backdrop != null)) {
          removeClass(this.backdrop, "in");
          if (transitionEnd != null) {
            transitionEndFn = function() {
              that.backdrop.removeEventListener(transitionEnd, transitionEndFn, true);
              return cb();
            };
            return this.backdrop.addEventListener(transitionEnd, transitionEndFn, true);
          } else {
            return cb();
          }
        } else if (cb != null) {
          return cb();
        }
      };

      Modal.prototype.show = function() {
        var that;
        if (this.isShown) {
          return;
        }
        this.isShown = true;
        that = this;
        this._backdrop(function() {
          that.el.style.display = "block";
          that.el.offsetWidth;
          return addClass(that.el, "in");
        });
        return this;
      };

      Modal.prototype.hide = function() {
        if (!this.isShown) {
          return;
        }
        this.isShown = false;
        removeClass(this.el, "in");
        if (transitionEnd != null) {
          return this.hideWithTransition();
        } else {
          return this.hideModal();
        }
      };

      Modal.prototype.hideWithTransition = function() {
        var that, timeout, transitionEndFn;
        that = this;
        timeout = setTimeout(function() {
          return that.hideModal();
        }, 7500);
        transitionEndFn = function() {
          that.el.removeEventListener(transitionEnd, transitionEndFn, true);
          clearTimeout(timeout);
          return that.hideModal();
        };
        this.el.addEventListener(transitionEnd, transitionEndFn, true);
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

      return Modal;

    })();
    return Modal;
  });

}).call(this);

/*
//@ sourceMappingURL=modal.js.map
*/