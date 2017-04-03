var fs              = require('fs')
var pathNode        = require("path")
var glob            = require("glob")

var cleanComments   = require("./cleanComment") 
var util            = require("./util")

let  configLanguage = {}

fn = {
  createDependencies: (config) => {
    configLanguage = config
    let paths = configLanguage.paths
    
    for (let k = 0, len = paths.length; k < len; k++) {

      let path    = paths[k];
      let data    = fs.readFileSync(path)
      let content = data.toString();
      content     = cleanComments(content, configLanguage.comment)
      fn._indentBasedLanguage(path, content)
    }
    return configLanguage
  },

  _indentBasedLanguage : (path, content) =>{

    path = pathNode.join(configLanguage.base, path);
    const reCommentStart = new RegExp(/\/\//);
    const matcher =  configLanguage.matcher
    const lines = content.split('\n');

    let keyword;
    let comment;
    let filepath;
    let lengthSpaceTemp = 0;
    let activeComment = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if(configLanguage.comment.isTab){

        let hasSpace    = line.match(/ + {1}/g);
        let lengthSpace = 0;

        if (hasSpace) {
          lengthSpace = line.match(/ + {1}/g).toString().length;
        }

        if (activeComment && lengthSpaceTemp < lengthSpace) {
          continue;
        }
        comment = reCommentStart.exec(line);
        if (comment) {
          lengthSpaceTemp = lengthSpace;
          activeComment = true;
          continue;
        }

        activeComment = false;
      }

      keyword = matcher.exec(line);

      if (keyword) {

        filepath = keyword[1].trim();
        let pathBase = configLanguage.baseDir || pathNode.dirname(path)
        filepath = (/\.\.\//.test(filepath))? pathNode.resolve(pathBase, filepath) : pathNode.join(pathBase, filepath ) 

        if (/\/\*/.test(filepath)) {

          let baseDirCurrent = filepath.match(/.+?(?=\*)/);
          var filesDirectoryMoment = glob.sync(baseDirCurrent[0] + "/**/*" + configLanguage.ext);

          for (var j = 0, leng = filesDirectoryMoment.length ; j <leng ; j++) {

            let pathTemp =  filesDirectoryMoment[j]
            fn._saveDependencies(pathTemp, path)
          }
        }
        else{

          fn._saveDependencies(filepath, path)
        }

      }
    }
  },

  _saveDependencies : (filepath, path) => {

    if ( typeof configLanguage.dependencies[filepath]== "undefined" ){

      configLanguage.dependencies[filepath]      = {};
      configLanguage.dependencies[filepath].list =[];
    }
    configLanguage.dependencies[filepath].list.push(path);

  },

  listDependencies: (path, configLanguage) => {

    var listDepent = []

    listDepent.push(path)
    function recursiveDepent (pathFile){

      if( typeof configLanguage.dependencies[pathFile] !== "undefined") {
        let dependenciesPath = configLanguage.dependencies[pathFile].list

        for ( var i in dependenciesPath) {
          var dep = dependenciesPath[i];
          listDepent.push(dep);
          recursiveDepent(dep)
        }
      }
    }
    recursiveDepent(path);
    
    listDepent = util.removeDuplicates(listDepent)

    return listDepent;
  }
}

module.exports  = fn

