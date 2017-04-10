
/*
Inherity
@class CleanComment
@author jhon Castro
 */

/*
 * Module dependencies.
 */

let cleanComment;

cleanComment.prototype.format = function(){
  var self,
      regex = /"(".*?")|('.*?')/g,
      i = 0;
  
  this.replaced = [];
  this.cad      = "&&&&";
  self = this;

  self.replaceFormat = function(replacement){    
    this.replaced.push(replacement);
    return this.cad + i++;
  }
  this.content = this.content.replace(regex, self.replaceFormat);
}

cleanComment.prototype.multilines = function(){
  this.content = this.content.replace(this.comment.multilines, '');
}

cleanComment.prototype.tabulations = function(){
  var regex = /\n{2,}/g,
      content = this.content;

  if (!this.comment.isTab) {
    content = content.replace(this.comment.lines, '');
  }  
  this.content = content.replace(regex, '');
}

cleanComment.prototype.unformat = function(){
  var content = this.content;
  for (var i = 0; i < this.replaced.length; i++) {
    this.content = content.replace(new RegExp(this.cad + i, "g"), this.replaced[i])
  }
}

cleanComment.prototype.transform = function(){
  this.format();
  this.multilines();
  this.tabulations();
  this.unformat();
}

cleanComment = function(opts) {  
  this.comment  = opts.comment;
  this.content  = opts.content;
  
  this.transform();
  return this.content;
}

module.exports =  cleanComment;