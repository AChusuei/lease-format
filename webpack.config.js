var path = require('path');
var webpack = require('webpack');

module.exports = {
	context: __dirname,
	entry: "./spec/index.js",
	output: {
		path: __dirname,
		filename: "./spec/build/index.js"
	},
	module: {
        loaders: [
            { test: /\.json$/, loader: "json" }
        ]
    },
	amd: false,
	debug: true,
	devtool: '#source-map'
};
