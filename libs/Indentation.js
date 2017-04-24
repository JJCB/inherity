/*
inherity
@class Identation
@author Jhon Castro
 */

/*
 * Module dependencies.
 */

const pathNode        = require("path");
//const util            = require("./util"),
      //config          = require("./config"),
      //dependencies    = require("./dependencies");

/*
 * Expose library.
 */

var identation;

identation = function(opts){
  this.path     = opts.path;
  this.content  = opts.content;
  this.language = opts.language;
  this.fixIdent	= opts.fixIdent;
  this.init();
} 

identation.prototype.init = function(){
  let keyword,      
      lines   = this.content.split('\n'),
      regex   = {
        comment : {
          line : new RegExp(/\/\//),
          multiple : {
            init : /\/\*/
          }  
        },
        space : / + {1}/g,
        path : {
          back : /\.\.\//,
          clean: /.+?(?=\*)/
        }
      };
      
  let lengthSpaceTemp = 0
  let isActiveComment   = false;

  for(line in lines){
    
    if(this.language.comment.isTab){
      let lengthSpace = 0 || line.match(regex.space).toString().length;
      
      if(isActiveComment && lengthSpaceTemp < lengthSpace){
        continue;
      }

      if(regex.comment.line.exec(line)){
        lengthSpaceTemp = lengthSpace;
        isActiveComment = true;
        continue;
      }

      isActiveComment = false;
      keyword = this.language.matcher.exec(line);

      if(keyword){
        let filepaths     = keyword[1].trim(),
            filepathsFix  = [],
            pathBase      = this.language.baseDir || pathNode.dirname(path),
            fnPath        = (regex.path.back.test(filepaths))? pathNode.resolve : pathNode.join;

        filepathsFix.push(fnPath(pathBase, filepaths));
        
        if(regex.comment.multiple.init.test(filepathsFix[0])){
          filepathsFix = glob.sync(filepathsFix[0].match(regex.path.clean)[0] + "/**/*" + this.language.ext);
        }

        this.fixIdent(filepathsFix, path);        
      }
    }
  }
} 