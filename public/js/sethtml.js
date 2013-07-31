(function() {
  var setHtml;

  setHtml = function(node, value) {
    if (node == null) {
      return;
    }
    node.innerHTML = "";
    node.innerHTML = value;
    return node.style.display = "block";
  };

  define(function() {
    return setHtml;
  });

}).call(this);

/*
//@ sourceMappingURL=sethtml.js.map
*/