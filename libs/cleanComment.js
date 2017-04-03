  let cleanComment = (str, comment) =>{
    var dataReplace=[]
    var count = 0;

    var newStr = str.replace(/"(".*?")|('.*?')/g, function(valor){

      let  nameReplace = "&&&&" + count
      dataReplace.push(valor)
      count++
      return nameReplace;
    })

    newStr = newStr.replace(comment.multilines, '')

    if (!comment.isTab) {

      newStr = newStr.replace(comment.lines, '')
    }
    newStr = newStr.replace(/\n{2,}/g, '')

    for (var i = 0; i < dataReplace.length; i++) {

      let regex = "&&&&"+i
      regex = new RegExp(regex,"g");
      newStr = newStr.replace(regex,dataReplace[i] )
    }
    return newStr
  }

module.exports =  cleanComment