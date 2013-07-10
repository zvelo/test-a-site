define(['handlebars'], function(Handlebars) {

return Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form class=\"form-inline\" id=\"zvelo-lookup\">\n  <input type=\"text\"\n         class=\"input-block-level\"\n         id=\"zvelo-url\"\n         placeholder=\"http://zvelo.com\"\n         autocomplete=\"off\"\n         spellcheck=\"false\">\n  <button type=\"submit\" id=\"zvelo-submit\" class=\"btn btn-large btn-primary\">Lookup</button>\n</form>\n";
  })

});