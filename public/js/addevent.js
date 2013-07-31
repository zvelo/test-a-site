(function() {
  var addEvent;

  addEvent = function(obj, type, fn) {
    if (typeof obj !== "object") {
      return;
    }
    if ("addEventListener" in obj) {
      return obj.addEventListener(type, fn, false);
    } else {
      return obj.attachEvent("on" + type, fn);
    }
  };

  define(function() {
    return addEvent;
  });

}).call(this);

/*
//@ sourceMappingURL=addevent.js.map
*/