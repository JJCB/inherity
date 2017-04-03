var glob          = require("glob")

let util = {
	removeDuplicates : (array) =>{
		return array.filter(function (item, index, self) {
			return self.indexOf(item) == index;
		});
	},
	getPathsFromGlobs : (directory) => {
		let arrayPaths = []

		for (let z = 0, lengthDirectory= directory.length; z < lengthDirectory; z++) {

			let pathCurrent = directory[z]
			let paths = glob.sync(pathCurrent);
			arrayPaths =  arrayPaths.concat(paths)
		}

		return arrayPaths
	}
}

module.exports = util
