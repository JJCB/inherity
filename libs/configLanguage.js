configLanguage = {
  pug: {
    matcher       : /(?:include|extends):?.*\s+(.*.pug)/,
    base          : process.cwd(),
    ext           : ".pug",
    paths         : "",
    baseDir       : false,
    dependencies  : {},
    src           : [],
    comment       :{
      multilines : /(<!--(\s|.)*?(-->))/,
      lines : /\/\/.*/g,
      isTab : true
    }
  },
  stylus: {
    matcher       : /^\s*@(?:import|require).*?['"]([^'"]+)['"]\s*/,
    base          : process.cwd(),
    ext           : ".styl",
    paths         : "",
    baseDir       : false,
    dependencies  : {},
    src           : [],
    comment       :{
      multilines : /\/\*(.|\s)*?(\*\/)/g,
      lines : /\/\/.*/g,
      isTab : false
    }
  }
}

module.exports = configLanguage