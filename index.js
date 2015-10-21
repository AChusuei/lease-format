#!/usr/bin/env node

var program = require('commander');
var config = require('./package.json');

var cli = require('./src/cli');
var web = require('./src/web');

program
	.version(config.version)
	.option('-l, --locale [en_US]', 'Locale (en_US or en_GB)', 'en_US')
	.option('-e, --include-existential', 'Include existential fields in the output (e.g. transactionSizeExists: true)')
	.option('-m, --include-meta', 'Return meta data about the fields in addition to formatted data')
	.option('-s, --sectioned', 'Return data grouped into sections (noop with --include-meta')
	.option('-P, --pretty-print', 'Pretty print the output')
	.option('-w, --serve', 'Run as a webservice')
	.option('-p, --port [7000]', 'Port on which to run the webservice', 7000)
	.parse(process.argv);

if (program.serve) {
	web(program);
} else {
	cli(program);
}
