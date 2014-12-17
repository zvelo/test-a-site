(function() {
  "use strict";
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  define(["templates", "event", "element"], function(templates, Event, $) {
    var Modal;
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
        this.el = $(templates["modal"](this.ctx));
        this.el.animate(this.el.hasClass("fade"));
        this.on("backdrop shown", this._onBackdropShown.bind(this));
        this.on("modal shown", this._onModalShown.bind(this));
        this.on("modal hidden", this._onModalHidden.bind(this));
        this.on("backdrop hidden", this._onBackdropHidden.bind(this));
      }

      Modal.prototype._configure = function() {
        return this.ctx != null ? this.ctx : this.ctx = {};
      };

      Modal.prototype._showBackdrop = function() {
        if (this.status !== "showing") {
          return;
        }
        this.backdrop = $("<div>", this.el.animate()).addClass("modal-backdrop");
        if (this.el.animate()) {
          this.backdrop.addClass("fade");
        }
        $(document.body).append(this.backdrop);
        if (this.ctx.close) {
          this.backdrop.on("click", this.hide.bind(this));
        }
        return this.backdrop.reflow().addClass("in", this.trigger.bind(this, "backdrop shown"));
      };

      Modal.prototype._hideBackdrop = function() {
        if (!(this.status === "hiding" && (this.backdrop != null))) {
          return;
        }
        return this.backdrop.removeClass("in", this.trigger.bind(this, "backdrop hidden"));
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
        this.el.find("h3").html(value);
        return this;
      };

      Modal.prototype.setBody = function(value) {
        this.el.find("p").html(value);
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
          $(document.body).on("keyup", this.onKeyUp);
        }
        $(document.body).append(this.el);
        return this._showBackdrop();
      };

      Modal.prototype._onBackdropShown = function() {
        if (this.status !== "showing") {
          return;
        }
        this.el.display("block").reflow();
        if (this.ctx.btn) {
          this.el.find(".btn.btn-primary").on("click", this.hide.bind(this));
        }
        if (this.ctx.close) {
          this.el.find(".close").on("click", this.hide.bind(this));
        }
        return this.el.addClass("in", this.trigger.bind(this, "modal shown"));
      };

      Modal.prototype._onModalShown = function() {
        return setTimeout(this._setStatus.bind(this, "shown"), 1);
      };

      Modal.prototype._onBackdropHidden = function() {
        this._removeBackdrop();
        return setTimeout(this._setStatus.bind(this, "hidden"), 1);
      };

      Modal.prototype._onModalHidden = function() {
        $(document.body).remove(this.el.display("none"));
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
        this.el.removeClass("in", this.trigger.bind(this, "modal hidden"));
        return this;
      };

      Modal.prototype._removeBackdrop = function() {
        var body;
        body = $(document.body);
        if (this.onKeyUp != null) {
          body.off("keyup", this.onKeyUp);
        }
        if (this.backdrop != null) {
          body.remove(this.backdrop);
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

//# sourceMappingURL=modal.js.map
