(function() {
  "use strict";
  define(["domReady", "sizzle", "zvelonet", "modal", "templates"], function(domReady, Sizzle, ZveloNET, Modal, templates) {
    var Example, getEl;
    getEl = function(selector) {
      return Sizzle("#zvelonet " + (selector || ""))[0];
    };
    Example = (function() {
      function Example() {
        this.zn = new ZveloNET({
          znhost: "https://query.zvelo.com:3333",
          username: "zvelo.com",
          password: "7j25jx7XVAe",
          hashMashWorker: "./js/vendor/hashmash/worker.min.js"
        });
        domReady(this.onDomReady.bind(this));
      }

      Example.prototype.onDomReady = function() {
        var defaultUrl, last, next;
        this.showLoadingModal();
        next = this.zn.ready.then(this.znReady.bind(this)).then(this.show.bind(this, "lookup"));
        defaultUrl = window.location.hash.slice(1);
        if (defaultUrl) {
          last = next.then(this.doLookup.bind(this, defaultUrl));
        } else {
          last = next.then(Modal.hide);
        }
        return last.otherwise(this.showErrorModal.bind(this));
      };

      Example.prototype.znReady = function() {
        var categories;
        categories = ZveloNET.categorySort(this.zn["categories.txt"]);
        return this.categories = categories.filter(function(value) {
          if (value.name.indexOf("Custom User Type ") === 0) {
            return false;
          }
          return true;
        });
      };

      Example.prototype.show = function(tpl, ctx) {
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

      Example.prototype.showErrorModal = function() {
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
          console.error(err);
        }
        return new Modal({
          header: "Error!",
          btn: "Dismiss",
          body: err,
          onClose: cb
        }).show();
      };

      Example.prototype.showWarning = function(body, cb) {
        return new Modal({
          header: "Warning",
          body: body,
          btn: "OK",
          onClose: cb
        }).show();
      };

      Example.prototype.showLoadingModal = function() {
        return new Modal({
          header: "Loading...",
          body: "Initializing zveloNET..."
        }).show();
      };

      Example.prototype.onHashMash = function() {
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

      Example.prototype.onAjax = function() {
        var body, _ref;
        if (!((_ref = this.authModal) != null ? _ref.isShown : void 0)) {
          return;
        }
        body = "<img src=\"./img/spinner-sending.gif\"><br>\nQuerying Server...";
        return this.authModal.setBody(body);
      };

      Example.prototype.doLookup = function(url) {
        return this.zn.lookup({
          url: url,
          reputation: true,
          onHashMash: this.onHashMash.bind(this),
          onAjax: this.onAjax.bind(this)
        }).then(this.onLookupResponse.bind(this)).otherwise(this.showErrorModal.bind(this, this.show.bind(this, "lookup")));
      };

      Example.prototype.doReport = function(url, categoryId) {
        return this.zn.report({
          url: url,
          categoryIds: [categoryId],
          onHashMash: this.onHashMash.bind(this, "show"),
          onAjax: this.onAjax.bind(this)
        }).then(this.onReportResponse.bind(this)).otherwise(this.showErrorModal.bind(this));
      };

      Example.prototype.submitLookup = function(ev) {
        var url;
        ev.preventDefault();
        document.activeElement.blur();
        url = getEl("input").value;
        if (!(url != null ? url.length : void 0)) {
          return;
        }
        return this.doLookup(url);
      };

      Example.prototype.submitReport = function(ev) {
        var categoryId, url, _ref;
        ev.preventDefault();
        document.activeElement.blur();
        categoryId = parseInt((_ref = getEl("select :selected")) != null ? _ref.value : void 0, 10);
        if (isNaN(categoryId)) {
          return this.showWarning("Please choose a category");
        }
        url = getEl(".url").textContent;
        return this.doReport(url, categoryId);
      };

      Example.prototype.onLookupResponse = function(data) {
        window.location.hash = "#" + data.url;
        Modal.hide();
        if (((data != null ? data.categories : void 0) != null) && Object.keys(data.categories).length) {
          return this.show("result", data);
        } else {
          return this.show("uncategorized", data);
        }
      };

      Example.prototype.onReportResponse = function(data) {
        return new Modal({
          header: "Thank you",
          body: "We have received your request.",
          btn: "Close",
          close: true,
          onClose: this.show.bind(this, "lookup")
        }).show();
      };

      return Example;

    })();
    return new Example;
  });

}).call(this);

/*
//@ sourceMappingURL=example.js.map
*/