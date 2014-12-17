define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["lookup"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<form>\n  <div class=\"lookup inner-container\">\n    <span>\n      <label for=\"zvelo-url-input\">http://</label>\n    </span>\n    <span class=\"remaining\">\n      <input type=\"text\"\n             id=\"zvelo-url-input\"\n             title=\"Enter a URL to lookup its categorization\"\n             placeholder=\"zvelo.com (just start typing&hellip;)\"\n             autocomplete=\"off\"\n             spellcheck=\"false\">\n    </span>\n  </div>\n  <div class=\"controls\">\n    <button type=\"submit\" class=\"btn btn-large btn-primary\">Lookup</button>\n  </div>\n</form>\n";
  },"useData":true});



this["JST"]["modal"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return " "
    + escapeExpression(((helper = (helper = helpers['class'] || (depth0 != null ? depth0['class'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"class","hash":{},"data":data}) : helper)));
},"3":function(depth0,helpers,partials,data) {
  return "    <button type=\"button\" class=\"close\">×</button>\n";
  },"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <button class=\"btn btn-primary\">"
    + escapeExpression(((helper = (helper = helpers.btn || (depth0 != null ? depth0.btn : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btn","hash":{},"data":data}) : helper)))
    + "</button>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"modal hide fade";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0['class'] : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\n  <div class=\"modal-header\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.close : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n    <h3>"
    + escapeExpression(((helper = (helper = helpers.header || (depth0 != null ? depth0.header : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"header","hash":{},"data":data}) : helper)))
    + "</h3>\n  </div>\n  <div class=\"modal-body\">\n    <p>";
  stack1 = ((helper = (helper = helpers.body || (depth0 != null ? depth0.body : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"body","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</p>\n  </div>\n  <div class=\"modal-footer\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.btn : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\n</div>\n";
},"useData":true});



this["JST"]["report"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "        <option value=\""
    + escapeExpression(lambda((depth0 != null ? depth0.id : depth0), depth0))
    + "\">"
    + escapeExpression(lambda((depth0 != null ? depth0.name : depth0), depth0))
    + "</option>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<form>\n  <div class=\"inner-container "
    + escapeExpression(((helper = (helper = helpers.page || (depth0 != null ? depth0.page : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"page","hash":{},"data":data}) : helper)))
    + "\">\n    <p class=\"lead url\">"
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "</p>\n\n    <div class=\"categories\">\n      <select>\n        <option value=\"\">-- Suggest a Category --</option>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.categories : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      </select>\n    </div>\n  </div>\n\n  <div class=\"controls\">\n    <button type=\"submit\" class=\"btn btn-large btn-danger report\">Report Miscategorization</button>\n    <button type=\"button\" class=\"btn btn-large btn-primary lookup\">Return to Lookup</button>\n  </div>\n</form>\n";
},"useData":true});



this["JST"]["result"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "    <div class=\"categories\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.categories : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\n";
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <span class=\"category\" title=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</span>\n";
},"4":function(depth0,helpers,partials,data) {
  return "    <p class=\"uncategorized\">\n    This URL has not yet been categorized. It has been submitted for classification.\n    </p>\n";
  },"6":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "  <div class=\"span3 reputation reputation"
    + escapeExpression(((helper = (helper = helpers.reputationId || (depth0 != null ? depth0.reputationId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"reputationId","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"reputation-img-container\">\n      <div class=\"aspect\"></div>\n      <div class=\"img\"></div>\n    </div>\n    <p title=\""
    + escapeExpression(((helper = (helper = helpers.reputation || (depth0 != null ? depth0.reputation : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"reputation","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.reputation || (depth0 != null ? depth0.reputation : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"reputation","hash":{},"data":data}) : helper)))
    + "</p>\n  </div>\n";
},"8":function(depth0,helpers,partials,data) {
  return "  <button class=\"btn btn-large btn-warning report\" title=\"Report this URL as miscategorized\">Miscategorized?</button>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"inner-container row-fluid\">\n  <div class=\"span9\">\n    <p class=\"lead url\" title=\""
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "</p>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.reputationId : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </div>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.reputationId : depth0), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</div>\n\n<div class=\"controls\">\n  <button class=\"btn btn-large btn-primary lookup\" title=\"Lookup another URL\">Lookup Another URL</button>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.reputationId : depth0), {"name":"if","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"useData":true});

return this["JST"];

});