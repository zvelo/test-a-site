(function() {
  "use strict";
  define(["domReady", "zvelonet", "modal", "template/example"], function(domReady, ZveloNET, Modal, example) {
    var modal, zn;
    domReady(function() {
      var el;
      el = document.getElementById("zvelonet");
      return el.innerHTML = example();
    });
    modal = new Modal({
      id: "modal-loading",
      header: "Loading...",
      body: "Initializing zveloNET..."
    });
    window.zn = zn = new ZveloNET({
      znhost: "http://10.211.55.130:3333",
      username: "zvelo.com",
      password: "7j25jx7XVAe",
      hashMashWorker: "/js/vendor/hashmash/worker.min.js"
    });
    return zn.ready.then(function() {
      var form, inp;
      domReady(function() {
        return modal.hide();
      });
      form = document.getElementById("zvelo-lookup");
      inp = document.getElementById("zvelo-url");
      return form.addEventListener("submit", function(ev) {
        var e, val;
        try {
          ev.preventDefault();
          val = inp.value;
          if (!(val != null ? val.length : void 0)) {
            return;
          }
          console.log("looking up", val);
          return zn.lookup({
            url: val,
            reputation: true
          }).then(function(data) {
            return console.log("got data", data, arguments);
          }).otherwise(function(err) {
            throw err;
          });
        } catch (_error) {
          e = _error;
          return console.error(e.stack);
        }
      });
    });
  });

}).call(this);

/*
//@ sourceMappingURL=example.js.map
*/