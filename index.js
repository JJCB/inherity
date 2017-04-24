/*
inherity
@class inherity
@author Jhon Castro
 */

/*
 * Module dependencies.
 */

const util            = require("./util"),
      config          = require("./config"),
      dependencies    = require("./dependencies");

/*
 * Expose library.
 */

inherity = function(languages){
  this.languages = languages;
  this.init();
  //this.setEventsChunk();  
}

inherity.prototype.init = function(){
  for (lang in this.languages){
    config[lang]        = Object.assign({}, config[lang], this.languages[lang]);
    config[lang].paths  = util.getPathsFromGlobs(config[lang].src);
    //config[lang].dependencies = dependencies.createDependencies(config[lang])
    dependencies.init(config[lang]);
  }
}

/*
inherity.prototype.setEventsChunk = function(){
  switch(this.options.chunk.type){
    case "deleted": break;
    case "added":
    case "changed":
      dependencies.setDependencies({});
      //config[options.language].dependencies = {};
      //config[options.language] = dependencies.createDependencies(config[options.language]);
      break;
  }  
}
*/
module.exports = (options) => {  
  return {
    getListDependencies : (options) => {
      //this.setEventsChunk();
      return dependencies.get(options.chunk, config[options.language]);
      //eturn dependencies.getDependencies(options.chunk.path, config[options.language]);
    }
  }
}