(function() {
  "use strict";
  define(["domReady", "zvelonet", "modal", "templates"], function(domReady, ZveloNET, Modal, templates) {
    var Example;
    Example = (function() {
      function Example() {
        this._modals = {};
        this._zn = new ZveloNET({
          znhost: "http://10.211.55.130:3333",
          username: "zvelo.com",
          password: "7j25jx7XVAe",
          hashMashWorker: "/js/vendor/hashmash/worker.min.js"
        });
        domReady(this.onDomReady.bind(this));
      }

      Example.prototype.onDomReady = function() {
        this.show("lookup");
        this.showLoading();
        return this._zn.ready.then(this.lookupReady.bind(this));
      };

      Example.prototype.show = function(tpl, ctx) {
        var el;
        el = document.getElementById("zvelonet");
        el.innerHTML = templates[tpl](ctx);
        this._tpl = {};
        switch (tpl) {
          case "lookup":
            this._tpl = {
              form: el.getElementsByTagName("form")[0],
              field: el.getElementsByTagName("input")[0]
            };
            this._tpl.form.addEventListener("submit", this.submit.bind(this));
            return this._tpl.field.focus();
          case "result":
            this._tpl = {
              btn: el.getElementsByTagName("button")[0]
            };
            this._tpl.btn.addEventListener("click", this.show.bind(this, "lookup"));
            return this._tpl.btn.focus();
        }
      };

      Example.prototype.showError = function() {
        var arg, cb, err, _i, _len;
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          arg = arguments[_i];
          if (typeof arg === "function") {
            cb = arg;
          } else {
            err = arg;
          }
        }
        return new Modal({
          header: "Error!",
          close: "Dismiss",
          body: err,
          onClose: cb
        }).show();
      };

      Example.prototype.showLoading = function() {
        return new Modal({
          header: "Loading...",
          body: "Initializing zveloNET..."
        }).show();
      };

      Example.prototype.authorizingModal = function(action) {
        var _base;
        if (action == null) {
          action = "show";
        }
        if ((_base = this._modals)["authorizing"] == null) {
          _base["authorizing"] = new Modal({
            header: "Authorizing...",
            body: "Verifying user credentials..."
          });
        }
        return this._modals["authorizing"][action]();
      };

      Example.prototype.lookupReady = function() {
        Modal.hide();
        return this._tpl.field.focus();
      };

      Example.prototype.submit = function(ev) {
        var e, val;
        try {
          ev.preventDefault();
          val = this._tpl.field.value;
          this._tpl.field.blur();
          if (!(val != null ? val.length : void 0)) {
            return;
          }
          return this._zn.lookup({
            url: val,
            reputation: true,
            onHashMash: this.authorizingModal.bind(this, "show"),
            onAjax: console.log.bind(console, "ajax")
          }).then(this.onResponse.bind(this)).otherwise(this.showError.bind(this, this.lookupReady.bind(this)));
        } catch (_error) {
          e = _error;
          console.error(e.stack);
          return this.showError(e.message, this.lookupReady.bind(this));
        }
      };

      Example.prototype.onResponse = function(data) {
        console.log("got data", data);
        Modal.hide();
        return this.show("result", data);
      };

      return Example;

    })();
    return new Example;
  });

}).call(this);

/*
//@ sourceMappingURL=example.js.map
*/