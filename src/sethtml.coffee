define [ "purge" ], (purge) ->
  setHtml = (node, value) ->
    return unless node?
    purge node
    node.innerHTML = ""
    node.innerHTML = value
    node.style.display = "block"

  return setHtml
