(function() {
  define(["purge"], function(purge) {
    var setHtml;
    setHtml = function(node, value) {
      if (node == null) {
        return;
      }
      purge(node);
      node.innerHTML = "";
      node.innerHTML = value;
      return node.style.display = "block";
    };
    return setHtml;
  });

}).call(this);

/*
//@ sourceMappingURL=sethtml.js.map
*/