(function() {
  "use strict";
  define(["domReady", "listener", "sethtml", "zvelonet", "modal", "templates"], function(domReady, listener, setHtml, ZveloNET, Modal, templates) {
    var TestASite, getEl;
    getEl = function(selector) {
      return document.querySelector("#zvelonet " + (selector || ""));
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
        listener.add(document, "keydown", this.onKeyDown.bind(this));
        window.onpopstate = this.onPopState.bind(this);
        this.showLoadingModal();
        return this.zn.ready.then(this.znReady.bind(this)).then(this.route.bind(this)).otherwise(this.showErrorModal.bind(this));
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
        this.categories = categories.filter(function(value) {
          if (value.name.indexOf("Custom User Type ") === 0) {
            return false;
          }
          return true;
        });
      };

      TestASite.prototype.onPopState = function(ev) {
        return this.route(ev.state);
      };

      TestASite.prototype.route = function(data) {
        var path;
        path = this.getPath();
        switch (path.page) {
          case "":
            path.page = "lookup";
            break;
          case "report":
            if (data == null) {
              path.page = "lookup";
            }
        }
        return this.show(path.page, data, path);
      };

      TestASite.prototype.show = function(tpl, data, path) {
        var lookup, _ref, _ref1, _ref2;
        if ((_ref = this.loadingModal) != null) {
          _ref.hide();
        }
        this.data = data || {};
        if (!((((_ref1 = this.data) != null ? _ref1.url : void 0) != null) || (path != null))) {
          this.data = {};
        }
        this.data.page = tpl;
        setHtml(getEl(), templates[tpl](this.data));
        lookup = getEl(".btn.lookup");
        listener.add(lookup, "click", this.show.bind(this, "lookup"));
        switch (tpl) {
          case "lookup":
            return this.showLookup();
          case "report":
            return this.showReport();
          case "result":
            if (((_ref2 = this.data) != null ? _ref2.url : void 0) != null) {
              return this.showResult(lookup);
            }
            if (path != null) {
              this.show("lookup", lookup);
              if (path.arg != null) {
                return this.doLookup(path.arg);
              }
            }
        }
      };

      TestASite.prototype.showResult = function(lookup) {
        this.setPath("result", this.data.url);
        return listener.add(getEl(".btn.report"), "click", this.show.bind(this, "report", {
          url: this.data.url,
          categories: this.categories
        }));
      };

      TestASite.prototype.showLookup = function() {
        this.setPath("lookup");
        return listener.add(getEl("form"), "submit", this.submitLookup.bind(this));
      };

      TestASite.prototype.showReport = function() {
        this.setPath("report");
        return listener.add(getEl("form"), "submit", this.submitReport.bind(this));
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
        if ((ev != null ? ev.preventDefault : void 0) != null) {
          ev.preventDefault();
        } else {
          if (ev != null) {
            ev.returnValue = false;
          }
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
        var categoryId, select, url, _ref;
        if ((ev != null ? ev.preventDefault : void 0) != null) {
          ev.preventDefault();
        } else {
          if (ev != null) {
            ev.returnValue = false;
          }
        }
        select = getEl("select");
        categoryId = parseInt(select != null ? (_ref = select.options[select != null ? select.selectedIndex : void 0]) != null ? _ref.value : void 0 : void 0, 10);
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

      TestASite.prototype.getPath = function() {
        var arg, page, parts, ret;
        parts = location.hash.slice(1).split('/');
        page = parts.shift();
        arg = parts.join('/');
        ret = {
          page: page
        };
        if (arg != null ? arg.length : void 0) {
          ret["arg"] = arg;
        }
        return ret;
      };

      TestASite.prototype.setPath = function(page, arg) {
        var curPath, path, _ref;
        curPath = this.getPath();
        if (curPath.page === page && curPath.arg === arg) {
          return;
        }
        path = "" + page;
        if (arg != null) {
          path += "/" + arg;
        }
        if (((_ref = window.history) != null ? _ref.pushState : void 0) != null) {
          return history.pushState(this.data, document.title, "" + location.pathname + "#" + path);
        } else {
          return location.hash = "#" + path;
        }
      };

      TestASite.prototype.onLookupResponse = function(data) {
        this.authModal.hide();
        return this.show("result", data);
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