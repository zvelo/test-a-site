(function() {
  var removeEvent;

  removeEvent = function(obj, type, fn) {
    if (typeof obj !== "object") {
      return;
    }
    if ("removeEventListener" in obj) {
      return obj.removeEventListener(type, fn, false);
    } else {
      return obj.detachEvent("on" + type, fn);
    }
  };

  define(function() {
    return removeEvent;
  });

}).call(this);

/*
//@ sourceMappingURL=removeevent.js.map
*/