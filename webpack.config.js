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
        	// put this back and remove the json! from the JS files
        	// when the front end no longer uses RequireJS
            // { test: /\.json$/, loader: "json" }
        ]
    },
	resolve: {
		alias: {
			'lease-attributes': '../attributes'
		}
	},
	amd: false,
	debug: true,
	devtool: '#source-map'
};
