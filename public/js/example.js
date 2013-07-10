(function() {
  "use strict";
  define(["domReady", "zvelonet", "modal", "template/example"], function(domReady, ZveloNET, Modal, exampleTpl) {
    var Example;
    Example = (function() {
      function Example() {
        this.show(exampleTpl);
        this._zn = new ZveloNET({
          znhost: "http://10.211.55.130:3333",
          username: "zvelo.com",
          password: "7j25jx7XVAe",
          hashMashWorker: "/js/vendor/hashmash/worker.min.js"
        });
        window.zn = this._zn;
        domReady(this.onDomReady.bind(this));
      }

      Example.prototype.onDomReady = function() {
        this.setupListeners();
        this.loadingModal("show");
        return this._zn.ready.then(this.ready.bind(this));
      };

      Example.prototype.show = function(tpl) {
        return domReady(function() {
          var el;
          el = document.getElementById("zvelonet");
          return el.innerHTML = tpl();
        });
      };

      Example.prototype.loadingModal = function(action) {
        if (this._loadingModal == null) {
          this._loadingModal = new Modal({
            header: "Loading...",
            body: "Initializing zveloNET..."
          });
        }
        window.modal = this._loadingModal;
        return this._loadingModal[action]();
      };

      Example.prototype.lookupModal = function(action) {
        if (this._lookupModal == null) {
          this._lookupModal = new Modal({
            header: "Authorizing...",
            body: "Verifying user credentials..."
          });
        }
        return this._lookupModal[action]();
      };

      Example.prototype.setupListeners = function() {
        this._form = document.getElementById("zvelo-lookup");
        this._field = document.getElementById("zvelo-url");
        return this._form.addEventListener("submit", this.submit.bind(this));
      };

      Example.prototype.ready = function() {
        this._loadingModal.hide();
        return this._field.focus();
      };

      Example.prototype.submit = function(ev) {
        var e, val;
        try {
          ev.preventDefault();
          val = this._field.value;
          if (!(val != null ? val.length : void 0)) {
            return;
          }
          this.lookupModal("show");
          return this._zn.lookup({
            url: val,
            reputation: true
          }).then(this.onResponse.bind(this)).otherwise(function(err) {
            throw err;
          });
        } catch (_error) {
          e = _error;
          return console.error(e.stack);
        }
      };

      Example.prototype.onResponse = function(data) {
        console.log("got data", data);
        return this.lookupModal("hide");
      };

      return Example;

    })();
    return new Example;
  });

}).call(this);

/*
//@ sourceMappingURL=example.js.map
*/