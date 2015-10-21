var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: __dirname,
	entry: "./spec/index.js",
	output: {
		path: __dirname,
		filename: "./spec/build/index.js"
	},
	debug: true,
	devtool: '#source-map',
	watchDelay: 200
};
