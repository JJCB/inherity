var glob          = require("glob")

module.exports = {
	removeDuplicates : (array) =>{
		return array.filter(function (item, index, self) {
			return self.indexOf(item) == index;
		});
	},
	getPathsFromGlobs : (directory) => {
		let arrayPaths = []

		for (let i = 0, lengthDirectory= directory.length; i < lengthDirectory; i++) {

			let pathCurrent = directory[i]
			let paths = glob.sync(pathCurrent);
			arrayPaths =  arrayPaths.concat(paths)
		}

		return arrayPaths
	}
}
