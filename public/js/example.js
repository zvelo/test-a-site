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
          znhost: "http://10.211.55.130:3333",
          username: "zvelo.com",
          password: "7j25jx7XVAe",
          hashMashWorker: "/js/vendor/hashmash/worker.min.js"
        });
        domReady(this.onDomReady.bind(this));
      }

      Example.prototype.onDomReady = function() {
        var defaultUrl, last, next, _ref, _ref1;
        this.showLoadingModal();
        next = this.zn.ready.then(this.znReady.bind(this)).then(this.show.bind(this, "lookup"));
        defaultUrl = typeof window !== "undefined" && window !== null ? (_ref = window.location) != null ? (_ref1 = _ref.hash) != null ? _ref1.slice(1) : void 0 : void 0 : void 0;
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
        }
      };

      Example.prototype.showErrorModal = function() {
        var arg, cb, err, wrappedCb, _i, _len;
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
        console.log("error cb", cb);
        wrappedCb = function() {
          this.hide();
          if (cb != null) {
            return cb();
          }
        };
        return new Modal({
          header: "Error!",
          btn: "Dismiss",
          body: err,
          onBtn: wrappedCb
        }).show();
      };

      Example.prototype.showWarning = function(body, cb) {
        var wrappedCb;
        wrappedCb = function() {
          this.hide();
          if (cb != null) {
            return cb();
          }
        };
        return new Modal({
          header: "Warning",
          body: body,
          btn: "OK",
          onBtn: wrappedCb
        }).show();
      };

      Example.prototype.showLoadingModal = function() {
        return new Modal({
          header: "Loading...",
          body: "Initializing zveloNET..."
        }).show();
      };

      Example.prototype.showAuthorizingModal = function() {
        return new Modal({
          header: "Authorizing...",
          body: "Verifying user credentials..."
        }).show();
      };

      Example.prototype.doLookup = function(url) {
        return this.zn.lookup({
          url: url,
          reputation: true,
          onHashMash: this.showAuthorizingModal.bind(this, "show"),
          onAjax: console.log.bind(console, "ajax")
        }).then(this.onLookupResponse.bind(this)).otherwise(this.showErrorModal.bind(this, this.show.bind(this, "lookup")));
      };

      Example.prototype.doReport = function(url, categoryId) {
        return this.zn.report({
          url: url,
          categoryIds: [categoryId],
          onHashMash: this.showAuthorizingModal.bind(this, "show"),
          onAjax: console.log.bind(console, "ajax")
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
        console.log("submitReport", ev, url, categoryId);
        return this.doReport(url, categoryId);
      };

      Example.prototype.onLookupResponse = function(data) {
        Modal.hide();
        return this.show("result", data);
      };

      Example.prototype.onReportResponse = function(data) {
        Modal.hide();
        return console.log("onReportResponse", data);
      };

      return Example;

    })();
    return new Example;
  });

}).call(this);

/*
//@ sourceMappingURL=example.js.map
*/