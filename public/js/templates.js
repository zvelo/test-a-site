define(['handlebars'], function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["lookup"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<form>\n  <input type=\"text\"\n         class=\"input-block-level\"\n         placeholder=\"http://zvelo.com\"\n         autocomplete=\"off\"\n         spellcheck=\"false\">\n  <button type=\"submit\" class=\"btn btn-large btn-primary\">Lookup</button>\n</form>\n";
  });

this["JST"]["modal"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers['class']) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0['class']; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n    <button type=\"button\" class=\"close\">×</button>\n    ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <button class=\"btn btn-primary\">";
  if (stack1 = helpers.btn) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.btn; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</button>\n    ";
  return buffer;
  }

  buffer += "<div class=\"modal";
  stack1 = helpers['if'].call(depth0, depth0['class'], {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n  <div class=\"modal-header\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.close, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n\n    <h3>";
  if (stack1 = helpers.header) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.header; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n  </div>\n  <div class=\"modal-body\">\n    <p>";
  if (stack1 = helpers.body) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.body; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</p>\n  </div>\n  <div class=\"modal-footer\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.btn, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });

this["JST"]["report"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <option value=\""
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.name),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</option>\n      ";
  return buffer;
  }

  buffer += "<form>\n  <p class=\"lead url\">";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n\n  <div class=\"categories\">\n    <select>\n      <option value=\"\">-- Suggest a Category --</option>\n      ";
  stack1 = helpers.each.call(depth0, depth0.categories, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </select>\n  </div>\n\n  <div class=\"controls\">\n    <button type=\"submit\" class=\"btn btn-danger report\">Report Miscategorization</button>\n    <button type=\"button\" class=\"btn btn-primary lookup\">Return to Lookup</button>\n  </div>\n</form>\n";
  return buffer;
  });

this["JST"]["result"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n      <li><span class=\"btn btn-large btn-inverse category\" disabled>"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</span></li>\n      ";
  return buffer;
  }

  buffer += "<div class=\"left\">\n  <p class=\"lead url\">";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n\n  <div class=\"categories\">\n    <ul class=\"inline\">\n      ";
  stack1 = helpers.each.call(depth0, depth0.categories, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n  </div>\n</div>\n\n<div class=\"right reputation ";
  if (stack1 = helpers.reputationId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.reputationId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <p>";
  if (stack1 = helpers.reputation) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.reputation; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n</div>\n\n<div class=\"clearfix\"></div>\n\n<div class=\"controls\">\n  <button class=\"btn btn-primary lookup\">Lookup Another</button>\n  <button class=\"btn btn-warning report\">Report Miscategorization</button>\n</div>\n";
  return buffer;
  });

this["JST"]["uncategorized"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<p class=\"lead url\">";
  if (stack1 = helpers.url) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.url; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n\n<p class=\"uncategorized\">\nThis URL has not yet been categorized. It has been submitted for classification.\n</p>\n\n<div class=\"controls\">\n  <button class=\"btn btn-primary lookup\">Lookup Another</button>\n</div>\n";
  return buffer;
  });

return this["JST"];

});