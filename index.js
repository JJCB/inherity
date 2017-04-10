/*
index
@class index
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


module.exports = (options) => {

  for (key in options){
    config[key]       = Object.assign({}, config[key], options[key]);
    config[key].paths = util.getPathsFromGlobs(config[key].src);
    config[key]       = dependencies.createDependencies(config[key])
  }
  
  return {
    getListDependencies : (options) => {
      if(options.chunk.type!=="deleted"){
        config[options.language].dependencies = {}
        config[options.language] = dependencies.createDependencies(config[options.language])
      }

      return dependencies.listDependencies(options.chunk.path, config[options.language]);
    }
  }
}