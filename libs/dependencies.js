const fs              = require('fs'),
      pathNode        = require("path"),
      glob            = require("glob"),

      cleanComments   = require("./cleanComment"),
      indentation     = require("./util/Identation"),
      util            = require("./util");

//let  configLanguage = {};

var dependencies;

dependencies = function(language){
  this.language = language;
  this.init();
}

dependencies.prototype.init = function(){
  this.create();
}

dependencies.prototype.create = function(){
  //let paths = this.language.paths;

  //for (let i = 0, len = paths.length; i < len; i++) {
  for(path in this.language.paths){
    //let path    = paths[i];
    //let content = fs.readFileSync(path).toString()
    //let content = data.toString();
    content = cleanComments({
      content: fs.readFileSync(path).toString(),
      comment: this.language
    });
    
    indentation({
      path    : path,
      content : content,
      language: this.language,
      fixIdent: this.set
    });
  }
  //return configLanguage.dependencies;
}

dependencies.prototype.setIndentation = function(path){
  let keyword, comment, filepath,
      //matcher = this.language.matcher,
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

        this.set(filepathsFix, path);
      }
    }

  }
}

dependencies.prototype.set = function(filepaths, path){
  for(filepath in filepaths){
    if(typeof this.language.dependencies[filepath] == "undefined"){
      this.language.dependencies[filepath]      = {};
      this.language.dependencies[filepath].list = [];
    }
    this.language.dependencies[filepath].list.push(path);
  }  
}

dependencies.prototype.get = function(chunk, language){
  let listDepent = [],
      self       = this,
      path       = chunk.path;

  Events({
    event  : chunk.type,
    changed: this.set
  });

  listDepent.push(path);

  self.recursiveDepent = function(pathFile){
    if( typeof language.dependencies[pathFile] !== "undefined") {
      for(var i in language.dependencies[pathFile].list){
        var dep = dependenciesPath[i];
        listDepent.push(dep);
        self.recursiveDepent(dep);
      }
    }
  }
 
  self.recursiveDepent(path);
  return util.removeDuplicates(listDepent);
}

/*
 old
*/

fn = {
  createDependencies: (config) => {
    configLanguage = config
    let paths = configLanguage.paths
    
    for (let k = 0, len = paths.length; k < len; k++) {

      let path    = paths[k];
      let data    = fs.readFileSync(path)
      let content = data.toString();
      content     = cleanComments({content: content, comment:configLanguage.comment})
      fn._indentBasedLanguage(path, content)
    }
    return configLanguage.dependencies;
  },

  _indentBasedLanguage: (path, content) => {

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

          for (filepath in filesDirectoryMoment) {
            fn._saveDependencies(filepath, path)
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