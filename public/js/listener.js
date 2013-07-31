(function() {
  var listener;

  listener = {
    add: function(obj, type, fn) {
      if (!((obj != null) && typeof obj === "object")) {
        return;
      }
      if ("addEventListener" in obj) {
        return obj.addEventListener(type, fn, false);
      } else {
        return obj.attachEvent("on" + type, fn);
      }
    },
    remove: function(obj, type, fn) {
      if (typeof obj !== "object") {
        return;
      }
      if ("removeEventListener" in obj) {
        return obj.removeEventListener(type, fn, false);
      } else {
        return obj.detachEvent("on" + type, fn);
      }
    }
  };

  define(function() {
    return listener;
  });

}).call(this);

/*
//@ sourceMappingURL=listener.js.map
*/