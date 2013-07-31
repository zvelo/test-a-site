setHtml = (node, value) ->
  return unless node?
  node.innerHTML = ""
  node.innerHTML = value
  node.style.display = "block"

define -> return setHtml
