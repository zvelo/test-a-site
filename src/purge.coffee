purge = (node) ->
  attrs = node.attributes

  if attrs
    for index in [ attrs.length - 1 .. 0 ] by -1
      name = attrs[index].name
      node[name] = null if typeof node[name] is "function"
      index -= 1

  purge child for child in node.childNodes

define -> return purge
