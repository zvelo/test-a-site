(function() {
  var purge;

  purge = function(node) {
    var attrs, child, index, name, _i, _j, _len, _ref, _ref1, _results;
    attrs = node.attributes;
    if (attrs) {
      for (index = _i = _ref = attrs.length - 1; _i >= 0; index = _i += -1) {
        name = attrs[index].name;
        if (typeof node[name] === "function") {
          node[name] = null;
        }
        index -= 1;
      }
    }
    _ref1 = node.childNodes;
    _results = [];
    for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
      child = _ref1[_j];
      _results.push(purge(child));
    }
    return _results;
  };

  define(function() {
    return purge;
  });

}).call(this);

/*
//@ sourceMappingURL=purge.js.map
*/