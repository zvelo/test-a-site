(function() {
  "use strict";
  define(["domReady", "sizzle", "zvelonet", "modal", "templates"], function(domReady, Sizzle, ZveloNET, Modal, templates) {
    var TestASite, getEl;
    getEl = function(selector) {
      return Sizzle("#zvelonet " + (selector || ""))[0];
    };
    TestASite = (function() {
      function TestASite() {
        this.zn = new ZveloNET({
          znhost: "https://query.zvelo.com:3333",
          /*
          these credentials are ok to be publicly visible
          they should only be used on zvelo.com though
          zvelo may revoke them at any time
          when writing your own code,
          please request your own credentials from zvelo
          */

          username: "zvelo.com",
          password: "7j25jx7XVAe",
          hashMashWorker: "./js/vendor/hashmash/worker.min.js",
          useCache: false
        });
        domReady(this.onDomReady.bind(this));
      }

      TestASite.prototype.onDomReady = function() {
        var defaultUrl, last, next, that;
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        this.showLoadingModal();
        next = this.zn.ready.then(this.znReady.bind(this)).then(this.show.bind(this, "lookup"));
        defaultUrl = window.location.hash.slice(1);
        if (defaultUrl) {
          last = next.then(this.doLookup.bind(this, defaultUrl));
        } else {
          that = this;
          last = next.then(function() {
            that.loadingModal.hide();
            return delete that.loadingModal;
          });
        }
        return last.otherwise(this.showErrorModal.bind(this));
      };

      TestASite.prototype.onKeyDown = function(ev) {
        var ENTER, SPACE, TAB, input, lookupBtn, _ref;
        if (Modal.current != null) {
          return;
        }
        input = getEl("input");
        lookupBtn = getEl("button");
        if (!((input != null) && (lookupBtn != null))) {
          return;
        }
        if (document.activeElement === input) {
          return;
        }
        if (ev.altGraphKey || ev.metaKey || ev.altKey || ev.shiftKey || ev.ctrlKey) {
          return;
        }
        if ((_ref = ev.keyCode) === (ENTER = 13) || _ref === (SPACE = 32) || _ref === (TAB = 65)) {
          return;
        }
        return input.focus();
      };

      TestASite.prototype.znReady = function() {
        var categories;
        categories = ZveloNET.categorySort(this.zn["categories.txt"]);
        return this.categories = categories.filter(function(value) {
          if (value.name.indexOf("Custom User Type ") === 0) {
            return false;
          }
          return true;
        });
      };

      TestASite.prototype.show = function(tpl, ctx) {
        var lookup;
        this.ctx = ctx || {};
        getEl().innerHTML = templates[tpl](this.ctx);
        lookup = getEl(".btn.lookup");
        if (lookup != null) {
          lookup.addEventListener("click", this.show.bind(this, "lookup"));
        }
        switch (tpl) {
          case "lookup":
            window.location.hash = "";
            getEl("input").focus();
            return getEl("form").addEventListener("submit", this.submitLookup.bind(this));
          case "result":
            lookup.focus();
            return getEl(".btn.report").addEventListener("click", this.show.bind(this, "report", {
              url: this.ctx.url,
              categories: this.categories
            }));
          case "report":
            getEl("form").addEventListener("submit", this.submitReport.bind(this));
            return getEl("select").focus();
          case "uncategorized":
            return lookup.focus();
        }
      };

      TestASite.prototype.showErrorModal = function() {
        var arg, cb, err, _i, _len;
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          arg = arguments[_i];
          if (typeof arg === "function") {
            cb = arg;
          } else {
            err = arg;
          }
        }
        if (typeof console !== "undefined" && console !== null) {
          console.error(err, err != null ? err.stack : void 0);
        }
        return new Modal({
          header: "Error!",
          btn: "Dismiss",
          body: err,
          onClose: cb
        }).show();
      };

      TestASite.prototype.showWarning = function(body, cb) {
        return new Modal({
          header: "Warning",
          body: body,
          btn: "OK",
          close: true,
          onClose: cb
        }).show();
      };

      TestASite.prototype.showLoadingModal = function() {
        return this.loadingModal = new Modal({
          header: "Loading...",
          body: "Initializing zveloNET..."
        }).show();
      };

      TestASite.prototype.onHashMash = function() {
        var body;
        if (this.authModal == null) {
          this.authModal = new Modal({
            "class": "authorizing",
            header: "Authorizing..."
          });
        }
        body = "<img src=\"./img/spinner-calculating.gif\"><br>\nVerifying user credentials...";
        return this.authModal.setBody(body).show();
      };

      TestASite.prototype.onAjax = function() {
        var body, _ref;
        if (((_ref = this.authModal) != null ? _ref.status : void 0) !== "shown") {
          return;
        }
        body = "<img src=\"./img/spinner-sending.gif\"><br>\nQuerying Server...";
        return this.authModal.setBody(body);
      };

      TestASite.prototype.doLookup = function(url) {
        var input;
        input = getEl("input");
        if (input == null) {
          return;
        }
        if (!input.value.length) {
          input.value = url;
        }
        return this.submitLookup();
      };

      TestASite.prototype.submitLookup = function(ev) {
        var url;
        if (ev != null) {
          ev.preventDefault();
        }
        url = getEl("input").value;
        if (!(url != null ? url.length : void 0)) {
          return;
        }
        document.activeElement.blur();
        return this.zn.lookup({
          url: url,
          reputation: true,
          onHashMash: this.onHashMash.bind(this),
          onAjax: this.onAjax.bind(this)
        }).then(this.onLookupResponse.bind(this)).otherwise(this.showErrorModal.bind(this, this.show.bind(this, "lookup")));
      };

      TestASite.prototype.submitReport = function(ev) {
        var categoryId, url, _ref;
        if (ev != null) {
          ev.preventDefault();
        }
        categoryId = parseInt((_ref = getEl("select :selected")) != null ? _ref.value : void 0, 10);
        if (isNaN(categoryId)) {
          return this.showWarning("Please choose a category");
        }
        url = getEl(".url").textContent;
        document.activeElement.blur();
        return this.zn.report({
          url: url,
          categoryIds: [categoryId],
          onHashMash: this.onHashMash.bind(this),
          onAjax: this.onAjax.bind(this)
        }).then(this.onReportResponse.bind(this)).otherwise(this.showErrorModal.bind(this));
      };

      TestASite.prototype.onLookupResponse = function(data) {
        window.location.hash = "#" + data.url;
        this.authModal.hide();
        if (((data != null ? data.categories : void 0) != null) && Object.keys(data.categories).length) {
          return this.show("result", data);
        } else {
          return this.show("uncategorized", data);
        }
      };

      TestASite.prototype.onReportResponse = function(data) {
        return new Modal({
          header: "Thank you",
          body: "We have received your request.",
          btn: "Close",
          close: true,
          onClose: this.show.bind(this, "lookup")
        }).show();
      };

      return TestASite;

    })();
    return new TestASite;
  });

}).call(this);

/*
//@ sourceMappingURL=test-a-site.js.map
*/